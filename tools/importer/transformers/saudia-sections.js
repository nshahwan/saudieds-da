/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Saudia section breaks.
 *
 * Inserts one `<hr>` before every section except the first, based on the
 * DOM-verified selectors in page-templates.json (home template, 10 sections).
 * None of the 10 sections carries a `style`, so NO Section Metadata blocks are
 * emitted — only the 9 section breaks.
 *
 * Selectors were verified by reading migration-work/cleaned.html:
 *   s1 hero-carousel      .custom-carousel.homeCarousel     (line ~1284)
 *   s2 booking-widget     .booking                          (line ~1516)
 *   s3 info-bar           .top-header-carousel              (line ~103, inside header)
 *   s4 best-fares         .featuredlist                     (line ~2099)
 *   s5 plan-next-trip     .offer-section                    (line ~2314)
 *   s6 flight-hotel-deals .custom-carousel.image--teaser    (line ~2382)
 *   s7 shop-with-miles    .custom-carousel.image--teaser    (line ~2483)
 *   s8 be-first-to-know   .custom-carousel.image--teaser    (line ~2584)
 *   s9 exceptional-exp.   .imagelinklist--vertical          (line ~2790)
 *   s10 visit-saudi       .custom-carousel.image--teaser    (line ~2967)
 *
 * NOTE: s6/s7/s8/s10 share the SAME selector but map to 4 distinct teaser
 * elements. A naive querySelector would return the first match for all four,
 * so we track already-claimed elements (`used`) and hand each section the next
 * unclaimed match in DOM order.
 *
 * Breaks are inserted in `beforeTransform` (per the transformer reference):
 * block parsers run between the hooks and call element.replaceWith(block) on
 * the exact element a section selector targets, so resolving/inserting in
 * afterTransform would silently find nothing. `<hr>` is not a `<div>`, so
 * inserting it never disturbs any parser's :nth-of-type selectors.
 */

const SECTION_MARKER_ATTR = 'data-excat-section-id';

// Resolve a section to a still-unclaimed element. section.selector is an array
// of candidate selectors tried in order; within each we take the first element
// not already used by an earlier section (handles the shared teaser selector).
function resolveSection(root, selectors, used) {
  for (const sel of selectors) {
    const matches = root.querySelectorAll(sel);
    for (const el of matches) {
      if (!used.has(el)) {
        used.add(el);
        return el;
      }
    }
  }
  return null;
}

export default function transform(hookName, element, payload) {
  const sections = (payload.template && payload.template.sections) || [];

  if (hookName === 'beforeTransform') {
    // Resolve anchors in forward (DOM) order using a single shared `used` set
    // so shared selectors (the four .image--teaser sections) each claim a
    // distinct instance. We hold direct element references, so insertion order
    // does not corrupt later lookups.
    const used = new Set();
    const anchors = sections.map((s) => resolveSection(element, s.selector, used));

    // Insert `<hr>` before each non-first section that resolved to an element.
    // Iterate in reverse for parity with the reference implementation.
    for (let i = sections.length - 1; i >= 1; i -= 1) {
      const sectionEl = anchors[i];
      if (!sectionEl) continue; // selector did not match — skip, never guess
      const hr = document.createElement('hr');
      if (sections[i].style) hr.setAttribute(SECTION_MARKER_ATTR, sections[i].id);
      sectionEl.before(hr);
    }
  }

  if (hookName === 'afterTransform') {
    // No section carries a `style`, so there are no Section Metadata blocks to
    // emit. Guard anchored to the marker for correctness if styles are added
    // to page-templates.json later.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section.style) continue;
      const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
      if (!marker) continue;
      const metadataBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      marker.after(metadataBlock);
      marker.removeAttribute(SECTION_MARKER_ATTR);
    }
  }
}
