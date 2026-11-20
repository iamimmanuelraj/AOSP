// Web installer: runs the flows in DEVICES/<brand>/<codename>/installer.json over WebUSB (fastboot).
// Bundled by site/build.mjs (esbuild) into assets/installer.js. Device-agnostic: everything device-specific
// (checks, partitions, slots, files, pinned hashes, texts) comes from the JSON.
import { FastbootDevice, setDebugLevel, setDebugLogger } from '@lineageos-infra/android-fastboot';
import { createSHA256 } from 'hash-wasm';
import { runFlow } from './runner.js';

const $ = (s, el = document) => el.querySelector(s);
const h = (tag, attrs = {}, ...kids) => {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') el.className = v; else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (v !== false && v !== null && v !== undefined) el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c !== null && c !== undefined && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
};
const fmtBytes = (n) => n >= 1 << 30 ? `${(n / (1 << 30)).toFixed(2)} GB` : n >= 1 << 20 ? `${(n / (1 << 20)).toFixed(1)} MB` : `${(n / 1024).toFixed(0)} KB`;

const root = $('#installer');
const BASE = root.dataset.base;
const devices = JSON.parse($('#installer-devices').textContent); // [{codename, name, url}]

const state = { cfg: null, flow: null, files: new Map(), verified: new Map(), opts: {}, fb: null, running: false };

// ---------- log ----------
const logBox = h('pre', { class: 'inst-log', 'aria-live': 'polite' });
const log = (msg, cls = '') => { const line = h('span', { class: cls }, `${new Date().toLocaleTimeString()}  ${msg}\n`); logBox.append(line); logBox.scrollTop = logBox.scrollHeight; };
setDebugLevel(1);
setDebugLogger((...a) => { const s = a.join(' '); if (!/^(Response|Command): (OKAY|INFO)?\s*$/.test(s)) log(s, 'dim'); });

// ---------- support check ----------
function supportIssues() {
  const issues = [];
  if (!window.isSecureContext) issues.push('This page must be opened over HTTPS.');
  if (!('usb' in navigator)) issues.push('This browser cannot talk to USB devices. Use Chrome, Edge, Brave or Opera on a computer (not Firefox or Safari).');
  return issues;
}

// ---------- device + flow pickers ----------
async function loadDevice(codename) {
  const d = devices.find((x) => x.codename === codename);
  state.cfg = await (await fetch(d.url)).json();
  state.files.clear(); state.verified.clear();
  renderFlows();
}

function renderFlows() {
  const cfg = state.cfg;
  const tabs = $('#inst-flows'); tabs.replaceChildren();
  for (const [id, f] of Object.entries(cfg.flows)) {
    tabs.append(h('button', { class: 'chip-btn', type: 'button', 'aria-pressed': String(state.flow === id), onclick: () => { state.flow = id; renderFlows(); } }, f.title));
  }
  if (!state.flow || !cfg.flows[state.flow]) { state.flow = Object.keys(cfg.flows)[0]; return renderFlows(); }
  renderFlow();
}

function renderFlow() {
  const f = state.cfg.flows[state.flow];
  const box = $('#inst-flow'); box.replaceChildren();
  box.append(h('p', { class: 'lead' }, f.summary));
  if (f.enabled === false) { box.append(h('div', { class: 'inst-alert' }, f.disabledText || 'Not available yet.')); return; }
  if (f.before?.length) box.append(h('div', { class: 'inst-card' }, h('h3', {}, 'Before you start'), h('ol', {}, f.before.map((t) => h('li', {}, t)))));

  // options
  state.opts = {};
  for (const [k, o] of Object.entries(f.options || {})) {
    state.opts[k] = o.default;
    box.append(h('label', { class: 'inst-opt' },
      h('input', { type: 'checkbox', checked: o.default, onchange: (e) => { state.opts[k] = e.target.checked; renderFiles(); } }),
      h('span', {}, h('b', {}, o.label), h('br'), h('span', { class: 'muted' }, o.help || ''))));
  }
  box.append(h('div', { id: 'inst-files' }));
  box.append(h('div', { class: 'inst-card' },
    h('h3', {}, 'Run'),
    h('p', { class: 'muted' }, 'Connect the phone in FASTBOOT mode with a good USB cable, directly to the computer (no hub). Keep this tab open and the computer awake until it says done.'),
    h('div', { class: 'actions' },
      h('button', { class: 'btn btn-ghost', id: 'inst-connect', type: 'button', onclick: connect }, 'Connect phone'),
      h('button', { class: 'btn btn-accent', id: 'inst-start', type: 'button', onclick: run, disabled: true }, `Start: ${f.title}`)),
    h('div', { id: 'inst-prompt' }),
    h('div', { class: 'inst-progress', hidden: true, id: 'inst-progress' }, h('div', { class: 'bar' }), h('span', { class: 'label' }))));
  renderFiles();
}

