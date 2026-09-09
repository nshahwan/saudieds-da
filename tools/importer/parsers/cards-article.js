/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.saudia.com (.imagelinklist--vertical)
 * Generated for Saudia homepage migration.
 *
 * Structure (from library-description.txt): 2-column cards.
 *   Row 1: block name (createBlock).
 *   Each subsequent row = one card: [image, textContent].
 *   textContent: heading + description + CTA.
 *
 * Source notes: `.imagelinklist--vertical > .container > ul > li` items, each an
 * <a href> wrapping a `.imagelinklist__img img` and a `.imagelinklist__content`
 * (h3 title, p description, and a `.imagelinklist__content-link .ctaText`
 * label). The card link is preserved as a CTA using the "Learn more" label.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('li'))
    .filter((li) => li.querySelector('.imagelinklist__img img, img'));

  const cells = [];

  items.forEach((li) => {
    const link = li.querySelector('a[href]');
    const image = li.querySelector('.imagelinklist__img img, img');

    const contentCell = [];

    const heading = li.querySelector('.imagelinklist__content h3, h3');
    if (heading) {
      const h = document.createElement('h3');
      h.textContent = heading.textContent.replace(/\s+/g, ' ').trim();
      if (h.textContent) contentCell.push(h);
    }

    const desc = li.querySelector('.imagelinklist__content > p, p');
    if (desc) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.replace(/\s+/g, ' ').trim();
      if (p.textContent) contentCell.push(p);
    }

    // CTA: card is the link; label lives in `.ctaText` (falls back to "Learn more").
    if (link && link.getAttribute('href')) {
      const ctaLabel = li.querySelector('.imagelinklist__content-link .ctaText, .ctaText');
      const a = document.createElement('a');
      a.href = link.getAttribute('href');
      a.textContent = ctaLabel ? ctaLabel.textContent.trim() : 'Learn more';
      contentCell.push(a);
    }

    if (image || contentCell.length) {
      cells.push([image || '', contentCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
