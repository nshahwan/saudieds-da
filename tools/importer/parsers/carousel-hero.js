/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel-hero. Base: carousel.
 * Source: https://www.saudia.com (.custom-carousel.homeCarousel)
 * Generated for Saudia homepage migration.
 *
 * Structure (from library-description.txt): 2-column carousel.
 *   Row 1: block name (handled by createBlock).
 *   Each subsequent row = one slide: [image, textContent].
 *   textContent cell: heading (h1) + optional description + optional CTA.
 *
 * Source notes: real slides live in `.swiper-slide` containing a
 * `.swiper-slide__image` (desktop-view). Swiper may clone slides at runtime
 * (`.swiper-slide-duplicate`) — those are excluded. Thumbnails live under
 * `.dot .image-value` and are ignored.
 */
export default function parse(element, { document }) {
  // Real content slides only: must contain a slide image, and not be a swiper clone.
  const slides = Array.from(
    element.querySelectorAll('.swiper-slide:not(.swiper-slide-duplicate)'),
  ).filter((slide) => slide.querySelector('.swiper-slide__image img, .swiper-slide__image'));

  const cells = [];

  slides.forEach((slide) => {
    // Column 1: slide image (prefer the main slide image, not thumbnails).
    const image = slide.querySelector('.swiper-slide__image img, img');

    // Column 2: text content — heading, description, CTA.
    const contentCell = [];

    const heading = slide.querySelector(
      '.swiper-slide__content h1, .swiper-slide__content h2, h1, h2',
    );
    if (heading) {
      // Unwrap inner spans so the heading text renders cleanly.
      const span = heading.querySelector('span');
      if (span && heading.children.length === 1) {
        heading.textContent = span.textContent.trim();
      }
      contentCell.push(heading);
    }

    const desc = slide.querySelector('.swiper-slide__desc');
    if (desc) {
      const descSpan = desc.querySelector('span');
      const p = document.createElement('p');
      p.textContent = (descSpan || desc).textContent.trim();
      if (p.textContent) contentCell.push(p);
    }

    const cta = slide.querySelector('.swiper-slide__button a, a.button, a[href]');
    if (cta) {
      // Flatten CTA label (source wraps it in nested spans / ripple markup).
      const label = cta.querySelector('.button-text');
      const link = document.createElement('a');
      link.href = cta.getAttribute('href');
      link.textContent = (label ? label.textContent : cta.textContent).trim();
      if (link.textContent && link.href) contentCell.push(link);
    }

    // Only emit a row if we have at least an image or some text content.
    if (image || contentCell.length) {
      cells.push([image || '', contentCell]);
    }
  });

  // Empty-block guard: nothing extracted → drop the wrapper, keep children.
  if (!cells.length) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-hero', cells });
  element.replaceWith(block);
}