// files the current flow + options need
function neededFiles() {
  const f = state.cfg.flows[state.flow];
  const ids = new Set(f.files || []);
  for (const s of f.steps) if (s.file && (!s.if || state.opts[s.if])) ids.add(s.file);
  return [...ids];
}

function renderFiles() {
  const box = $('#inst-files'); if (!box) return;
  box.replaceChildren();
  const need = neededFiles();
  if (!need.length) { updateStart(); return; }
  const bySource = {};
  for (const id of need) (bySource[state.cfg.files[id].from] ||= []).push(id);
  for (const [src, ids] of Object.entries(bySource)) {
    const s = state.cfg.sources[src];
    const table = h('table', {}, h('thead', {}, h('tr', {}, h('th', {}, 'File'), h('th', {}, 'Size'), h('th', {}, 'Check'))),
      h('tbody', {}, ids.map((id) => {
        const file = state.files.get(id); const v = state.verified.get(id);
        return h('tr', {}, h('td', { class: 'mono' }, file?.name || state.cfg.files[id].label),
          h('td', {}, file ? fmtBytes(file.size) : '-'),
          h('td', { class: v === true ? 'ok' : v === false ? 'bad' : 'muted' }, !file ? 'missing' : v === true ? 'SHA-256 OK' : v === false ? 'WRONG FILE' : typeof v === 'string' ? v : 'not checked'));
      })));
    box.append(h('div', { class: 'inst-card' }, h('h3', {}, s.title), h('p', { class: 'muted' }, s.help),
      h('div', { class: 'actions' },
        h('label', { class: 'btn btn-ghost btn-sm' }, 'Select files', h('input', { type: 'file', multiple: true, hidden: true, onchange: (e) => addFiles(e.target.files) })),
        h('label', { class: 'btn btn-ghost btn-sm' }, 'Select folder', h('input', { type: 'file', webkitdirectory: true, hidden: true, onchange: (e) => addFiles(e.target.files) })),
        h('button', { class: 'btn btn-accent btn-sm', type: 'button', onclick: () => verify(ids) }, 'Check files')),
      h('div', { class: 'table-wrap' }, table)));
  }
  updateStart();
}

function addFiles(list) {
  for (const file of list) {
    for (const [id, spec] of Object.entries(state.cfg.files)) {
      if (new RegExp(spec.match).test(file.name)) { state.files.set(id, file); state.verified.delete(id); }
    }
  }
  renderFiles();
}

async function sha256(file, onProgress) {
  const hasher = await createSHA256(); hasher.init();
  const reader = file.stream().getReader(); let done = 0;
  for (;;) { const { value, done: end } = await reader.read(); if (end) break; hasher.update(value); done += value.length; onProgress(done / file.size); }
  return hasher.digest('hex');
}

async function verify(ids) {
  // release files: hashes from the SHA256SUMS the user selected; stock files: hashes pinned in the device JSON
  let sums = null;
  const sumsId = Object.keys(state.cfg.files).find((k) => state.cfg.files[k].checksums && ids.includes(k));
  if (sumsId) {
    const sf = state.files.get(sumsId);
    if (!sf) { log('Select the SHA256SUMS file from the release too.', 'bad'); return; }
    sums = new Map((await sf.text()).split('\n').map((l) => l.trim().split(/\s+\*?/)).filter((p) => p.length >= 2).map(([hash, name]) => [name.split('/').pop(), hash.toLowerCase()]));
    state.verified.set(sumsId, true);
  }
  for (const id of ids) {
    const spec = state.cfg.files[id]; const file = state.files.get(id);
    if (!file || spec.checksums) continue;
    const want = spec.sha256 || sums?.get(file.name);
    if (!want) { state.verified.set(id, false); log(`${file.name}: not listed in SHA256SUMS`, 'bad'); renderFiles(); continue; }
    if (spec.size && file.size !== spec.size) { state.verified.set(id, false); log(`${file.name}: wrong size`, 'bad'); renderFiles(); continue; }
    const got = await sha256(file, (p) => { state.verified.set(id, `checking ${Math.floor(p * 100)} %`); if (Math.random() < 0.05) renderFiles(); });
    state.verified.set(id, got === want);
    log(`${file.name}: ${got === want ? 'SHA-256 OK' : `SHA-256 MISMATCH (got ${got})`}`, got === want ? 'ok' : 'bad');
    renderFiles();
  }
}

