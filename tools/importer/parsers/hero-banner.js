/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-banner. Base: hero.
 * Source: https://www.saudia.com (.custom-carousel.image--teaser)
 * Generated for Saudia homepage migration.
 *
 * Structure (from library-description.txt): 1-column, up to 3 rows.
 *   Row 1: block name (createBlock).
 *   Row 2: background image (optional).
 *   Row 3: text content — title (heading) + optional subheading + CTA.
 *
 * Source notes: a single-slide "teaser" carousel. The active slide holds a
 * `.swiper-slide__image img` background and a `.swiper-slide__content` with an
 * h2 title and a `.swiper-slide__button a` CTA (button label wrapped in spans;
 * flattened here). Only the active/first slide is used.
 */
export default function parse(element, { document }) {
  const slide = element.querySelector(
    '.swiper-slide-active, .swiper-slide:not(.swiper-slide-duplicate)',
  ) || element;

  // Row 2: background image.
  const bgImage = slide.querySelector('.swiper-slide__image img, img');

  // Row 3: text content.
  const contentCell = [];

  const heading = slide.querySelector('.swiper-slide__content h1, .swiper-slide__content h2, h1, h2');
  if (heading) {
    const span = heading.querySelector('span');
    const level = heading.tagName.toLowerCase();
    const h = document.createElement(level);
    h.textContent = (span || heading).textContent.replace(/\s+/g, ' ').trim();
    if (h.textContent) contentCell.push(h);
  }

  const subheading = slide.querySelector('.swiper-slide__desc');
  if (subheading) {
    const p = document.createElement('p');
    p.textContent = subheading.textContent.replace(/\s+/g, ' ').trim();
    if (p.textContent) contentCell.push(p);
  }

  const cta = slide.querySelector('.swiper-slide__button a, a.button, a[href]');
  if (cta && cta.getAttribute('href')) {
    const label = cta.querySelector('.button-text, .mat-button-wrapper > span:first-child');
    const a = document.createElement('a');
    a.href = cta.getAttribute('href');
    // Prefer an explicit label; fall back to the anchor text minus icon glyphs.
    a.textContent = (label ? label.textContent : cta.textContent).replace(/\s+/g, ' ').trim();
    if (a.textContent) contentCell.push(a);
  }

  // Empty-block guard: no image and no text → drop wrapper, keep children.
  if (!bgImage && !contentCell.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];
  if (bgImage) cells.push([bgImage]);       // Row 2: single-cell background image.
  cells.push([contentCell]);                // Row 3: single cell holding all text content.

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-banner', cells });
  element.replaceWith(block);
}
