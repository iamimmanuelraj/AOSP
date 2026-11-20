// HTML templates for the site. Plain template strings: no framework, one CSS file, a little JS.
export const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const androidOf = (title = '') => (title.match(/Android\s+(\d+(?:\.\d+)?)/) || [])[1] || '';
const romLabel = (r) => `${r.os} ${r.version}`;

function layout(ctx, { title, description, body, route = '', ogImage }) {
  const { BASE, REPO, allReleases, fmtDate } = ctx;
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
<meta name="theme-color" content="#0f766e">
<link rel="icon" href="${BASE}assets/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${BASE}assets/site.css">
<script defer src="${BASE}assets/site.js"></script>
</head>
<body>
<a class="skip" href="#main">Skip to main content</a>
${latest ? `<div class="strip"><a href="${BASE}${latest.route}">New: ${esc(romLabel(latest))} for ${esc(latest.device.name)} · ${fmtDate(latest.date)} <span aria-hidden="true">→</span></a></div>` : ''}
<header class="header" data-header>
  <div class="shell header-in">
    <a class="logo" href="${BASE}" aria-label="Android Builds home">
      <img src="${BASE}assets/favicon.svg" alt="" width="30" height="30"><span>Android<b>Builds</b></span>
    </a>
    <nav class="nav" id="nav" aria-label="Main">
      ${nav.map(([t, r]) => `<a href="${BASE}${r}"${route.startsWith(r) ? ' aria-current="page"' : ''}>${t}</a>`).join('')}
      <a class="nav-gh" href="${REPO}" rel="noopener">GitHub</a>
    </nav>
    ${latest ? `<a class="btn btn-dark btn-sm cta" href="${BASE}${latest.route}">Get the latest</a>` : ''}
    <button class="menu-btn" type="button" aria-controls="nav" aria-expanded="false" aria-label="Menu" data-menu><span></span><span></span><span></span></button>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="footer">
  <div class="shell footer-in">
    <div>
      <a class="logo" href="${BASE}"><img src="${BASE}assets/favicon.svg" alt="" width="26" height="26"><span>Android<b>Builds</b></span></a>
      <p class="muted">Unofficial builds made in my free time. No warranty: flashing can erase or brick your phone. Not affiliated with Google, LineageOS or any phone maker.</p>
    </div>
    <div class="footer-links">
      <a href="${BASE}devices/">Devices</a><a href="${BASE}releases/">Releases</a><a href="${BASE}install/">Install</a>
      <a href="${BASE}updates/">Updates</a><a href="${REPO}/issues" rel="noopener">Report an issue</a><a href="${REPO}" rel="noopener">Source of this site</a>
    </div>
  </div>
</footer>
</body>
</html>`;
}

const label = (k, v) => v ? `<div class="kv"><span class="k">${esc(k)}</span><span class="v">${esc(v)}</span></div>` : '';

function deviceCard(ctx, d) {
  const { BASE, fmtDate } = ctx;
  const l = d.latest;
  return `<a class="card device-card" href="${BASE}${d.route}">
    <div class="card-top"><span class="mono tag">${esc(d.codename)}</span>${l ? '<span class="chip chip-ok">Active</span>' : '<span class="chip">Archive</span>'}</div>
    <h3>${esc(d.name)}</h3>
    <p class="muted">${esc(d.summary)}</p>
    ${l ? `<div class="kvs">${label('Latest', romLabel(l))}${label('Android', androidOf(l.title))}${label('Date', fmtDate(l.date))}</div>` : ''}
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

const crumbs = (ctx, items) => `<nav class="crumbs" aria-label="Breadcrumb">${items.map(([t, r], i) => i === items.length - 1
  ? `<span aria-current="page">${esc(t)}</span>` : `<a href="${ctx.BASE}${r}">${esc(t)}</a>`).join('<span aria-hidden="true">/</span>')}</nav>`;

const article = (ctx, html, source) => `<article class="prose">${html}</article>
  <p class="edit"><a href="${esc(source)}" rel="noopener">View or edit this page on GitHub</a></p>`;

export const page = {
  home(ctx) {
    const { BASE, devices, allReleases, fmtDate } = ctx;
    const latest = allReleases[0];
    return layout(ctx, { route: '', body: `
<section class="hero">
  <div class="shell">
    <span class="badge">Custom ROMs · kernels · recoveries</span>
    <h1>Keep your phone<br><span class="accent">fast, current and yours.</span></h1>
    <p class="lead">Signed Android builds with clear release notes, honest known issues and step-by-step install guides. Free, unofficial and made with care.</p>
    <div class="actions">
      ${latest ? `<a class="btn btn-accent" href="${BASE}${latest.route}">Download ${esc(romLabel(latest))}</a>` : ''}
      <a class="btn btn-ghost" href="${BASE}devices/">Browse devices</a>
    </div>
    ${latest ? `<div class="stats">
      <div><span class="k">Latest build</span><span class="v">${fmtDate(latest.date)}</span></div>
      <div><span class="k">Android</span><span class="v">${esc(androidOf(latest.title) || '-')}</span></div>
      <div><span class="k">Devices</span><span class="v">${devices.length}</span></div>
      <div><span class="k">Releases</span><span class="v">${allReleases.length}</span></div>
    </div>` : ''}
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
      <div class="card feature"><h3>Signed and verified</h3><p class="muted">User builds signed with my own release keys, SELinux enforcing and verified boot on the system partitions. Every file ships with a SHA-256 checksum.</p></div>
      <div class="card feature"><h3>Honest release notes</h3><p class="muted">What changed, what is fixed and what still does not work, written for each build. Nothing hidden in a Telegram post.</p></div>
      <div class="card feature"><h3>Easy updates</h3><p class="muted">Same keys between builds, so updates install over the top without losing data. Clean-flash builds are marked clearly.</p></div>
    </div>
  </div>
</section>
<section class="section">
  <div class="shell narrow">
    <div class="section-head"><span class="eyebrow">Releases</span><h2>Latest builds</h2></div>
    <ul class="release-list">${allReleases.slice(0, 6).map((r) => releaseRow(ctx, r)).join('')}</ul>
    <p><a class="btn btn-ghost" href="${BASE}releases/">All releases</a></p>
  </div>
</section>
<section class="section section-dark">
  <div class="shell narrow center">
    <h2>Found a bug? Missing a device?</h2>
    <p class="lead">Support happens in the open on GitHub Issues: logs, fixes and answers stay searchable for everyone.</p>
    <a class="btn btn-accent" href="${ctx.REPO}/issues" rel="noopener">Open an issue</a>
  </div>
</section>` });
  },

  devices(ctx) {
    return layout(ctx, { title: 'Devices', route: 'devices/', body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Devices', 'devices/']])}
  <h1>Devices</h1><p class="lead">Every phone I build for. Pick yours for ROMs, kernels, recoveries and guides.</p></div></section>
<section class="section tight"><div class="shell"><div class="grid">${ctx.devices.map((d) => deviceCard(ctx, d)).join('')}</div></div></section>` });
  },

  releases(ctx) {
    return layout(ctx, { title: 'Releases', route: 'releases/', body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Releases', 'releases/']])}
  <h1>Releases</h1><p class="lead">Every build, newest first. Downloads are on GitHub Releases; each page has the notes, checksums and install steps.</p></div></section>
<section class="section tight"><div class="shell narrow">
  <div class="filters" role="group" aria-label="Filter by device"><button class="chip-btn" aria-pressed="true" data-filter="">All</button>${ctx.devices.filter((d) => d.latest).map((d) => `<button class="chip-btn" aria-pressed="false" data-filter="${esc(d.codename)}">${esc(d.name)}</button>`).join('')}</div>
  <ul class="release-list" data-filterable>${ctx.allReleases.map((r) => releaseRow(ctx, r).replace('<li class="release-row">', `<li class="release-row" data-device="${esc(r.device.codename)}">`)).join('')}</ul>
</div></section>` });
  },

  device(ctx) {
    const { BASE, device: d, html, source, fmtDate } = ctx;
    const l = d.latest;
    const ours = d.roms.filter((r) => r.releases.length);
    return layout(ctx, { title: d.name, description: `${d.name} (${d.codename}): ${d.summary}`, route: d.route, body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Devices', 'devices/'], [d.name, d.route]])}
  <span class="mono tag">${esc(d.codename)}</span>
  <h1>${esc(d.name)}</h1><p class="lead">${esc(d.summary)}</p>
  ${d.guides.length ? `<div class="actions guides">${d.guides.map((g) => `<a class="btn btn-ghost btn-sm" href="${BASE}${g.route}">${esc(g.title)}</a>`).join('')}</div>` : ''}
  ${l ? `<div class="latest card">
    <div><span class="eyebrow">Latest build</span><h3>${esc(romLabel(l))}</h3>
    <div class="kvs">${label('Android', androidOf(l.title))}${label('Date', fmtDate(l.date))}${label('Release', l.tag)}</div></div>
    <div class="actions"><a class="btn btn-accent" href="${BASE}${l.route}">Release notes & download</a></div>
  </div>` : ''}
</div></section>
${ours.length ? `<section class="section tight"><div class="shell narrow">
  <div class="section-head"><span class="eyebrow">My builds</span><h2>Releases for ${esc(d.name)}</h2></div>
  <ul class="release-list">${ours.flatMap((r) => r.releases).sort((a, b) => b.date.localeCompare(a.date)).map((r) => releaseRow(ctx, { ...r, device: d }, false)).join('')}</ul>
</div></section>` : ''}
<section class="section tight"><div class="shell narrow">${article(ctx, html.replace(/^\s*<p>[\s\S]*?<\/p>\n?/, ''), source)}</div></section>` });
  },

  rom(ctx) {
    const { device: d, rom, html, source, title } = ctx;
    return layout(ctx, { title: `${title}`, route: rom.route, body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Devices', 'devices/'], [d.name, d.route], [rom.os, rom.route]])}
  <span class="mono tag">${esc(d.codename)}</span><h1>${esc(title)}</h1></div></section>
${rom.releases.length ? `<section class="section tight"><div class="shell narrow"><ul class="release-list">${rom.releases.map((r) => releaseRow(ctx, { ...r, device: d }, false)).join('')}</ul></div></section>` : ''}
<section class="section tight"><div class="shell narrow">${article(ctx, html, source)}</div></section>` });
  },

  release(ctx) {
    const { BASE, REPO, device: d, release: r, html, source, fmtDate } = ctx;
    const list = d.roms.find((x) => x.os === r.os).releases;
    const i = list.findIndex((x) => x.file === r.file);
    const newer = list[i - 1]; const older = list[i + 1];
    return layout(ctx, { title: r.title, description: `${r.title}: release notes, downloads, checksums and install steps.`, route: r.route,
      ogImage: r.banner ? BASE + r.banner : undefined, body: `
<section class="page-hero release-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Devices', 'devices/'], [d.name, d.route], [r.os, `${r.route.split('/').slice(0, -3).join('/')}/`], [fmtDate(r.date), r.route]])}
  <h1>${esc(r.title)}</h1>
  <div class="stats">
    <div><span class="k">ROM</span><span class="v">${esc(romLabel(r))}</span></div>
    <div><span class="k">Android</span><span class="v">${esc(androidOf(r.title) || '-')}</span></div>
    <div><span class="k">Device</span><span class="v mono">${esc(d.codename)}</span></div>
    <div><span class="k">Build date</span><span class="v">${fmtDate(r.date)}</span></div>
  </div>
  <div class="actions">
    ${r.tag ? `<a class="btn btn-accent" href="${REPO}/releases/tag/${esc(r.tag)}" rel="noopener">All files on GitHub</a>` : ''}
    <a class="btn btn-ghost" href="#flashing-instructions-new-install">Install steps</a>
  </div>
  ${r.banner ? `<img class="banner" src="${BASE}${r.banner}" alt="${esc(r.title)}" loading="lazy">` : ''}
</div></section>
<section class="section tight"><div class="shell narrow">${article(ctx, html, source)}
  <nav class="pager">${newer ? `<a class="card" href="${BASE}${newer.route}"><span class="eyebrow">Newer</span>${esc(fmtDate(newer.date))}</a>` : '<span></span>'}${older ? `<a class="card right" href="${BASE}${older.route}"><span class="eyebrow">Older</span>${esc(fmtDate(older.date))}</a>` : ''}</nav>
</div></section>` });
  },

  doc(ctx) {
    const { device: d, html, source, title, route } = ctx;
    const trail = [['Home', '']];
    if (d) trail.push(['Devices', 'devices/'], [d.name, d.route]);
    trail.push([title, route]);
    return layout(ctx, { title, route, body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, trail)}<h1>${esc(title)}</h1></div></section>
<section class="section tight"><div class="shell narrow">${article(ctx, html, source)}</div></section>` });
  },

  install(ctx) {
    const { BASE, devices } = ctx;
    return layout(ctx, { title: 'Install', route: 'install/', description: 'How to install my Android builds: unlock the bootloader, flash the ROM, update, or go back to stock.', body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Install', 'install/']])}
  <h1>Install</h1><p class="lead">Unlock, flash, update or go back to stock. Pick your phone for its exact steps: every phone is different, and the release page always has the steps for that build.</p>
  <div class="actions"><a class="btn btn-accent" href="${BASE}install/web/">Open the web installer</a></div></div></section>
<section class="section tight"><div class="shell">
  <ol class="steps">
    <li><h3>Back up</h3><p class="muted">Unlocking the bootloader and a clean install erase everything on the phone.</p></li>
    <li><h3>Get the tools</h3><p class="muted">Install the latest <a href="https://developer.android.com/tools/releases/platform-tools" rel="noopener">platform tools</a> (adb and fastboot) on your computer.</p></li>
    <li><h3>Read your device page</h3><p class="muted">Standing instructions, known issues and the flashing guide for your phone.</p></li>
    <li><h3>Follow the release page</h3><p class="muted">Each release lists its files, checksums and the exact install or update steps.</p></li>
  </ol>
  <div class="section-head" style="margin-top:48px"><span class="eyebrow">Guides per device</span><h2>Your phone</h2></div>
  <div class="grid">${devices.map((d) => `<div class="card"><span class="mono tag">${esc(d.codename)}</span><h3>${esc(d.name)}</h3>
    <div class="actions">${d.latest ? `<a class="btn btn-accent btn-sm" href="${BASE}${d.latest.route}#flashing-instructions-new-install">Install the latest</a>` : ''}${d.guides.slice(0, 3).map((g) => `<a class="btn btn-ghost btn-sm" href="${BASE}${g.route}">${esc(g.title)}</a>`).join('')}</div></div>`).join('')}</div>
</div></section>` });
  },

  webInstall(ctx) {
    const { BASE, installers } = ctx;
    const list = installers.map((d) => ({ codename: d.codename, name: d.name, url: `${BASE}installer/${d.codename}.json` }));
    return layout(ctx, { title: 'Web installer', route: 'install/web/', description: 'Unlock, install LineageOS or go back to stock from your browser over USB.', body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Install', 'install/'], ['Web installer', 'install/web/']])}
  <span class="badge">Beta</span>
  <h1>Web installer</h1><p class="lead">Unlock the bootloader, install LineageOS or go back to stock, right from Chrome or Edge on a computer. No adb or fastboot install needed.</p></div></section>
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
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Updates', 'updates/']])}
  <h1>Updates</h1><p class="lead">Builds signed with the same keys install over each other and keep your data. Each release page says whether it is an update or needs a clean flash.</p></div></section>
<section class="section tight"><div class="shell narrow">
  <ol class="steps">
    <li><h3>Check the release page</h3><p class="muted">Look for "no wipe needed" and stay on the same variant (Vanilla or GApps).</p></li>
    <li><h3>Reboot to sideload</h3><p class="muted">With USB debugging on: <code>adb reboot sideload-auto-reboot</code></p></li>
    <li><h3>Send the update</h3><p class="muted"><code>adb sideload &lt;rom&gt;.zip</code>. The phone reboots by itself when it is done.</p></li>
  </ol>
  <p class="muted">Updates over the air from Settings are coming: see the <a href="${BASE}releases/">releases</a> for news.</p>
</div></section>` });
  },

  support(ctx) {
    const { REPO, BASE } = ctx;
    const faq = [
      ['Will flashing erase my phone?', 'Unlocking the bootloader and a clean install both erase everything on the phone. Updates between builds signed with the same keys keep your data; each release page says which case applies.'],
      ['Which file do I download?', 'Each release page lists every file and what it is for. Vanilla has no Google apps; GApps has them built in. Always check the SHA-256 checksum.'],
      ['Can I relock the bootloader?', 'Not with these builds. Relocking a phone that runs a custom ROM can make it unbootable. Only relock after returning to the official stock firmware.'],
      ['Something does not work. Where do I ask?', `Open an issue on GitHub with your device, build date and a log (adb logcat). Search existing issues first.`],
      ['Do you take device requests?', 'Only for phones I own or can test on. Open an issue anyway: maybe someone can help test.'],
    ];
    return layout(ctx, { title: 'Support', route: 'support/', body: `
<section class="page-hero"><div class="shell">${crumbs(ctx, [['Home', ''], ['Support', 'support/']])}
  <h1>Support</h1><p class="lead">Questions, bugs and device requests go to GitHub Issues, so the answers help the next person too.</p>
  <div class="actions"><a class="btn btn-accent" href="${REPO}/issues/new/choose" rel="noopener">Open an issue</a><a class="btn btn-ghost" href="${REPO}/issues?q=" rel="noopener">Search issues</a></div></div></section>
<section class="section tight"><div class="shell narrow"><div class="section-head"><span class="eyebrow">FAQ</span><h2>Before you ask</h2></div>
  <div class="faq">${faq.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
  <p class="muted">Device-specific rules are on each device page, for example the <a href="${BASE}devices/">standing instructions</a>.</p>
</div></section>` });
  },

  notFound(ctx) {
    return layout(ctx, { title: 'Page not found', body: `
<section class="page-hero"><div class="shell narrow center"><h1>Page not found</h1><p class="lead">That page moved or never existed.</p>
<div class="actions"><a class="btn btn-accent" href="${ctx.BASE}">Home</a><a class="btn btn-ghost" href="${ctx.BASE}devices/">Devices</a></div></div></section>` });
  },
};