function filesReady() { return neededFiles().every((id) => state.verified.get(id) === true); }
function updateStart() { const b = $('#inst-start'); if (b) b.disabled = state.running || !state.fb?.isConnected || !filesReady(); }

// ---------- USB ----------
async function connect() {
  try {
    state.fb = state.fb || new FastbootDevice();
    await state.fb.connect();
    const product = await state.fb.getVariable('product');
    log(`Connected: ${product || 'unknown'} (serial ${state.fb.device.serialNumber || '?'})`, 'ok');
    $('#inst-connect').textContent = `Connected: ${product || 'device'}`;
  } catch (e) { log(`Could not connect: ${e.message}`, 'bad'); }
  updateStart();
}

function prompt(text, button, cls = '') {
  const box = $('#inst-prompt');
  return new Promise((resolve) => {
    box.replaceChildren(h('div', { class: `inst-alert ${cls}` }, h('p', {}, text),
      button ? h('button', { class: 'btn btn-accent btn-sm', type: 'button', onclick: () => { box.replaceChildren(); resolve(); } }, button) : null));
    if (!button) resolve();
  });
}

function progress(label, frac) {
  const p = $('#inst-progress'); p.hidden = frac === null;
  if (frac !== null) { $('.bar', p).style.width = `${Math.round(frac * 100)}%`; $('.label', p).textContent = `${label} · ${Math.round(frac * 100)} %`; }
}

// ---------- run a flow ----------
async function run() {
  const flow = state.cfg.flows[state.flow];
  if (!filesReady()) return log('Check the files first.', 'bad');
  state.running = true; updateStart();
  let wake = null; try { wake = await navigator.wakeLock?.request('screen'); } catch {}
  log(`Starting: ${flow.title}`, 'ok');
  try {
    await runFlow({ fb: state.fb, cfg: state.cfg, flow, files: state.files, opts: state.opts, log,
      progress: (label, frac) => progress(label, frac),
      ask: (text, button, cls) => prompt(text, button, cls),
      clearAsk: () => $('#inst-prompt').replaceChildren(),
      reconnect: async () => { if (!state.fb.isConnected) await state.fb.connect(); } });
  } catch (e) {
    log(`STOPPED: ${e.message}${e.bootloaderMessage ? ` (${e.bootloaderMessage})` : ''}`, 'bad');
    prompt(`Stopped: ${e.message}. Nothing after this step was done. Do not reboot into the system if a flash step failed: fix the problem and run again.`, null, 'bad');
  } finally {
    progress('', null); state.running = false; updateStart(); try { await wake?.release(); } catch {}
  }
}

// ---------- boot ----------
const issues = supportIssues();
root.replaceChildren(
  issues.length ? h('div', { class: 'inst-alert bad' }, issues.map((t) => h('p', {}, t))) : '',
  h('div', { class: 'inst-card' }, h('h3', {}, 'Your phone'),
    h('div', { class: 'filters' }, devices.map((d) => h('button', { class: 'chip-btn', type: 'button', 'aria-pressed': 'false',
      onclick: (e) => { root.querySelectorAll('.inst-dev').forEach((b) => b.setAttribute('aria-pressed', 'false')); e.target.setAttribute('aria-pressed', 'true'); loadDevice(d.codename); }, }, d.name)).map((b) => { b.classList.add('inst-dev'); return b; }))),
  h('div', { class: 'filters', id: 'inst-flows', role: 'tablist' }),
  h('div', { id: 'inst-flow' }),
  h('details', { class: 'inst-card', open: true }, h('summary', {}, 'Log'), logBox,
    h('button', { class: 'btn btn-ghost btn-sm', type: 'button', onclick: () => navigator.clipboard.writeText(logBox.textContent) }, 'Copy log')),
);
if (devices.length === 1) root.querySelector('.inst-dev').click();
