// Test harness: runs a flow from a device's installer.json against a real phone from Node, with the same
// runner the web page uses (WebUSB from the `usb` package, no browser chooser).
//   node site/installer/test-flow.mjs <DEVICES/.../installer.json> <flow> [--opt name=true|false ...] [--plan] [file ...]
// --plan   connect, run only the read-only steps (check, slot) and print what the rest would do
// files    paths; each is matched to the config's file ids by name, exactly like the web page
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { WebUSB } from 'usb';
import { FastbootDevice, setDebugLevel, setDebugLogger } from '@lineageos-infra/android-fastboot';
import { runFlow } from './runner.js';

const args = process.argv.slice(2);
const [cfgPath, flowId] = args;
const plan = args.includes('--plan');
const opts = {}; const paths = [];
for (let i = 2; i < args.length; i++) {
  if (args[i] === '--opt') { const [k, v] = args[++i].split('='); opts[k] = v === 'true'; }
  else if (args[i] !== '--plan') paths.push(args[i]);
}
const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
const flow = cfg.flows[flowId];
if (!flow) { console.error(`flows: ${Object.keys(cfg.flows).join(', ')}`); process.exit(2); }
for (const [k, o] of Object.entries(flow.options || {})) if (!(k in opts)) opts[k] = o.default;

Object.defineProperty(globalThis.navigator, 'usb', { value: new WebUSB({ allowAllDevices: true }), configurable: true });
const t0 = Date.now();
const log = (m, cls = '') => console.log(`${((Date.now() - t0) / 1000).toFixed(1).padStart(7)}s ${cls === 'bad' ? '!! ' : ''}${m}`);
setDebugLevel(0);

// files: match names to ids, verify like the web page (SHA256SUMS for release files, pinned hashes for others)
const files = new Map();
for (const p of paths) for (const [id, spec] of Object.entries(cfg.files)) {
  if (new RegExp(spec.match).test(path.basename(p))) files.set(id, Object.assign(await fs.openAsBlob(p), { name: path.basename(p), path: p }));
}
const sha = (p) => new Promise((res, rej) => { const h = crypto.createHash('sha256'); fs.createReadStream(p).on('data', (d) => h.update(d)).on('end', () => res(h.digest('hex'))).on('error', rej); });
const need = new Set(flow.files || []); flow.steps.forEach((s) => s.file && (!s.if || opts[s.if]) && need.add(s.file));
const sumsId = [...need].find((id) => cfg.files[id].checksums);
const sums = sumsId && files.get(sumsId) ? new Map(fs.readFileSync(files.get(sumsId).path, 'utf8').split('\n').map((l) => l.trim().split(/\s+\*?/)).filter((x) => x.length >= 2).map(([h, n]) => [path.basename(n), h])) : null;
for (const id of need) {
  const f = files.get(id); const spec = cfg.files[id];
  if (!f) { log(`missing file for ${id} (${spec.label})`, 'bad'); process.exit(1); }
  if (spec.checksums) continue;
  const want = spec.sha256 || sums?.get(f.name);
  const got = await sha(f.path);
  if (got !== want) { log(`${f.name}: SHA-256 mismatch`, 'bad'); process.exit(1); }
  log(`${f.name}: SHA-256 OK`);
}

const fb = new FastbootDevice();
log('waiting for a fastboot device...');
await fb.connect();
log(`connected: product=${await fb.getVariable('product')} current-slot=${await fb.getVariable('current-slot')} unlocked=${await fb.getVariable('unlocked')} max-download-size=${await fb.getVariable('max-download-size')}`);

const ro = plan ? new Proxy(fb, { get(t, k) {
  if (['flashBlob', 'runCommand', 'reboot'].includes(k)) return async (...a) => { log(`   (plan) ${k}(${a.filter((x) => typeof x === 'string').join(', ')})`); return { text: '' }; };
  const v = t[k]; return typeof v === 'function' ? v.bind(t) : v;
} }) : fb;
let last = -1;
const result = await runFlow({ fb: ro, cfg, flow, files, opts, log,
  progress: (label, frac) => { if (frac === null) { last = -1; return; } const p = Math.floor(frac * 10); if (p !== last) { last = p; log(`   ${label} ${p * 10} %`); } },
  ask: async (text, button) => log(`${button ? `[${button}] ` : ''}${text}`),
  clearAsk: () => {}, reconnect: async () => { if (!fb.isConnected) await fb.connect(); } });
log(`result: ${result}`);
process.exit(0);
