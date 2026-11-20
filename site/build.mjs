// Builds the GitHub Pages site from the Markdown in DEVICES/ (the Markdown stays the source of truth).
//   node site/build.mjs            -> ../_site (base path /)
//   SITE_BASE=/ node site/build.mjs (custom domain or local root)
// Layout it understands (device-agnostic):
//   DEVICES/<brand>/<codename>/README.md                  device page (optional YAML front matter: name, soc, status, image, summary)
//   DEVICES/<brand>/<codename>/**/*.md                    guides and other pages
//   DEVICES/<brand>/<codename>/ROMS/<OS>/README.md        ROM page (+ CHANGELOG.md)
//   DEVICES/<brand>/<codename>/ROMS/<OS>/<version>/<YYYYMMDD>/README.md   one release (banner.png next to it)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Marked } from 'marked';
import yaml from 'js-yaml';
import { page, esc } from './templates.mjs';
import { writeFeeds } from './ota.mjs';
import * as esbuild from 'esbuild';

const SITE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SITE, '..');
const OUT = path.resolve(process.env.SITE_OUT || path.join(ROOT, '_site'));
const BASE = (process.env.SITE_BASE || '/').replace(/\/?$/, '/');
const REPO = 'https://github.com/iamimmanuelraj/AOSP';

// ---------- helpers ----------
const read = (f) => fs.readFileSync(f, 'utf8');
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
  const p = path.join(d, e.name);
  return e.isDirectory() ? walk(p) : [p];
});
const rel = (f) => path.relative(ROOT, f).split(path.sep).join('/');
const isDate = (s) => /^\d{8}$/.test(s);
const fmtDate = (d) => `${d.slice(6, 8)}.${d.slice(4, 6)}.${d.slice(0, 4)}`;
const isoDate = (d) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;

function frontMatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { data: {}, body: src };
  return { data: yaml.load(m[1]) || {}, body: src.slice(m[0].length) };
}

// GitHub-style heading ids, so in-page links written for GitHub keep working
function slugify(text, seen) {
  let s = text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\p{L}\p{N}\s_-]/gu, '').trim().replace(/\s/g, '-');
  const n = seen.get(s) || 0; seen.set(s, n + 1);
  return n ? `${s}-${n}` : s;
}

// Route of a Markdown file: README.md -> its folder, X.md -> folder/x/
function routeOf(file) {
  const r = rel(file).replace(/^DEVICES\//, 'devices/');
  const dir = path.posix.dirname(r);
  const base = path.posix.basename(r, '.md');
  const route = base.toLowerCase() === 'readme' ? `${dir}/` : `${dir}/${base.toLowerCase()}/`;
  return route === './' ? '' : route.toLowerCase();
}

// ---------- collect content ----------
const mdFiles = walk(path.join(ROOT, 'DEVICES')).filter((f) => f.endsWith('.md'));
const assets = walk(path.join(ROOT, 'DEVICES')).filter((f) => !f.endsWith('.md'));
const routeByFile = new Map(mdFiles.map((f) => [path.resolve(f), routeOf(f)]));

function firstHeading(body) { const m = body.match(/^#\s+(.+)$/m); return m ? m[1].trim() : ''; }
function stripTitleAndBadges(body) {
  return body
    .replace(/^#\s+.+\n+/, '')                                                  // the H1 becomes the page hero
    .replace(/^(\[!\[[^\]]*\]\(https:\/\/img\.shields\.io[^)]*\)\]\([^)]*\)\s*)+\n+/m, '') // shields.io badge rows
    .replace(/^!\[[^\]]*\]\(banner\.png\)\n+/m, '');                           // banner is shown in the hero
}


// Short button label for a guide: front matter 'nav', else its heading without the device suffix;
// generic names (About, FAQs, ...) get their folder name in front: "FBE: About"
function guideLabel(f, deviceName) {
  const { data, body } = frontMatter(read(f));
  if (data.nav) return data.nav;
  let t = (firstHeading(body) || path.basename(f, '.md')).replace(/_/g, ' ').replace(/\s+-\s+.*$/, '').trim();
  const folder = path.basename(path.dirname(f));
  if (/^(about|faqs?|flashing instructions|readme)\b/i.test(t) && folder.toUpperCase() !== 'FLASHING') {
    const f2 = folder.length <= 4 ? folder.toUpperCase() : folder.replace(/_/g, ' ').toLowerCase().replace(/^./, (c) => c.toUpperCase());
    t = `${f2}: ${t}`;
  }
  return t;
}

