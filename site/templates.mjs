// HTML templates for the site. Plain template strings: no framework, one CSS file, a little JS.
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const androidOf = (title = '') => (title.match(/Android\s+(\d+(?:\.\d+)?)/) || [])[1] || '';
const romLabel = (r) => `${r.os} ${r.version}`;

const ICONS = {
  system: '<svg class="ti ti-system" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/></svg>',
  light: '<svg class="ti ti-light" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
  dark: '<svg class="ti ti-dark" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
  pause: '<svg class="tk-i-pause" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
  play: '<svg class="tk-i-play" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
};

// Runs before first paint: applies the saved theme so there is no flash. No saved choice = follow the system.
const THEME_BOOT = `try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}`;

// News items for the ticker, all generated from data (newest releases first, then standing news).
function newsItems(ctx) {
  const { allReleases, fmtDate } = ctx;
  const items = allReleases.slice(0, 4).map((r, i) => ({ href: r.route, tag: i === 0 ? 'New' : 'Build', text: `${romLabel(r)} for ${r.device.name} · ${fmtDate(r.date)}` }));
  items.push({ href: 'install/web/', tag: 'Beta', text: 'Web installer (beta): unlock and flash from your browser' });
  items.push({ href: 'updates/', tag: 'Soon', text: 'OTA updates via the LineageOS Updater are coming' });
  return items;
}

function ticker(ctx) {
  const { BASE } = ctx;
  const items = newsItems(ctx);
  const group = (hidden) => `<ul class="tk-group"${hidden ? ' aria-hidden="true"' : ''}>${items.map((n) => `<li><a href="${BASE}${n.href}"${hidden ? ' tabindex="-1"' : ''}><span class="tk-tag">${esc(n.tag)}</span>${esc(n.text)}</a></li>`).join('')}</ul>`;
  return `<section class="ticker" aria-label="Latest news" style="--tk-dur:${items.length * 7}s" data-ticker>
  <div class="tk-label"><span>News</span><button class="tk-toggle" type="button" aria-label="Pause the news ticker" data-ticker-toggle>${ICONS.pause}${ICONS.play}</button></div>
  <div class="tk-view"><div class="tk-track">${group(false)}${group(true)}</div></div>
</section>`;
}

