/**
 * Loads and decorates the footer from a content fragment.
 * Content-first: all copy, links, and images live in the footer fragment;
 * this decorator only reads that DOM and assigns structural classes.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/footer.plain.html');
  if (!resp.ok) resp = await fetch('/footer.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const container = document.createElement('div');
  container.innerHTML = html;

  const sections = [...container.querySelectorAll(':scope > div')];

  // 1: newsletter + app download band
  const newsletter = sections[0];
  if (newsletter) newsletter.classList.add('footer-newsletter');

  // 2: primary link columns (each <h3> + following <ul> becomes a column)
  const links = sections[1];
  if (links) {
    links.classList.add('footer-links');
    const columns = document.createElement('div');
    columns.className = 'footer-columns';
    let current = null;
    [...links.children].forEach((el) => {
      if (el.tagName === 'H3') {
        current = document.createElement('div');
        current.className = 'footer-column';
        current.append(el);
        columns.append(current);
      } else if (current) {
        current.append(el);
      }
    });
    links.textContent = '';
    links.append(columns);
  }

  // 3: awards
  const awards = sections[2];
  if (awards) awards.classList.add('footer-awards');

  // 4: social + payment partners
  const meta = sections[3];
  if (meta) {
    meta.classList.add('footer-meta');
    [...meta.querySelectorAll(':scope > h3')].forEach((h) => {
      const list = h.nextElementSibling;
      const group = document.createElement('div');
      const kind = /payment/i.test(h.textContent) ? 'payments' : 'social';
      group.className = `footer-${kind}`;
      group.append(h);
      if (list) group.append(list);
      meta.append(group);
    });
  }

  // 5: legal links, copyright, locale
  const legal = sections[4];
  if (legal) {
    legal.classList.add('footer-legal');
    const locale = legal.querySelector('p:last-of-type');
    if (locale) locale.classList.add('footer-locale');
    const copyright = [...legal.querySelectorAll('p')].find((p) => /All Rights Reserved/i.test(p.textContent));
    if (copyright) copyright.classList.add('footer-copyright');
  }

  block.textContent = '';
  const footer = document.createElement('div');
  footer.className = 'footer-inner';
  while (container.firstElementChild) footer.append(container.firstElementChild);
  block.append(footer);
}
