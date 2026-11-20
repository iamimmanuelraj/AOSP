// Runs one flow of a device's installer.json against a connected FastbootDevice.
// Shared by the web page (main.js) and the Node test harness (test-flow.mjs), so both run the same steps.
// io: { fb, cfg, flow, files: Map(id -> Blob/File), opts, log(msg, cls), progress(label, frac|null),
//       ask(text, buttonLabel|null, cls) -> Promise, clearAsk(), reconnect() -> Promise }
const fmtBytes = (n) => n >= 1 << 30 ? `${(n / (1 << 30)).toFixed(2)} GB` : n >= 1 << 20 ? `${(n / (1 << 20)).toFixed(1)} MB` : `${(n / 1024).toFixed(0)} KB`;

export async function runFlow(io) {
  const { fb, cfg, flow, files, opts, log } = io;
  const slots = {};
  const slotName = (s) => (s in slots ? slots[s] : s);
  const steps = flow.steps.filter((s) => !s.if || opts[s.if]);
  for (const [i, s] of steps.entries()) {
    const tag = `[${i + 1}/${steps.length}]`;
    switch (s.do) {
      case 'check': {
        const v = await fb.getVariable(s.var);
        log(`${tag} ${s.var} = ${v}`);
        if (!s.in.includes(v)) {
          if (s.skipRestIfNot) { log(s.note || 'Nothing to do.', 'ok'); await io.ask(s.note || 'Nothing to do.', null, 'ok'); return 'skipped'; }
          throw new Error(s.fail || `${s.var} is ${v}, expected ${s.in.join(' or ')}`);
        }
        break;
      }
      case 'slot': {
        const cur = await fb.getSlot();
        if (!cur) throw new Error('The phone did not report its current slot.');
        slots[s.as] = s.from === 'other' ? (cur === 'a' ? 'b' : 'a') : cur;
        log(`${tag} target slot: ${slots[s.as]}`);
        break;
      }
      case 'flash': {
        const file = files.get(s.file);
        if (!file) throw new Error(`File ${cfg.files[s.file]?.label || s.file} was not selected.`);
        const targets = s.slot === 'both' ? cfg.slots : s.slot === 'none' ? [null] : [slotName(s.slot)];
        for (const t of targets) {
          const part = t ? `${s.part}_${t}` : s.part;
          log(`${tag} flash ${part} <- ${file.name} (${fmtBytes(file.size)})`);
          await fb.flashBlob(part, 'current', file, (p) => io.progress(`Flashing ${part}`, p));
          io.progress('', null);
        }
        break;
      }
      case 'erase': log(`${tag} erase ${s.part}`); await fb.runCommand(`erase:${s.part}`); break;
      case 'zero':
        log(`${tag} clear ${s.part}`);
        await fb.flashBlob(s.part, 'current', new Blob([new Uint8Array(s.bytes)]), () => {});
        break;
      case 'command': {
        if (s.phone) io.ask(s.phone, null, 'phone');
        log(`${tag} ${s.cmd}`);
        try { const r = await fb.runCommand(s.cmd); if (r.text) log(r.text.trim()); }
        catch (e) { if (s.optional) log(`${s.cmd}: ${e.message} (continuing)`, 'dim'); else throw e; }
        io.clearAsk();
        break;
      }
      case 'reconnect': await io.ask(s.text, 'Reconnect'); await io.reconnect(); log(`${tag} reconnected`, 'ok'); break;
      case 'confirm': await io.ask(s.text, 'Yes, continue'); break;
      case 'setActive': log(`${tag} set active slot ${slotName(s.slot)}`); await fb.runCommand(`set_active:${slotName(s.slot)}`); break;
      case 'reboot': log(`${tag} reboot${s.to ? ` ${s.to}` : ''}`); await fb.reboot(s.to || '', false); break;
      case 'done': log(s.text, 'ok'); await io.ask(s.text, null, 'ok'); break;
      default: throw new Error(`Unknown step type ${s.do}`);
    }
  }
  return 'done';
}
