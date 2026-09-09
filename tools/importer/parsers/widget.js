/* eslint-disable */
/* global WebImporter */
/**
 * Parser for widget. Base: widget (custom block, not in library catalog).
 * Source: https://www.saudia.com (.booking)
 * Generated for Saudia homepage migration.
 *
 * The source `.booking` element is an interactive, client-side Angular flight
 * booking component (tabs: Book / Manage / Check-in / Flight status). None of
 * its live state can be statically imported.
 *
 * The `widget` block (blocks/widget/widget.js) is authored as a SINGLE LINK to
 * a widget asset under `/widgets/`. At decorate time it parses the link
 * pathname to derive the widget name, then fetches `/widgets/{name}.html|css|js`
 * and mounts the live widget. So the imported block must contain exactly one
 * anchor pointing at the widget asset.
 *
 * Structure: 1 column, 1 content row holding a single link.
 *   Row 1: block name (createBlock).
 *   Row 2: <a href="/widgets/booking">Booking Widget</a>
 */
export default function parse(element, { document }) {
  // Derive the widget name from the source class. `.booking` → "booking".
  const widgetName = 'booking';

  const link = document.createElement('a');
  link.href = `/widgets/${widgetName}`;
  link.textContent = 'Booking Widget';

  const cells = [[link]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'widget', cells });
  element.replaceWith(block);
}
