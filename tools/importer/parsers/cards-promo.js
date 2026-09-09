/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-promo. Base: cards.
 * Source: https://www.saudia.com (.offerforyou-content — the "Plan your next trip" section)
 * Generated for Saudia homepage migration.
 *
 * Structure (from library-description.txt): 2-column cards.
 *   Row 1: block name (createBlock).
 *   Each subsequent row = one card: [image, textContent].
 *
 * Source notes: the "Plan your next trip" section (`.offerforyou-content`) holds
 * four promo tiles in two shapes: two bare `.offer-col` tiles ("Let's get you
 * upgraded", "Hot deals") and two `.offer-content` tiles inside a nested
 * `.offer-section` ("Travel insurance", "Saudia Flight Pass"). Both shapes share
 * an `.offer-img img` and an `.offer-txt` title. Anchoring on each `.offer-img`
 * and walking up to its enclosing tile captures all four uniformly. The anchor
 * hrefs are often empty in the source, so the title is emitted as a plain heading
 * (a CTA is added only when a real href exists).
 */
export default function parse(element, { document }) {
  // Each tile has exactly one `.offer-img`; use it as the anchor and walk up to
  // the tile container so both `.offer-col` and `.offer-content` shapes are caught.
  const seen = new Set();
  const items = Array.from(element.querySelectorAll('.offer-img'))
    .map((img) => img.closest('.offer-content, .offer-col'))
    .filter((tile) => {
      if (!tile || seen.has(tile)) return false;
      seen.add(tile);
      return true;
    });

  const cells = [];

  items.forEach((item) => {
    const image = item.querySelector('.offer-img img, img');

    const contentCell = [];

    const titleLink = item.querySelector('.offer-txt a, h3 a, a');
    const titleText = (item.querySelector('.offer-txt h3, .offer-txt span, h3'));
    const label = titleText
      ? titleText.textContent.replace(/\s+/g, ' ').trim()
      : (titleLink ? titleLink.textContent.replace(/\s+/g, ' ').trim() : '');
    const href = titleLink ? titleLink.getAttribute('href') : '';
    const validHref = href && !/^javascript:/i.test(href) && href !== '#';

    if (label) {
      const h = document.createElement('h3');
      if (validHref) {
        const a = document.createElement('a');
        a.href = href;
        a.textContent = label;
        h.appendChild(a);
      } else {
        h.textContent = label;
      }
      contentCell.push(h);
    }

    if (image || contentCell.length) {
      cells.push([image || '', contentCell]);
    }
  });

  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-promo', cells });
  element.replaceWith(block);
}
