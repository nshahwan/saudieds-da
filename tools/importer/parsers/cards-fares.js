/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-fares. Base: cards.
 * Source: https://www.saudia.com (.featuredlist)
 * Generated for Saudia homepage migration.
 *
 * Structure (from library-description.txt): 2-column cards.
 *   Row 1: block name (createBlock).
 *   Each subsequent row = one card: [image, textContent].
 *   textContent: destination heading + price + route + CTA link.
 *
 * Source notes: `.featuredlist > ul > li` items, each an <a> wrapping a
 * `.featuredlist__img img` and a `.featuredlist__content` block
 * (destination <h3>, price <h3.price-info>, route <p>). The whole card is a
 * link, preserved as a CTA. The list header (title/description/"Explore all
 * destinations") is section-level content, not a card, so it is omitted.
 */
export default function parse(element, { document }) {
  const items = Array.from(element.querySelectorAll('li'))
    .filter((li) => li.querySelector('.featuredlist__img img, img'));

  const cells = [];

  items.forEach((li) => {
    const link = li.querySelector('a[href]');
    const image = li.querySelector('.featuredlist__img img, img');

    const contentCell = [];

    // Destination title (plain heading, no price-info).
    const title = li.querySelector('.featuredlist__content h3:not(.price-info), h3:not(.price-info)');
    if (title) {
      const h = document.createElement('h3');
      h.textContent = title.textContent.trim();
      if (h.textContent) contentCell.push(h);
    }

    // Price line (e.g. "From SAR 1173").
    const price = li.querySelector('h3.price-info, .price-info');
    if (price) {
      const p = document.createElement('p');
      p.textContent = price.textContent.replace(/\s+/g, ' ').trim();
      if (p.textContent) contentCell.push(p);
    }

    // Route line (e.g. "Round trip From Jeddah").
    const route = li.querySelector('.featuredlist__content p, p');
    if (route) {
      const p = document.createElement('p');
      p.textContent = route.textContent.replace(/\s+/g, ' ').trim();
      if (p.textContent) contentCell.push(p);
    }

    // Preserve the card link as a CTA.
    if (link && link.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = link.getAttribute('href');
      cta.textContent = (title ? title.textContent.trim() : 'View fare');
      contentCell.push(cta);
    }

    if (image || contentCell.length) {
      cells.push([image || '', contentCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-fares', cells });
  element.replaceWith(block);
}