const devices = [];
for (const readme of mdFiles.filter((f) => /^DEVICES\/[^/]+\/[^/]+\/README\.md$/.test(rel(f)))) {
  const dir = path.dirname(readme);
  const [, brand, codename] = rel(readme).split('/');
  const { data, body } = frontMatter(read(readme));
  const h1 = firstHeading(body);
  const name = data.name || h1.replace(/\s*\([^)]*\)\s*$/, '') || codename;
  const summary = data.summary || (body.replace(/^#.*$/m, '').split('\n').find((l) => /^[A-Za-z0-9*_]/.test(l.trim())) || '').replace(/[*_`]/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1');
  const roms = [];
  const romsDir = path.join(dir, 'ROMS');
  if (fs.existsSync(romsDir)) {
    for (const os of fs.readdirSync(romsDir).sort()) {
      const osDir = path.join(romsDir, os);
      if (!fs.statSync(osDir).isDirectory()) continue;
      const releases = [];
      for (const ver of fs.readdirSync(osDir)) {
        const verDir = path.join(osDir, ver);
        if (!fs.statSync(verDir).isDirectory()) continue;
        for (const date of fs.readdirSync(verDir).filter(isDate)) {
          const f = path.join(verDir, date, 'README.md');
          if (!fs.existsSync(f)) continue;
          const fm = frontMatter(read(f));
          const banner = fs.existsSync(path.join(verDir, date, 'banner.png')) ? `${routeOf(f)}banner.png` : null;
          const tag = (fm.body.match(/releases\/(?:tag|download)\/([^/)\s]+)/) || [])[1] || null;
          releases.push({ os, version: ver, date, file: f, route: routeOf(f), title: firstHeading(fm.body), banner, tag, data: fm.data });
        }
      }
      releases.sort((a, b) => b.date.localeCompare(a.date));
      roms.push({ os, route: `${routeOf(path.join(osDir, 'README.md'))}`, hasReadme: fs.existsSync(path.join(osDir, 'README.md')), releases });
    }
  }
  // guides: Markdown in the device folder outside ROMS/ (Standing instructions, FLASHING/...), top-level pages first
  const guides = mdFiles.filter((f) => f.startsWith(dir + path.sep) && f !== readme && !f.startsWith(romsDir + path.sep))
    .map((f) => ({ route: routeOf(f), depth: rel(f).split('/').length, title: guideLabel(f, name) }))
    .filter((g) => g.depth <= 6).sort((a, b) => a.depth - b.depth || a.title.localeCompare(b.title));
  devices.push({ brand, codename, name, summary, data, guides, route: routeOf(readme), file: readme, roms,
    latest: roms.flatMap((r) => r.releases).sort((a, b) => b.date.localeCompare(a.date))[0] || null });
}
devices.sort((a, b) => (b.latest?.date || '').localeCompare(a.latest?.date || '') || a.name.localeCompare(b.name));
const allReleases = devices.flatMap((d) => d.roms.flatMap((r) => r.releases.map((x) => ({ ...x, device: d })))).sort((a, b) => b.date.localeCompare(a.date));

// ---------- markdown ----------
function renderMarkdown(body, file) {
  const seen = new Map();
  const marked = new Marked({ gfm: true });
  // the page's own H1 is generated, so a document that still has H1s of its own (sections written as "# ...") gets every heading one level lower
  const shift = marked.lexer(body).some((t) => t.type === 'heading' && t.depth === 1) ? 1 : 0;
  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const id = slugify(text, seen);
        const level = Math.min(6, depth + shift);
        return `<h${level} id="${id}"><a class="anchor" href="#${id}" aria-hidden="true" tabindex="-1">#</a>${text}</h${level}>\n`;
      },
    },
    walkTokens(token) {
      if ((token.type === 'link' || token.type === 'image') && token.href) token.href = rewriteHref(token.href, file);
    },
    hooks: {
      postprocess(html) {
        return html.replace(/<table>/g, '<div class="table-wrap"><table>').replace(/<th(?=[ >])/g, '<th scope="col"').replace(/<\/table>/g, '</table></div>')
          .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" rel="noopener"');
      },
    },
  });
  return marked.parse(body);
}

// sections of the root README that are whole pages on the site ("Back to all devices" -> /devices/)
const ROOT_README_PAGES = { devices: 'devices/' };

