/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: Saudia site-wide cleanup.
 *
 * Source is an Angular SPA (Sitecore JSS): classes include ng-star-inserted,
 * swiper-*, mat-*, cdk-*. All selectors below were verified by reading
 * migration-work/cleaned.html.
 *
 * IMPORTANT: The info-bar section (`.top-header-carousel`, page-templates s3)
 * lives INSIDE `<header>` in the source DOM (cleaned.html line ~103, header
 * spans lines 8-1265). It is authorable content that the section transformer
 * relies on, so we must NOT remove `<header>` wholesale. Instead we remove the
 * individual non-authorable header chrome children (skip link, cookie dialog,
 * mobile banner, logos, main nav, search, language, login) and leave the
 * status-bar / info-bar column intact.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Cookie / consent overlay (Angular Material dialog) — blocks parsing.
    // Found in cleaned.html: <app-cookie-policy>, .cookie-policy-overlay
    WebImporter.DOMUtils.remove(element, [
      'app-cookie-policy',
      '.cookie-policy-overlay',
      '[class*="cookie-policy"]',
    ]);

    // Angular Material button internals that are pure visual scaffolding and
    // would otherwise pollute button/anchor cells during parsing.
    // Found in cleaned.html: .mat-ripple, .mat-button-focus-overlay
    WebImporter.DOMUtils.remove(element, [
      '.mat-ripple',
      '.mat-button-focus-overlay',
      '.mat-button-ripple',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // --- Non-authorable global chrome (auto-populated by header/footer blocks) ---

    // Footer is fully auto-populated. Found: <footer id="global-footer">
    WebImporter.DOMUtils.remove(element, ['footer']);

    // Header chrome — remove individual non-authorable children BUT keep the
    // info-bar (.top-header-carousel / app-jss-status-bar), which is authorable.
    // All selectors found in cleaned.html header region (lines 8-1265):
    WebImporter.DOMUtils.remove(element, [
      '.skip-container',        // "Skip to content" link (line ~10)
      'app-mweb-banner',        // mobile web app banner (line ~76)
      'app-jss-saudia-logo',    // brand logos (lines ~147, 165)
      '.logo-seperator',        // logo divider (lines ~167, 184)
      'app-jss-new-navigation', // main navigation wrapper (line ~182)
      'nav',                    // primary nav (lines 186-1172)
      'app-jss-ai-search',      // header search (line ~1174)
      '.search-container',      // search panel (line ~1182)
      'app-jss-language',       // language switcher (line ~1193)
      'app-jss-login',          // login/account (line ~1206)
      '.header--sticky > .container.skip-container',
    ]);

    // --- Safe leftover / non-content elements ---
    WebImporter.DOMUtils.remove(element, [
      'iframe',
      'noscript',
      'link',
      'style',
      'script',
      'svg',
      'source',
    ]);

    // --- Attribute cleanup on remaining elements ---
    // Angular / Sitecore JSS leave framework-only attributes. Found across
    // cleaned.html: ng-star-inserted (846x), _ngcontent-*, _nghost-*, mat-* ids.
    element.querySelectorAll('*').forEach((el) => {
      // Remove all Angular ng* attributes (ng-star-inserted, _ngcontent-*, etc.)
      [...el.attributes].forEach((attr) => {
        const n = attr.name;
        if (
          n.startsWith('_ngcontent') ||
          n.startsWith('_nghost') ||
          n.startsWith('ng-') ||
          n === 'onclick' ||
          n.startsWith('data-track')
        ) {
          el.removeAttribute(n);
        }
      });
    });
  }
}