function layout(ctx, { title, description, body, route = '', ogImage, noindex = false }) {
  const { BASE, REPO, allReleases } = ctx;
  const latest = allReleases[0];
  const nav = [
    ['Devices', 'devices/'], ['Releases', 'releases/'], ['Install', 'install/'], ['Updates', 'updates/'], ['Support', 'support/'],
  ];
  const pageTitle = title ? `${title} · Android Builds` : 'Android Builds by Immanuel Raj';
  const desc = description || 'Custom Android ROMs, kernels and recoveries by Immanuel Raj: downloads, release notes and flashing guides.';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(pageTitle)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:image" content="${esc(ogImage || `${BASE}assets/banner-android-builds.png`)}">
${noindex ? '<meta name="robots" content="noindex">\n' : ''}<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#06161c" media="(prefers-color-scheme: dark)">
<script>${THEME_BOOT}</script>
<link rel="icon" href="${BASE}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Flex:wght@400..700&family=Google+Sans+Code:wght@400..600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}assets/site.css">
<script defer src="${BASE}assets/site.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>
${latest ? ticker(ctx) : ''}
<header class="header" data-header>
  <div class="shell header-in">
    <a class="logo" href="${BASE}" aria-label="Android Builds home">
      <img src="${BASE}assets/favicon.svg" alt="" width="32" height="32"><span>Android<b>Builds</b></span>
    </a>
    <nav class="nav" id="nav" aria-label="Main" data-nav>
      <span class="nav-pill" aria-hidden="true" data-nav-pill></span>
      ${nav.map(([t, r]) => `<a href="${BASE}${r}"${route.startsWith(r) ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
      <a class="nav-gh" href="${REPO}" rel="noopener">GitHub</a>
    </nav>
    <button class="theme-btn" type="button" aria-label="Theme: system. Switch to light." title="Theme: system" data-theme-toggle>${ICONS.system}${ICONS.light}${ICONS.dark}</button>
    ${latest ? `<a class="btn btn-accent btn-sm cta" href="${BASE}${latest.route}">Get the latest</a>` : ''}
    <button class="menu-btn" type="button" aria-controls="nav" aria-expanded="false" aria-label="Main menu" data-menu><span></span><span></span><span></span></button>
  </div>
</header>
<p class="sr-only" role="status" aria-live="polite" data-theme-status></p>
<main id="main" tabindex="-1">
${body}
</main>
<footer class="footer">
  <div class="shell footer-in">
    <div class="footer-brand">
      <a class="logo" href="${BASE}"><img src="${BASE}assets/favicon.svg" alt="" width="28" height="28"><span>Android<b>Builds</b></span></a>
      <p>Unofficial builds made in my free time. No warranty: flashing can erase or brick your phone. Not affiliated with Google, LineageOS or any phone maker.</p>
    </div>
    <nav class="footer-col" aria-label="Site">
      <h2>Site</h2>
      <a href="${BASE}devices/">Devices</a><a href="${BASE}releases/">Releases</a><a href="${BASE}install/">Install</a><a href="${BASE}updates/">Updates</a>
    </nav>
    <nav class="footer-col" aria-label="Project">
      <h2>Project</h2>
      <a href="${BASE}support/">Support</a><a href="${REPO}/issues" rel="noopener">Report an issue</a><a href="${REPO}" rel="noopener">Source of this site</a>
    </nav>
  </div>
</footer>
</body>
</html>`;
}

const label = (k, v) => v ? `<div class="kv"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>` : '';

function deviceCard(ctx, d, h = 3) {
  const { BASE, fmtDate } = ctx;
  const l = d.latest;
  return `<a class="card device-card" href="${BASE}${d.route}">
    <div class="card-top"><span class="mono tag">${esc(d.codename)}</span>${l ? '<span class="chip chip-ok">Builds on this site</span>' : '<span class="chip">Past builds only</span>'}</div>
    <h${h}>${esc(d.name)}</h${h}>
    <p class="muted">${esc(d.summary)}</p>
    ${l ? `<div class="kvs">${label('Latest release', romLabel(l))}${label('Android', androidOf(l.title))}${label('Build date', fmtDate(l.date))}</div>` : ''}
    <span class="more">Open device <span aria-hidden="true">→</span></span>
  </a>`;
}

function releaseRow(ctx, r, showDevice = true) {
  const { BASE, fmtDate, isoDate } = ctx;
  return `<li class="release-row">
    <a href="${BASE}${r.route}">
      <time class="mono" datetime="${isoDate(r.date)}">${fmtDate(r.date)}</time>
      <span class="rr-title">${esc(romLabel(r))}${androidOf(r.title) ? ` <span class="muted">· Android ${esc(androidOf(r.title))}</span>` : ''}</span>
      ${showDevice ? `<span class="mono tag">${esc(r.device.codename)}</span>` : ''}
      <span aria-hidden="true" class="arrow">→</span>
    </a></li>`;
}

// Breadcrumbs: ancestors are links, the current page is the last item (plain text, aria-current="page").
// The chevron separators are CSS only (nothing for screen readers to read). The same trail is also emitted as schema.org BreadcrumbList.
const crumbs = (ctx, items) => {
  const last = items.length - 1;
  const li = items.map(([t, r], i) => i === last
    ? `<li><span class="crumb-current" aria-current="page"${t.length > 36 ? ` title="${esc(t)}"` : ''}>${esc(t)}</span></li>`
    : `<li><a href="${ctx.BASE}${r}">${esc(t)}</a></li>`).join('');
  const ld = { '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([t, r], i) => ({ '@type': 'ListItem', position: i + 1, name: t, item: ctx.SITE_URL + r })) };
  return `<nav class="crumbs" aria-label="Breadcrumb"><ol>${li}</ol></nav>
<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>`;
};

const article = (ctx, html, source) => `<article class="prose">${html}</article>
  <p class="edit"><a href="${esc(source)}" rel="noopener">View or edit this page on GitHub</a></p>`;

// inner-page header; `narrow` pages share the reading column with their content so the left edge lines up
const hero = (ctx, trail, inner, { narrow = true, cls = '' } = {}) => `<section class="page-hero ${cls}"><div class="shell${narrow ? ' narrow' : ''}">${trail ? crumbs(ctx, trail) : ''}${inner}</div></section>`;

const FEATURE_ICONS = {
  shield: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  notes: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
  update: '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.5-5.8"/><path d="M20 4v5h-5"/></svg>',
};

// install-steps anchor per release route, filled while release pages render (they render before the install page)
const stepsAnchor = new Map();
// downloads anchor per release route, same idea (the home page links its Download button straight to the file table)
const downloadsAnchor = new Map();

export const page = {
  home(ctx) {
    const { BASE, devices, allReleases, fmtDate } = ctx;
    const latest = allReleases[0];
    return layout(ctx, { route: '', body: `
<section class="hero">
  <div class="shell hero-grid">
    <div class="hero-copy">
      <span class="badge">Custom ROMs · Kernels · Recoveries</span>
      <h1>Keep your phone <span class="accent">fast, current and yours.</span></h1>
      <p class="lead">Signed Android builds with clear release notes, honest known issues and step-by-step install guides. Free, unofficial and made with care.</p>
      <div class="actions">
        <a class="btn btn-accent" href="${BASE}devices/">Browse devices</a>
        <a class="btn btn-ghost" href="${BASE}install/">How to install</a>
      </div>
    </div>
    ${latest ? `<aside class="hero-card" aria-labelledby="hero-latest">
      <span class="eyebrow">Latest release</span>
      <h2 id="hero-latest">${esc(romLabel(latest))} <span class="hc-for">for ${esc(latest.device.name)} <span class="mono tag">${esc(latest.device.codename)}</span></span></h2>
      <dl class="facts">
        <div><dt>Android</dt><dd>${esc(androidOf(latest.title) || '-')}</dd></div>
        <div><dt>Build date</dt><dd><time datetime="${ctx.isoDate(latest.date)}">${fmtDate(latest.date)}</time></dd></div>
        ${latest.variants.length ? `<div class="wide"><dt>Variants</dt><dd>${latest.variants.map(esc).join(' · ')}</dd></div>` : ''}
        ${latest.summary ? `<div class="wide"><dt>What is new</dt><dd class="hc-note">${esc(latest.summary)}</dd></div>` : ''}
      </dl>
      <div class="actions">
        <a class="btn btn-accent" href="${BASE}${latest.route}${latest.hasDownloads ? '#downloads' : ''}">Download<span class="sr-only"> ${esc(romLabel(latest))} for ${esc(latest.device.name)}</span></a>
        <a class="btn btn-ghost" href="${BASE}${latest.route}">Release notes<span class="sr-only"> for ${esc(romLabel(latest))}, ${esc(latest.device.name)}</span></a>
      </div>
    </aside>` : ''}
  </div>
  <div class="shell">
    <p class="site-stats"><span class="eyebrow">Whole site</span><span><b>${devices.length}</b> ${devices.length === 1 ? 'device' : 'devices'}</span><span><b>${allReleases.length}</b> ${allReleases.length === 1 ? 'release' : 'releases'} published</span></p>
  </div>
</section>
<section class="section">
  <div class="shell">
    <div class="section-head"><span class="eyebrow">Devices</span><h2>Pick your phone</h2></div>
    <div class="grid">${devices.map((d) => deviceCard(ctx, d)).join('')}</div>
  </div>
</section>
<section class="section section-muted">
  <div class="shell">
    <div class="section-head"><span class="eyebrow">Why these builds</span><h2>Built to be lived with</h2></div>
    <div class="grid grid-3">
      <div class="card feature"><span class="icon-badge">${FEATURE_ICONS.shield}</span><h3>Signed and verified</h3><p class="muted">User builds signed with my own release keys, SELinux enforcing and verified boot on the system partitions. Every file ships with a SHA-256 checksum.</p></div>
      <div class="card feature"><span class="icon-badge">${FEATURE_ICONS.notes}</span><h3>Honest release notes</h3><p class="muted">What changed, what is fixed and what still does not work, written for each build. Nothing hidden in a Telegram post.</p></div>
      <div class="card feature"><span class="icon-badge">${FEATURE_ICONS.update}</span><h3>Easy updates</h3><p class="muted">Same keys between builds, so updates install over the top without losing data. Clean-flash builds are marked clearly.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="shell split">
    <div>
      <div class="section-head"><span class="eyebrow">Releases</span><h2>Latest builds</h2></div>
      <p class="muted">Newest first. Each release page has the notes, checksums and install steps.</p>
      <p><a class="btn btn-ghost" href="${BASE}releases/">All releases</a></p>
    </div>
    <ul class="release-list">${allReleases.slice(0, 6).map((r) => releaseRow(ctx, r)).join('')}</ul>
  </div>
</section>
<section class="section-band">
  <div class="shell band-in">
    <div><h2>Found a bug? Missing a device?</h2>
    <p>Support happens in the open on GitHub Issues: logs, fixes and answers stay searchable for everyone.</p></div>
    <a class="btn btn-accent" href="${ctx.REPO}/issues" rel="noopener">Open an issue</a>
  </div>
</section>` });
  },

  devices(ctx) {
    return layout(ctx, { title: 'Devices', route: 'devices/', body: `
${hero(ctx, [['Home', ''], ['Devices', 'devices/']], '<h1>Devices</h1><p class="lead">Every phone I build for. Pick yours for ROMs, kernels, recoveries and guides.</p>', { narrow: false })}
<section class="section tight"><div class="shell"><div class="grid">${ctx.devices.map((d) => deviceCard(ctx, d, 2)).join('')}</div></div></section>` });
  },

  releases(ctx) {
    return layout(ctx, { title: 'Releases', route: 'releases/', body: `
${hero(ctx, [['Home', ''], ['Releases', 'releases/']], '<h1>Releases</h1><p class="lead">Every build, newest first. Downloads are on GitHub Releases; each page has the notes, checksums and install steps.</p>')}
<section class="section tight"><div class="shell narrow">
  <div class="filters" role="group" aria-label="Filter by device"><button class="chip-btn" aria-pressed="true" data-filter="">All</button>${ctx.devices.filter((d) => d.latest).map((d) => `<button class="chip-btn" aria-pressed="false" data-filter="${esc(d.codename)}">${esc(d.name)}</button>`).join('')}</div>
  <p class="sr-only" role="status" aria-live="polite" data-filter-status></p>
  <ul class="release-list" data-filterable>${ctx.allReleases.map((r) => releaseRow(ctx, r).replace('<li class="release-row">', `<li class="release-row" data-device="${esc(r.device.codename)}">`)).join('')}</ul>
</div></section>` });
  },

  device(ctx) {
    const { BASE, device: d, html, source, fmtDate } = ctx;
    const l = d.latest;
    const ours = d.roms.filter((r) => r.releases.length);
    return layout(ctx, { title: d.name, description: `${d.name} (${d.codename}): ${d.summary}`, route: d.route, body: `
${hero(ctx, [['Home', ''], ['Devices', 'devices/'], [d.name, d.route]], `
  <span class="mono tag">${esc(d.codename)}</span>
  <h1>${esc(d.name)}</h1><p class="lead">${esc(d.summary)}</p>
  ${d.guides.length ? `<div class="guides"><span class="k">Guides</span><div class="actions">${d.guides.map((g) => `<a class="btn btn-ghost btn-sm" href="${BASE}${g.route}">${esc(g.title)}</a>`).join('')}</div></div>` : ''}
  ${l ? `<div class="latest card">
    <div><span class="eyebrow">Latest build</span><h2>${esc(romLabel(l))}</h2>
    <div class="kvs">${label('Android', androidOf(l.title))}${label('Date', fmtDate(l.date))}${label('Release', l.tag)}</div></div>
    <div class="actions"><a class="btn btn-accent" href="${BASE}${l.route}">Release notes & download</a></div>
  </div>` : ''}`)}
${ours.length ? `<section class="section tight"><div class="shell narrow">
  <div class="section-head"><span class="eyebrow">My builds</span><h2>Releases for ${esc(d.name)}</h2></div>
  <ul class="release-list">${ours.flatMap((r) => r.releases).sort((a, b) => b.date.localeCompare(a.date)).map((r) => releaseRow(ctx, { ...r, device: d }, false)).join('')}</ul>
</div></section>` : ''}
<section class="section tight"><div class="shell narrow">${article(ctx, html.replace(/^\s*<p>[\s\S]*?<\/p>\n?/, ''), source)}</div></section>` });
  },

  rom(ctx) {
    const { device: d, rom, html, source, title } = ctx;
    return layout(ctx, { title: `${title}`, route: rom.route, body: `
${hero(ctx, [['Home', ''], ['Devices', 'devices/'], [d.name, d.route], [rom.os, rom.route]], `<span class="mono tag">${esc(d.codename)}</span><h1>${esc(title)}</h1>`)}
${rom.releases.length ? `<section class="section tight"><div class="shell narrow"><ul class="release-list">${rom.releases.map((r) => releaseRow(ctx, { ...r, device: d }, false)).join('')}</ul></div></section>` : ''}
<section class="section tight"><div class="shell narrow">${article(ctx, html, source)}</div></section>` });
  },

  release(ctx) {
    const { BASE, REPO, device: d, release: r, html, source, fmtDate } = ctx;
    const list = d.roms.find((x) => x.os === r.os).releases;
    const i = list.findIndex((x) => x.file === r.file);
    const newer = list[i - 1]; const older = list[i + 1];
    // the install steps heading differs per release: link to the first heading that is about flashing
    const steps = (html.match(/id="(flashing-instructions[^"]*)"/) || html.match(/id="([^"]*flash[^"]*)"/) || [])[1];
    stepsAnchor.set(r.route, steps);
    downloadsAnchor.set(r.route, /id="downloads"/.test(html) ? 'downloads' : '');
    return layout(ctx, { title: r.title, description: `${r.title}: release notes, downloads, checksums and install steps.`, route: r.route,
      ogImage: r.banner ? BASE + r.banner : undefined, body: `
${hero(ctx, [['Home', ''], ['Devices', 'devices/'], [d.name, d.route], [r.os, `${r.route.split('/').slice(0, -3).join('/')}/`], [`${romLabel(r)} · ${fmtDate(r.date)}`, r.route]], `
  <span class="mono tag">${esc(d.codename)}</span>
  <h1>${esc(romLabel(r))} <span class="h1-sub">for ${esc(d.name)}</span></h1>
  <div class="stats">
    <div><span class="k">ROM</span><span class="v">${esc(romLabel(r))}</span></div>
    <div><span class="k">Android</span><span class="v">${esc(androidOf(r.title) || '-')}</span></div>
    <div><span class="k">Device</span><span class="v mono">${esc(d.codename)}</span></div>
    <div><span class="k">Build date</span><span class="v">${fmtDate(r.date)}</span></div>
  </div>
  <div class="actions">
    ${r.tag ? `<a class="btn btn-accent" href="${REPO}/releases/tag/${esc(r.tag)}" rel="noopener">All files on GitHub</a>` : ''}
    ${steps ? `<a class="btn btn-ghost" href="#${esc(steps)}">Install steps</a>` : ''}
  </div>
  ${r.banner ? `<img class="banner" src="${BASE}${r.banner}" alt="${esc(r.title)}" width="1280" height="720" loading="lazy">` : ''}`, { cls: 'release-hero' })}
<section class="section tight"><div class="shell narrow">${article(ctx, html, source)}
  <nav class="pager" aria-label="Other releases">${newer ? `<a class="card" href="${BASE}${newer.route}"><span class="eyebrow">Newer</span>${esc(fmtDate(newer.date))}</a>` : '<span></span>'}${older ? `<a class="card right" href="${BASE}${older.route}"><span class="eyebrow">Older</span>${esc(fmtDate(older.date))}</a>` : ''}</nav>
</div></section>` });
  },

  doc(ctx) {
    const { device: d, html, source, title, route } = ctx;
    const trail = [['Home', '']];
    // a page inside a ROM folder (changelog, version overview) gets that ROM as its parent crumb
    const rom = d?.roms.find((r) => r.hasReadme && route !== r.route && route.startsWith(r.route));
    if (d) trail.push(['Devices', 'devices/'], [d.name, d.route]);
    if (rom) trail.push([rom.os, rom.route]);
    trail.push([title, route]);
    // unique <title>: add the ROM and device when the page's own title does not already say them
    const ctxWords = [rom?.os, d?.name].filter((x) => x && !title.toLowerCase().includes(x.toLowerCase()));
    const pageTitle = [title, ...ctxWords].join(' · ');
    return layout(ctx, { title: pageTitle, route, body: `
${hero(ctx, trail, `<h1>${esc(title)}</h1>`)}
<section class="section tight"><div class="shell narrow">${article(ctx, html, source)}</div></section>` });
  },

  install(ctx) {
    const { BASE, devices } = ctx;
    return layout(ctx, { title: 'Install', route: 'install/', description: 'How to install my Android builds: unlock the bootloader, flash the ROM, update, or go back to stock.', body: `
${hero(ctx, [['Home', ''], ['Install', 'install/']], `<h1>Install</h1><p class="lead">Unlock, flash, update or go back to stock. Pick your phone for its exact steps: every phone is different, and the release page always has the steps for that build.</p>
  <div class="actions"><a class="btn btn-accent" href="${BASE}install/web/">Open the web installer</a></div>`, { narrow: false })}
<section class="section tight"><div class="shell">
  <h2 class="sr-only">Before you start</h2>
  <ol class="steps">
    <li><h3>Back up</h3><p class="muted">Unlocking the bootloader and a clean install erase everything on the phone.</p></li>
    <li><h3>Get the tools</h3><p class="muted">Install the latest <a href="https://developer.android.com/tools/releases/platform-tools" rel="noopener">platform tools</a> (adb and fastboot) on your computer.</p></li>
    <li><h3>Read your device page</h3><p class="muted">Standing instructions, known issues and the flashing guide for your phone.</p></li>
    <li><h3>Follow the release page</h3><p class="muted">Each release lists its files, checksums and the exact install or update steps.</p></li>
  </ol>
</div></section>
<section class="section tight"><div class="shell">
  <div class="section-head"><span class="eyebrow">Guides per device</span><h2>Your phone</h2></div>
  <div class="grid">${devices.map((d) => `<div class="card"><span class="mono tag">${esc(d.codename)}</span><h3>${esc(d.name)}</h3>
    <div class="actions">${d.latest ? `<a class="btn btn-accent btn-sm" href="${BASE}${d.latest.route}${stepsAnchor.get(d.latest.route) ? `#${stepsAnchor.get(d.latest.route)}` : ''}">Install the latest</a>` : ''}${d.guides.slice(0, 3).map((g) => `<a class="btn btn-ghost btn-sm" href="${BASE}${g.route}">${esc(g.title)}</a>`).join('')}</div></div>`).join('')}</div>
</div></section>` });
  },

  webInstall(ctx) {
    const { BASE, installers } = ctx;
    const list = installers.map((d) => ({ codename: d.codename, name: d.name, url: `${BASE}installer/${d.codename}.json` }));
    return layout(ctx, { title: 'Web installer', route: 'install/web/', description: 'Unlock, install LineageOS or go back to stock from your browser over USB.', body: `
${hero(ctx, [['Home', ''], ['Install', 'install/'], ['Web installer', 'install/web/']], `
  <span class="badge">Beta</span>
  <h1>Web installer</h1><p class="lead">Unlock the bootloader, install LineageOS or go back to stock, right from Chrome or Edge on a computer. No adb or fastboot install needed.</p>`)}
<section class="section tight"><div class="shell narrow">
  <details class="inst-card"><summary>What you need</summary>
    <ul>
      <li>A computer with Chrome, Edge, Brave or Opera (Firefox and Safari cannot use USB). Not a Snap or Flatpak browser on Linux.</li>
      <li>Windows: the <a href="https://developer.android.com/studio/run/win-usb" rel="noopener">Google USB driver</a> for the phone in FASTBOOT mode.</li>
      <li>Linux: Android udev rules (package <code>android-udev-rules</code>), and stop <code>adb</code> first: <code>adb kill-server</code>.</li>
      <li>A good USB cable, plugged straight into the computer. Close other tools that use the phone.</li>
      <li>The files for your flow, downloaded from the release page (browsers cannot download GitHub release files for you). Every file is checked against its SHA-256 before anything is flashed.</li>
    </ul></details>
  <div id="installer" data-base="${BASE}"><noscript>The web installer needs JavaScript.</noscript></div>
  <script type="application/json" id="installer-devices">${JSON.stringify(list).replace(/</g, '\\u003c')}</script>
  <script type="module" src="${BASE}assets/installer.js"></script>
  <p class="muted">Prefer the command line? Every release page has the same steps for adb and fastboot.</p>
</div></section>` });
  },

  updates(ctx) {
    const { BASE } = ctx;
    return layout(ctx, { title: 'Updates', route: 'updates/', description: 'How to update my Android builds without losing data.', body: `
${hero(ctx, [['Home', ''], ['Updates', 'updates/']], '<h1>Updates</h1><p class="lead">Builds signed with the same keys install over each other and keep your data. Each release page says whether it is an update or needs a clean flash.</p>')}
<section class="section tight"><div class="shell narrow">
  <h2 class="sr-only">How to update</h2>
  <ol class="steps steps-list">
    <li><h3>Check the release page</h3><p class="muted">Look for "no wipe needed" and stay on the same variant (Vanilla or GApps).</p></li>
    <li><h3>Reboot to sideload</h3><p class="muted">With USB debugging on: <code>adb reboot sideload-auto-reboot</code></p></li>
    <li><h3>Send the update</h3><p class="muted"><code>adb sideload &lt;rom&gt;.zip</code>. The phone reboots by itself when it is done.</p></li>
  </ol>
  <p class="muted">Updates over the air from Settings are coming: see the <a href="${BASE}releases/">releases</a> for news.</p>
</div></section>` });
  },

  support(ctx) {
    const { REPO, BASE, devices } = ctx;
    // the standing instructions guide of the first device that has one (falls back to the device list)
    const standing = devices.flatMap((d) => d.guides).find((g) => /standing/i.test(g.title));
    const faq = [
      ['Will flashing erase my phone?', 'Unlocking the bootloader and a clean install both erase everything on the phone. Updates between builds signed with the same keys keep your data; each release page says which case applies.'],
      ['Which file do I download?', 'Each release page lists every file and what it is for. Vanilla has no Google apps; GApps has them built in. Always check the SHA-256 checksum.'],
      ['Can I relock the bootloader?', 'Not with these builds. Relocking a phone that runs a custom ROM can make it unbootable. Only relock after returning to the official stock firmware.'],
      ['Something does not work. Where do I ask?', `Open an issue on GitHub with your device, build date and a log (adb logcat). Search existing issues first.`],
      ['Do you take device requests?', 'Only for phones I own or can test on. Open an issue anyway: maybe someone can help test.'],
    ];
    return layout(ctx, { title: 'Support', route: 'support/', body: `
${hero(ctx, [['Home', ''], ['Support', 'support/']], `<h1>Support</h1><p class="lead">Questions, bugs and device requests go to GitHub Issues, so the answers help the next person too.</p>
  <div class="actions"><a class="btn btn-accent" href="${REPO}/issues/new/choose" rel="noopener">Open an issue</a><a class="btn btn-ghost" href="${REPO}/issues?q=" rel="noopener">Search issues</a></div>`)}
<section class="section tight"><div class="shell narrow"><div class="section-head"><span class="eyebrow">FAQ</span><h2>Before you ask</h2></div>
  <div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  <p class="muted">Device-specific rules are on each device page, for example the <a href="${BASE}${standing ? standing.route : 'devices/'}">standing instructions</a>.</p>
</div></section>` });
  },

  notFound(ctx) {
    return layout(ctx, { title: 'Page not found', body: `
<section class="page-hero not-found"><div class="shell narrow center"><span class="code404 mono" aria-hidden="true">404</span><h1>Page not found</h1><p class="lead">That address does not exist here: the page may have moved, or the link has a typo. Try one of these instead.</p>
<div class="actions"><a class="btn btn-accent" href="${ctx.BASE}">Go to the home page</a><a class="btn btn-ghost" href="${ctx.BASE}devices/">Browse devices</a><a class="btn btn-ghost" href="${ctx.BASE}releases/">See all releases</a><a class="btn btn-ghost" href="${ctx.BASE}install/">Install guide</a><a class="btn btn-ghost" href="${ctx.BASE}support/">Get support</a></div></div></section>`, noindex: true });
  },
};