function rewriteHref(href, file) {
  if (/^(https?:|mailto:|#|data:)/.test(href)) return href;
  const [p, hash] = href.split('#');
  const target = path.resolve(path.dirname(file), decodeURIComponent(p));
  if (routeByFile.has(target)) return BASE + routeByFile.get(target) + (hash ? `#${hash}` : '');
  if (target === path.join(ROOT, 'README.md')) {
    if (hash && ROOT_README_PAGES[hash]) return BASE + ROOT_README_PAGES[hash]; // a README section that has its own page on the site
    return BASE + (hash ? `#${hash}` : '');
  }
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const r = path.join(target, 'README.md');
    if (routeByFile.has(r)) return BASE + routeByFile.get(r);
  }
  if (fs.existsSync(target) && target.startsWith(path.join(ROOT, 'DEVICES'))) return BASE + rel(target).replace(/^DEVICES\//, 'devices/').toLowerCase();
  return `${REPO}/blob/main/${rel(target)}`; // anything else: show it on GitHub
}

// ---------- output ----------
fs.rmSync(OUT, { recursive: true, force: true });
const write = (route, html) => {
  const f = path.join(OUT, route, route.endsWith('.html') ? '' : 'index.html');
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
};
const SITE_URL = process.env.SITE_URL || 'https://aosp.immanuelraj.dev/';
const ctx = { BASE, REPO, SITE_URL, devices, allReleases, fmtDate, isoDate };

// static assets of the site itself
fs.cpSync(path.join(SITE, 'assets'), path.join(OUT, 'assets'), { recursive: true });
// images and other files that live next to the Markdown
for (const a of assets) {
  const dest = path.join(OUT, rel(a).replace(/^DEVICES\//, 'devices/').toLowerCase());
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(a, dest);
}
for (const a of fs.readdirSync(path.join(ROOT, '.github/assets'))) fs.copyFileSync(path.join(ROOT, '.github/assets', a), path.join(OUT, 'assets', a));

// every Markdown file becomes a page
for (const f of mdFiles) {
  const route = routeByFile.get(path.resolve(f));
  const { data, body } = frontMatter(read(f));
  const device = devices.find((d) => path.resolve(f).startsWith(path.dirname(d.file) + path.sep));
  const release = allReleases.find((r) => r.file === f);
  const rom = device?.roms.find((r) => route === r.route);
  const kind = release ? 'release' : device && f === device.file ? 'device' : rom ? 'rom' : 'doc';
  const title = data.title || firstHeading(body) || path.basename(f, '.md');
  write(route, page[kind]({ ...ctx, route, title, data, device, release, rom,
    html: renderMarkdown(stripTitleAndBadges(body), f), source: `${REPO}/blob/main/${rel(f)}` }));
}
write('', page.home(ctx));
write('devices/', page.devices(ctx));
write('releases/', page.releases(ctx));
write('support/', page.support(ctx));
write('install/', page.install(ctx));
write('updates/', page.updates(ctx));
write('404.html', page.notFound(ctx));

// sitemap for search engines
const routes = ['', 'devices/', 'releases/', 'support/', 'install/', 'install/web/', 'updates/', ...mdFiles.map((f) => routeByFile.get(path.resolve(f)))];
fs.writeFileSync(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...new Set(routes)].map((r) => `  <url><loc>${esc(SITE_URL + r)}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, '.nojekyll'), '');
// web installer: one JSON per device that has DEVICES/<brand>/<codename>/installer.json, plus the bundled engine
const installers = devices.filter((d) => fs.existsSync(path.join(path.dirname(d.file), 'installer.json')));
for (const d of installers) {
  const cfg = JSON.parse(read(path.join(path.dirname(d.file), 'installer.json')));
  fs.mkdirSync(path.join(OUT, 'installer'), { recursive: true });
  fs.writeFileSync(path.join(OUT, 'installer', `${d.codename}.json`), JSON.stringify(cfg));
}
await esbuild.build({ entryPoints: [path.join(SITE, 'installer/main.js')], bundle: true, format: 'esm', minify: true, target: 'chrome110',
  outfile: path.join(OUT, 'assets/installer.js'), legalComments: 'linked', logLevel: 'warning' });
write('install/web/', page.webInstall({ ...ctx, installers }));
const feeds = writeFeeds(devices, OUT); // LineageOS Updater feeds: ota/<codename>/<os>-<major>/<type>-<variant>.json
console.log(`built ${mdFiles.length} Markdown pages, ${devices.length} devices, ${allReleases.length} releases, ${feeds.length} OTA feeds -> ${path.relative(process.cwd(), OUT) || OUT}`);
