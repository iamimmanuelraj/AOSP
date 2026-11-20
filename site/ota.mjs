// OTA feed for the LineageOS Updater (v2 JSON, one static file per device / ROM / release type / variant).
//
// Record a signed OTA zip in its release page (the Markdown stays the source of truth):
//   node site/ota.mjs add DEVICES/<brand>/<codename>/ROMS/<OS>/<ver>/<date>/README.md <vanilla|gapps> <ota.zip> [--url <download url>]
// It reads META-INF/com/android/metadata from the zip and writes an `ota:` block into the README front matter.
// build.mjs then publishes, for every device that has releases:
//   ota/<codename>/<os>-<major>/<type>-<variant>.json   (newest release with `ota_enabled: true`; [] otherwise)
// The device tree points the Updater there:
//   lineage.updater.uri=https://<site>/ota/{device}/lineageos-24/{type}-<variant>.json
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
import yaml from 'js-yaml';

export const VARIANTS = ['vanilla', 'gapps'];
const REPO = 'https://github.com/iamimmanuelraj/AOSP';

// Feed folder of a release: lineageos-24, lineageos-23.2 -> lineageos-23 ...
export const feedSlug = (os, version) => `${os.toLowerCase().replace(/[^a-z0-9]+/g, '')}-${String(version).split('.')[0]}`;

// Updater v2 entries for one release + variant, or null
export function feedEntry(release, variant) {
  const o = release.data?.ota?.[variant];
  if (!release.data?.ota_enabled || !o) return null;
  for (const k of ['datetime', 'type', 'version', 'filename', 'sha256', 'size', 'url', 'os_sdk_level']) {
    if (o[k] === undefined || o[k] === null || o[k] === '') throw new Error(`${release.file}: ota.${variant}.${k} is missing`);
  }
  return {
    datetime: Number(o.datetime), type: String(o.type).toLowerCase(), version: String(o.version),
    files: [{ filename: o.filename, sha256: o.sha256, size: Number(o.size), url: o.url,
      os_patch_level: o.os_patch_level || undefined, os_sdk_level: Number(o.os_sdk_level),
      ota_property_files: o.ota_property_files || undefined }],
  };
}

// Writes every feed file into outDir/ota/... ; returns the list of files written
export function writeFeeds(devices, outDir) {
  const written = [];
  for (const d of devices) {
    for (const rom of d.roms) {
      const byFeed = new Map();
      for (const r of rom.releases) {
        const slug = feedSlug(rom.os, r.version);
        if (!byFeed.has(slug)) byFeed.set(slug, []);
        byFeed.get(slug).push(r);
      }
      for (const [slug, releases] of byFeed) {
        const types = new Set(['unofficial']);
        releases.forEach((r) => VARIANTS.forEach((v) => r.data?.ota?.[v]?.type && types.add(String(r.data.ota[v].type).toLowerCase())));
        for (const type of types) for (const v of VARIANTS) {
          // newest release with an OTA for this type + variant (releases are sorted newest first)
          const e = releases.map((r) => feedEntry(r, v)).find((x) => x && x.type === type);
          const f = path.join(outDir, 'ota', d.codename, slug, `${type}-${v}.json`);
          fs.mkdirSync(path.dirname(f), { recursive: true });
          fs.writeFileSync(f, JSON.stringify(e ? [e] : [], null, 1) + '\n'); // [] = "no update" (a 404 would show an error)
          written.push(path.relative(outDir, f));
        }
      }
    }
  }
  return written;
}

// ---------- CLI: record an OTA zip in a release README ----------
function readMetadata(zip) {
  const txt = execFileSync('unzip', ['-p', zip, 'META-INF/com/android/metadata'], { encoding: 'utf8', maxBuffer: 1 << 20 });
  return Object.fromEntries(txt.split('\n').filter(Boolean).map((l) => [l.slice(0, l.indexOf('=')), l.slice(l.indexOf('=') + 1).trim()]));
}

function sha256(file) {
  const h = crypto.createHash('sha256'); const fd = fs.openSync(file, 'r'); const buf = Buffer.alloc(1 << 22);
  let n; while ((n = fs.readSync(fd, buf, 0, buf.length)) > 0) h.update(buf.subarray(0, n));
  fs.closeSync(fd); return h.digest('hex');
}

function add(readme, variant, zip, url) {
  if (!VARIANTS.includes(variant)) throw new Error(`variant must be one of ${VARIANTS.join(', ')}`);
  const src = fs.readFileSync(readme, 'utf8');
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  const data = m ? yaml.load(m[1]) || {} : {};
  const body = m ? src.slice(m[0].length) : src;
  const codename = readme.split(path.sep).join('/').match(/DEVICES\/[^/]+\/([^/]+)\//)[1];
  const md = readMetadata(zip);
  if (md['ota-type'] !== 'AB') throw new Error(`not an A/B OTA (ota-type=${md['ota-type']})`);
  if (md['pre-build']) throw new Error('incremental OTA: only full OTAs go into the feed');
  if (md['pre-device'] && !md['pre-device'].split(',').includes(codename)) throw new Error(`zip is for ${md['pre-device']}, not ${codename}`);
  if (!md['post-timestamp'] || !md['post-sdk-level']) throw new Error('metadata has no post-timestamp / post-sdk-level');
  const filename = path.basename(zip);
  const type = (filename.match(/-(UNOFFICIAL|OFFICIAL|NIGHTLY|EXPERIMENTAL|SNAPSHOT)[-.]/i) || [, 'unofficial'])[1].toLowerCase();
  const version = (filename.match(/^lineage-([\d.]+)-/) || [])[1];
  const tag = (body.match(/releases\/(?:tag|download)\/([^/)\s]+)/) || [])[1];
  const prev = data.ota?.[variant];
  if (prev && Number(prev.datetime) > Number(md['post-timestamp'])) throw new Error('this zip is older than the one already recorded');
  data.ota = data.ota || {};
  data.ota[variant] = {
    filename, type, version: version || String(data.version || ''),
    datetime: Number(md['post-timestamp']), os_sdk_level: Number(md['post-sdk-level']),
    os_patch_level: md['post-security-patch-level'] || undefined,
    ota_property_files: md['ota-property-files'] || undefined,
    size: fs.statSync(zip).size, sha256: sha256(zip),
    url: url || (tag ? `${REPO}/releases/download/${tag}/${filename}` : ''),
  };
  if (data.ota_enabled === undefined) data.ota_enabled = false; // turn on by hand once the files are uploaded and checked
  const out = `---\n${yaml.dump(data, { lineWidth: -1 })}---\n${body}`;
  fs.writeFileSync(readme, out);
  console.log(`recorded ${variant}: ${filename} (${data.ota[variant].size} bytes, ${new Date(data.ota[variant].datetime * 1000).toISOString()})`);
  console.log(data.ota_enabled ? 'ota_enabled is true: the next site build publishes it' : 'ota_enabled is false: set it to true after uploading the zip to the release');
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname)) {
  const [cmd, readme, variant, zip, ...rest] = process.argv.slice(2);
  const url = rest[0] === '--url' ? rest[1] : undefined;
  if (cmd !== 'add' || !readme || !variant || !zip) {
    console.error('usage: node site/ota.mjs add <release README.md> <vanilla|gapps> <ota.zip> [--url <download url>]');
    process.exit(2);
  }
  add(readme, variant, zip, url);
}
