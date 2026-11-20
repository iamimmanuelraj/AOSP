// Header shadow on scroll, mobile menu, release filters. No dependencies.
(() => {
  const header = document.querySelector('[data-header]');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });

  const btn = document.querySelector('[data-menu]'); const nav = document.getElementById('nav');
  if (btn && nav) btn.addEventListener('click', () => {
    const open = btn.getAttribute('aria-expanded') !== 'true';
    btn.setAttribute('aria-expanded', String(open)); nav.classList.toggle('open', open); document.body.classList.toggle('menu-open', open);
  });

  const list = document.querySelector('[data-filterable]');
  document.querySelectorAll('[data-filter]').forEach((b) => b.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    list?.querySelectorAll('[data-device]').forEach((li) => { li.hidden = !!b.dataset.filter && li.dataset.device !== b.dataset.filter; });
  }));
})();
