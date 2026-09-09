/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import carouselHeroParser from './parsers/carousel-hero.js';
import widgetParser from './parsers/widget.js';
import cardsFaresParser from './parsers/cards-fares.js';
import cardsPromoParser from './parsers/cards-promo.js';
import heroBannerParser from './parsers/hero-banner.js';
import cardsArticleParser from './parsers/cards-article.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/saudia-cleanup.js';
import sectionsTransformer from './transformers/saudia-sections.js';

// PARSER REGISTRY
const parsers = {
  'carousel-hero': carouselHeroParser,
  'widget': widgetParser,
  'cards-fares': cardsFaresParser,
  'cards-promo': cardsPromoParser,
  'hero-banner': heroBannerParser,
  'cards-article': cardsArticleParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'home',
  description: 'Saudia homepage: hero carousel, flight-booking widget, info bar, destination fares, promo tiles, promo banners, and an experiences article list.',
  urls: [
    'https://www.saudia.com',
  ],
  blocks: [
    { name: 'carousel-hero', instances: ['.custom-carousel.homeCarousel'] },
    { name: 'widget', instances: ['.booking'] },
    { name: 'cards-fares', instances: ['.featuredlist'] },
    { name: 'cards-promo', instances: ['.offerforyou-content'] },
    { name: 'hero-banner', instances: ['.custom-carousel.image--teaser'] },
    { name: 'cards-article', instances: ['.imagelinklist--vertical'] },
  ],
  sections: [
    { id: 's1', name: 'hero-carousel', selector: ['.custom-carousel.homeCarousel'], style: null, blocks: ['carousel-hero'], defaultContent: [] },
    { id: 's2', name: 'booking-widget', selector: ['.booking'], style: null, blocks: ['widget'], defaultContent: [] },
    { id: 's3', name: 'info-bar', selector: ['.top-header-carousel'], style: null, blocks: [], defaultContent: ['.top-header-carousel .content'] },
    { id: 's4', name: 'best-fares', selector: ['.featuredlist'], style: null, blocks: ['cards-fares'], defaultContent: [] },
    { id: 's5', name: 'plan-next-trip', selector: ['.offerforyou-content'], style: null, blocks: ['cards-promo'], defaultContent: [] },
    { id: 's6', name: 'flight-hotel-deals', selector: ['.custom-carousel.image--teaser'], style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 's7', name: 'shop-with-miles', selector: ['.custom-carousel.image--teaser'], style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 's8', name: 'be-first-to-know', selector: ['.custom-carousel.image--teaser'], style: null, blocks: ['hero-banner'], defaultContent: [] },
    { id: 's9', name: 'exceptional-experiences', selector: ['.imagelinklist--vertical'], style: null, blocks: ['cards-article'], defaultContent: [] },
    { id: 's10', name: 'visit-saudi', selector: ['.custom-carousel.image--teaser'], style: null, blocks: ['hero-banner'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (adds <hr> breaks)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook.
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration.
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup + section-break insertion)
    executeTransformers('beforeTransform', main, payload);

    // 2. Discover blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block; skip elements already replaced by an earlier parser
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path (root/homepage → /index)
    const rawPath = new URL(params.originalURL).pathname
      .replace(/\/$/, '')
      .replace(/\.html?$/, '');
    const path = WebImporter.FileUtils.sanitizePath(rawPath === '' ? '/index' : rawPath);

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
