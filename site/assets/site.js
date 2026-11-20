// Theme toggle, header highlight, mobile menu, news ticker, release filters, table and code helpers. No dependencies.
(() => {
  const root = document.documentElement;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  // ---- theme: system (default) -> light -> dark, remembered; the inline script in <head> applies it before first paint
  const themeBtn = $('[data-theme-toggle]'); const themeStatus = $('[data-theme-status]');
  const saved = () => { try { const t = localStorage.getItem('theme'); return t === 'light' || t === 'dark' ? t : 'system'; } catch { return 'system'; } };
  const NEXT = { system: 'light', light: 'dark', dark: 'system' };
  const NAME = { system: 'system', light: 'light', dark: 'dark' };
  const paintTheme = (mode, announce) => {
    if (mode === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', mode);
    if (themeBtn) {
      themeBtn.setAttribute('aria-label', `Theme: ${NAME[mode]}. Switch to ${NAME[NEXT[mode]]}.`);
      themeBtn.title = `Theme: ${NAME[mode]}`;
    }
    if (announce && themeStatus) themeStatus.textContent = `Theme: ${NAME[mode]}`;
  };
  paintTheme(saved(), false);
  themeBtn?.addEventListener('click', () => {
    const next = NEXT[saved()];
    try { if (next === 'system') localStorage.removeItem('theme'); else localStorage.setItem('theme', next); } catch {}
    paintTheme(next, true);
  });

  // ---- header shadow on scroll
  const header = $('[data-header]');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });

  // ---- mobile menu
  const btn = $('[data-menu]'); const nav = $('#nav');
  const setMenu = (open) => { btn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); };
  if (btn && nav) {
    btn.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
    addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); btn.focus(); } });
    document.addEventListener('click', (e) => { if (nav.classList.contains('open') && !nav.contains(e.target) && !btn.contains(e.target)) setMenu(false); });
  }

  // ---- header highlight: one pill that glides to the hovered / focused item, rests on the current page
  const pill = $('[data-nav-pill]');
  if (nav && pill) {
    const items = $$('a', nav); const current = $('a[aria-current=page]', nav);
    const desktop = matchMedia('(min-width: 901px)');
    let at = null;
    const place = (a, instant) => {
      const n = nav.getBoundingClientRect(); const r = a.getBoundingClientRect();
      if (instant) pill.classList.add('jump');
      pill.style.width = `${r.width}px`; pill.style.height = `${r.height}px`;
      pill.style.transform = `translate(${r.left - n.left}px,${r.top - n.top}px)`;
      if (instant) { pill.offsetWidth; pill.classList.remove('jump'); }
      pill.classList.add('on'); at = a;
    };
    const go = (a) => { if (!desktop.matches) return; place(a, !pill.classList.contains('on') || reduced.matches); };
    const rest = () => {
      if (!desktop.matches) return;
      if (current) place(current, reduced.matches); else { pill.classList.remove('on'); at = null; }
    };
    const refit = () => { if (at) place(at, true); };
    items.forEach((a) => {
      a.addEventListener('pointerenter', () => go(a));
      a.addEventListener('focus', () => go(a));
    });
    nav.addEventListener('pointerleave', rest);
    nav.addEventListener('focusout', (e) => { if (!nav.contains(e.relatedTarget)) rest(); });
    addEventListener('resize', () => { desktop.matches ? (at ? refit() : rest()) : pill.classList.remove('on'); });
    document.fonts?.ready.then(() => { if (!nav.matches(':hover') && !nav.contains(document.activeElement)) rest(); else refit(); });
    rest();
  }

  // ---- news ticker: pause button (hover and focus pause it in CSS)
  const tk = $('[data-ticker]'); const tkBtn = $('[data-ticker-toggle]');
  tkBtn?.addEventListener('click', () => {
    const paused = !tk.classList.contains('paused');
    tk.classList.toggle('paused', paused);
    tkBtn.setAttribute('aria-label', paused ? 'Play the news ticker' : 'Pause the news ticker');
  });

  // focused ticker link: bring its start to the left edge of the view (long items on phones)
  const tkView = $('.tk-view', tk || document);
  tk?.addEventListener('focusin', (e) => {
    const a = e.target.closest?.('.tk-group a'); if (!a || !tkView) return;
    requestAnimationFrame(() => { tkView.scrollLeft += a.getBoundingClientRect().left - tkView.getBoundingClientRect().left - 8; });
  });

  // ---- breadcrumbs: on narrow screens the trail scrolls; start it at the current page
  $$('.crumbs ol').forEach((ol) => { ol.scrollLeft = ol.scrollWidth; });

  // ---- release filters
  const list = $('[data-filterable]'); const filterStatus = $('[data-filter-status]');
  $$('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    $$('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    $$('[data-device]', list).forEach((li) => { li.hidden = !!b.dataset.filter && li.dataset.device !== b.dataset.filter; });
    if (filterStatus) { const n = $$('[data-device]', list).filter((li) => !li.hidden).length; filterStatus.textContent = `Showing ${n} ${n === 1 ? 'release' : 'releases'}${b.dataset.filter ? ` for ${b.textContent}` : ''}`; }
  }));

  // ---- Markdown tables: label cells for the stacked phone layout; keyboard-scrollable wide tables
  $$('.prose table').forEach((t) => {
    const heads = $$('thead th', t).map((th) => th.textContent.trim());
    if (heads.length >= 3 && heads.every(Boolean)) {
      $$('tbody tr', t).forEach((tr) => $$('td', tr).forEach((td, i) => td.setAttribute('data-label', heads[i] || '')));
      t.classList.add('stack');
    }
    // the stacked layout is display:block, which drops table semantics in some browsers: restore them
    t.setAttribute('role', 'table');
    $$('thead, tbody', t).forEach((g) => g.setAttribute('role', 'rowgroup'));
    $$('tr', t).forEach((tr) => tr.setAttribute('role', 'row'));
    $$('th', t).forEach((c) => c.setAttribute('role', 'columnheader'));
    $$('td', t).forEach((c) => c.setAttribute('role', 'cell'));
    // keyboard-scrollable region, named after the heading above it
    const wrap = t.closest('.table-wrap');
    if (wrap) {
      let h = wrap; while (h && !/^H[1-6]$/.test(h.tagName)) h = h.previousElementSibling;
      const name = h ? h.textContent.replace(/^#/, '').trim() : '';
      wrap.tabIndex = 0; wrap.setAttribute('role', 'region'); wrap.setAttribute('aria-label', name ? `Table: ${name}` : 'Table');
      t.setAttribute('aria-label', name || 'Table');
    }
  });

  // ---- copy button on code blocks
  $$('.prose pre').forEach((pre) => {
    const wrap = document.createElement('div'); wrap.className = 'pre-wrap';
    pre.replaceWith(wrap); wrap.append(pre);
    const b = document.createElement('button'); b.type = 'button'; b.className = 'copy-btn'; b.textContent = 'Copy'; b.setAttribute('aria-label', 'Copy code to clipboard');
    b.addEventListener('click', async () => {
      let msg = 'Copied to clipboard';
      try { await navigator.clipboard.writeText(pre.textContent.replace(/\n$/, '')); b.textContent = 'Copied'; } catch { b.textContent = 'Press Ctrl+C'; msg = 'Could not copy: select the code and press Ctrl+C'; }
      if (themeStatus) themeStatus.textContent = msg; // the page's polite live region
      setTimeout(() => { b.textContent = 'Copy'; if (themeStatus) themeStatus.textContent = ''; }, 1800);
    });
    wrap.append(b);
  });
})();
