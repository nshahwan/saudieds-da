/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-home.js
  var import_home_exports = {};
  __export(import_home_exports, {
    default: () => import_home_default
  });

  // tools/importer/parsers/carousel-hero.js
  function parse(element, { document: document2 }) {
    const slides = Array.from(
      element.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)")
    ).filter((slide) => slide.querySelector(".swiper-slide__image img, .swiper-slide__image"));
    const cells = [];
    slides.forEach((slide) => {
      const image = slide.querySelector(".swiper-slide__image img, img");
      const contentCell = [];
      const heading = slide.querySelector(
        ".swiper-slide__content h1, .swiper-slide__content h2, h1, h2"
      );
      if (heading) {
        const span = heading.querySelector("span");
        if (span && heading.children.length === 1) {
          heading.textContent = span.textContent.trim();
        }
        contentCell.push(heading);
      }
      const desc = slide.querySelector(".swiper-slide__desc");
      if (desc) {
        const descSpan = desc.querySelector("span");
        const p = document2.createElement("p");
        p.textContent = (descSpan || desc).textContent.trim();
        if (p.textContent) contentCell.push(p);
      }
      const cta = slide.querySelector(".swiper-slide__button a, a.button, a[href]");
      if (cta) {
        const label = cta.querySelector(".button-text");
        const link = document2.createElement("a");
        link.href = cta.getAttribute("href");
        link.textContent = (label ? label.textContent : cta.textContent).trim();
        if (link.textContent && link.href) contentCell.push(link);
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-hero", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/widget.js
  function parse2(element, { document: document2 }) {
    const widgetName = "booking";
    const link = document2.createElement("a");
    link.href = `/widgets/${widgetName}`;
    link.textContent = "Booking Widget";
    const cells = [[link]];
    const block = WebImporter.Blocks.createBlock(document2, { name: "widget", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-fares.js
  function parse3(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll("li")).filter((li) => li.querySelector(".featuredlist__img img, img"));
    const cells = [];
    items.forEach((li) => {
      const link = li.querySelector("a[href]");
      const image = li.querySelector(".featuredlist__img img, img");
      const contentCell = [];
      const title = li.querySelector(".featuredlist__content h3:not(.price-info), h3:not(.price-info)");
      if (title) {
        const h = document2.createElement("h3");
        h.textContent = title.textContent.trim();
        if (h.textContent) contentCell.push(h);
      }
      const price = li.querySelector("h3.price-info, .price-info");
      if (price) {
        const p = document2.createElement("p");
        p.textContent = price.textContent.replace(/\s+/g, " ").trim();
        if (p.textContent) contentCell.push(p);
      }
      const route = li.querySelector(".featuredlist__content p, p");
      if (route) {
        const p = document2.createElement("p");
        p.textContent = route.textContent.replace(/\s+/g, " ").trim();
        if (p.textContent) contentCell.push(p);
      }
      if (link && link.getAttribute("href")) {
        const cta = document2.createElement("a");
        cta.href = link.getAttribute("href");
        cta.textContent = title ? title.textContent.trim() : "View fare";
        contentCell.push(cta);
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-fares", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-promo.js
  function parse4(element, { document: document2 }) {
    const seen = /* @__PURE__ */ new Set();
    const items = Array.from(element.querySelectorAll(".offer-img")).map((img) => img.closest(".offer-content, .offer-col")).filter((tile) => {
      if (!tile || seen.has(tile)) return false;
      seen.add(tile);
      return true;
    });
    const cells = [];
    items.forEach((item) => {
      const image = item.querySelector(".offer-img img, img");
      const contentCell = [];
      const titleLink = item.querySelector(".offer-txt a, h3 a, a");
      const titleText = item.querySelector(".offer-txt h3, .offer-txt span, h3");
      const label = titleText ? titleText.textContent.replace(/\s+/g, " ").trim() : titleLink ? titleLink.textContent.replace(/\s+/g, " ").trim() : "";
      const href = titleLink ? titleLink.getAttribute("href") : "";
      const validHref = href && !/^javascript:/i.test(href) && href !== "#";
      if (label) {
        const h = document2.createElement("h3");
        if (validHref) {
          const a = document2.createElement("a");
          a.href = href;
          a.textContent = label;
          h.appendChild(a);
        } else {
          h.textContent = label;
        }
        contentCell.push(h);
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-promo", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/hero-banner.js
  function parse5(element, { document: document2 }) {
    const slide = element.querySelector(
      ".swiper-slide-active, .swiper-slide:not(.swiper-slide-duplicate)"
    ) || element;
    const bgImage = slide.querySelector(".swiper-slide__image img, img");
    const contentCell = [];
    const heading = slide.querySelector(".swiper-slide__content h1, .swiper-slide__content h2, h1, h2");
    if (heading) {
      const span = heading.querySelector("span");
      const level = heading.tagName.toLowerCase();
      const h = document2.createElement(level);
      h.textContent = (span || heading).textContent.replace(/\s+/g, " ").trim();
      if (h.textContent) contentCell.push(h);
    }
    const subheading = slide.querySelector(".swiper-slide__desc");
    if (subheading) {
      const p = document2.createElement("p");
      p.textContent = subheading.textContent.replace(/\s+/g, " ").trim();
      if (p.textContent) contentCell.push(p);
    }
    const cta = slide.querySelector(".swiper-slide__button a, a.button, a[href]");
    if (cta && cta.getAttribute("href")) {
      const label = cta.querySelector(".button-text, .mat-button-wrapper > span:first-child");
      const a = document2.createElement("a");
      a.href = cta.getAttribute("href");
      a.textContent = (label ? label.textContent : cta.textContent).replace(/\s+/g, " ").trim();
      if (a.textContent) contentCell.push(a);
    }
    if (!bgImage && !contentCell.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    if (bgImage) cells.push([bgImage]);
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-banner", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse6(element, { document: document2 }) {
    const items = Array.from(element.querySelectorAll("li")).filter((li) => li.querySelector(".imagelinklist__img img, img"));
    const cells = [];
    items.forEach((li) => {
      const link = li.querySelector("a[href]");
      const image = li.querySelector(".imagelinklist__img img, img");
      const contentCell = [];
      const heading = li.querySelector(".imagelinklist__content h3, h3");
      if (heading) {
        const h = document2.createElement("h3");
        h.textContent = heading.textContent.replace(/\s+/g, " ").trim();
        if (h.textContent) contentCell.push(h);
      }
      const desc = li.querySelector(".imagelinklist__content > p, p");
      if (desc) {
        const p = document2.createElement("p");
        p.textContent = desc.textContent.replace(/\s+/g, " ").trim();
        if (p.textContent) contentCell.push(p);
      }
      if (link && link.getAttribute("href")) {
        const ctaLabel = li.querySelector(".imagelinklist__content-link .ctaText, .ctaText");
        const a = document2.createElement("a");
        a.href = link.getAttribute("href");
        a.textContent = ctaLabel ? ctaLabel.textContent.trim() : "Learn more";
        contentCell.push(a);
      }
      if (image || contentCell.length) {
        cells.push([image || "", contentCell]);
      }
    });
    if (!cells.length) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/saudia-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "app-cookie-policy",
        ".cookie-policy-overlay",
        '[class*="cookie-policy"]'
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".mat-ripple",
        ".mat-button-focus-overlay",
        ".mat-button-ripple"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, ["footer"]);
      WebImporter.DOMUtils.remove(element, [
        ".skip-container",
        // "Skip to content" link (line ~10)
        "app-mweb-banner",
        // mobile web app banner (line ~76)
        "app-jss-saudia-logo",
        // brand logos (lines ~147, 165)
        ".logo-seperator",
        // logo divider (lines ~167, 184)
        "app-jss-new-navigation",
        // main navigation wrapper (line ~182)
        "nav",
        // primary nav (lines 186-1172)
        "app-jss-ai-search",
        // header search (line ~1174)
        ".search-container",
        // search panel (line ~1182)
        "app-jss-language",
        // language switcher (line ~1193)
        "app-jss-login",
        // login/account (line ~1206)
        ".header--sticky > .container.skip-container"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "iframe",
        "noscript",
        "link",
        "style",
        "script",
        "svg",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          const n = attr.name;
          if (n.startsWith("_ngcontent") || n.startsWith("_nghost") || n.startsWith("ng-") || n === "onclick" || n.startsWith("data-track")) {
            el.removeAttribute(n);
          }
        });
      });
    }
  }

  // tools/importer/transformers/saudia-sections.js
  var SECTION_MARKER_ATTR = "data-excat-section-id";
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
  function transform2(hookName, element, payload) {
    const sections = payload.template && payload.template.sections || [];
    if (hookName === "beforeTransform") {
      const used = /* @__PURE__ */ new Set();
      const anchors = sections.map((s) => resolveSection(element, s.selector, used));
      for (let i = sections.length - 1; i >= 1; i -= 1) {
        const sectionEl = anchors[i];
        if (!sectionEl) continue;
        const hr = document.createElement("hr");
        if (sections[i].style) hr.setAttribute(SECTION_MARKER_ATTR, sections[i].id);
        sectionEl.before(hr);
      }
    }
    if (hookName === "afterTransform") {
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section.style) continue;
        const marker = element.querySelector(`[${SECTION_MARKER_ATTR}="${section.id}"]`);
        if (!marker) continue;
        const metadataBlock = WebImporter.Blocks.createBlock(document, {
          name: "Section Metadata",
          cells: { style: section.style }
        });
        marker.after(metadataBlock);
        marker.removeAttribute(SECTION_MARKER_ATTR);
      }
    }
  }

  // tools/importer/import-home.js
  var parsers = {
    "carousel-hero": parse,
    "widget": parse2,
    "cards-fares": parse3,
    "cards-promo": parse4,
    "hero-banner": parse5,
    "cards-article": parse6
  };
  var PAGE_TEMPLATE = {
    name: "home",
    description: "Saudia homepage: hero carousel, flight-booking widget, info bar, destination fares, promo tiles, promo banners, and an experiences article list.",
    urls: [
      "https://www.saudia.com"
    ],
    blocks: [
      { name: "carousel-hero", instances: [".custom-carousel.homeCarousel"] },
      { name: "widget", instances: [".booking"] },
      { name: "cards-fares", instances: [".featuredlist"] },
      { name: "cards-promo", instances: [".offerforyou-content"] },
      { name: "hero-banner", instances: [".custom-carousel.image--teaser"] },
      { name: "cards-article", instances: [".imagelinklist--vertical"] }
    ],
    sections: [
      { id: "s1", name: "hero-carousel", selector: [".custom-carousel.homeCarousel"], style: null, blocks: ["carousel-hero"], defaultContent: [] },
      { id: "s2", name: "booking-widget", selector: [".booking"], style: null, blocks: ["widget"], defaultContent: [] },
      { id: "s3", name: "info-bar", selector: [".top-header-carousel"], style: null, blocks: [], defaultContent: [".top-header-carousel .content"] },
      { id: "s4", name: "best-fares", selector: [".featuredlist"], style: null, blocks: ["cards-fares"], defaultContent: [] },
      { id: "s5", name: "plan-next-trip", selector: [".offerforyou-content"], style: null, blocks: ["cards-promo"], defaultContent: [] },
      { id: "s6", name: "flight-hotel-deals", selector: [".custom-carousel.image--teaser"], style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "s7", name: "shop-with-miles", selector: [".custom-carousel.image--teaser"], style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "s8", name: "be-first-to-know", selector: [".custom-carousel.image--teaser"], style: null, blocks: ["hero-banner"], defaultContent: [] },
      { id: "s9", name: "exceptional-experiences", selector: [".imagelinklist--vertical"], style: null, blocks: ["cards-article"], defaultContent: [] },
      { id: "s10", name: "visit-saudi", selector: [".custom-carousel.image--teaser"], style: null, blocks: ["hero-banner"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        if (elements.length === 0) {
          console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
        }
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element,
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_home_default = {
    transform: (payload) => {
      const {
        document: document2,
        url,
        html,
        params
      } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        } else {
          console.warn(`No parser found for block: ${block.name}`);
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const rawPath = new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html?$/, "");
      const path = WebImporter.FileUtils.sanitizePath(rawPath === "" ? "/index" : rawPath);
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_home_exports);
})();
