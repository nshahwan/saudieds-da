// media query match that indicates desktop width
const isDesktop = window.matchMedia('(min-width: 900px)');

/**
 * Groups a menu's flat content (h3 + ul pairs, promo image) into a panel.
 * @param {Element[]} nodes Content nodes that belong to one top-level menu
 * @returns {HTMLElement} the panel element
 */
function buildPanel(nodes) {
  const panel = document.createElement('div');
  panel.className = 'nav-panel';
  const columns = document.createElement('div');
  columns.className = 'nav-panel-columns';
  const promo = document.createElement('div');
  promo.className = 'nav-panel-promo';

  let currentCol = null;
  nodes.forEach((node) => {
    if (node.tagName === 'H3') {
      currentCol = document.createElement('div');
      currentCol.className = 'nav-panel-col';
      currentCol.append(node);
      columns.append(currentCol);
    } else if (node.tagName === 'UL') {
      if (!currentCol) {
        currentCol = document.createElement('div');
        currentCol.className = 'nav-panel-col';
        columns.append(currentCol);
      }
      currentCol.append(node);
    } else if (node.querySelector && node.querySelector('img')) {
      promo.append(node);
    } else {
      // stray content (e.g. a bare paragraph) — keep in current column
      (currentCol || columns).append(node);
    }
  });

  panel.append(columns);
  if (promo.children.length) panel.append(promo);
  return panel;
}

/**
 * Closes all open menu panels.
 * @param {Element} navSections
 */
function closeAllMenus(navSections) {
  navSections.querySelectorAll('.nav-menu[aria-expanded="true"]').forEach((m) => {
    m.setAttribute('aria-expanded', 'false');
  });
}

/**
 * Builds the top-level menus from the sections' flat content.
 * Each <h2> starts a new menu; the following h3/ul/promo nodes are its panel.
 * @param {Element} navSections
 */
function decorateSections(navSections) {
  const wrapper = navSections.querySelector(':scope > div') || navSections;
  const nodes = [...wrapper.children];
  const menus = document.createElement('ul');
  menus.className = 'nav-menus';

  let currentMenu = null;
  let panelNodes = [];

  const flush = () => {
    if (currentMenu) {
      currentMenu.append(buildPanel(panelNodes));
      menus.append(currentMenu);
    }
    panelNodes = [];
  };

  nodes.forEach((node) => {
    if (node.tagName === 'H2') {
      flush();
      currentMenu = document.createElement('li');
      currentMenu.className = 'nav-menu';
      currentMenu.setAttribute('aria-expanded', 'false');
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.className = 'nav-menu-trigger';
      trigger.innerHTML = node.innerHTML;
      currentMenu.append(trigger);
    } else if (currentMenu) {
      panelNodes.push(node);
    }
  });
  flush();

  wrapper.replaceWith(menus);

  let closeTimer = null;
  const cancelClose = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };
  const scheduleClose = (menu) => {
    cancelClose();
    closeTimer = setTimeout(() => menu.setAttribute('aria-expanded', 'false'), 180);
  };

  menus.querySelectorAll('.nav-menu').forEach((menu) => {
    const trigger = menu.querySelector('.nav-menu-trigger');
    const panel = menu.querySelector('.nav-panel');
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = menu.getAttribute('aria-expanded') === 'true';
      closeAllMenus(navSections);
      menu.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    // Hover: open on enter, and keep open while over the trigger OR its panel
    // (the panel is positioned outside the trigger's box, so both regions must
    // cancel the close). A short close delay makes the trigger→panel move
    // forgiving; the menu stays open until the pointer truly leaves.
    [menu, panel].forEach((region) => {
      if (!region) return;
      region.addEventListener('mouseenter', () => {
        if (!isDesktop.matches) return;
        cancelClose();
        closeAllMenus(navSections);
        menu.setAttribute('aria-expanded', 'true');
      });
      region.addEventListener('mouseleave', () => {
        if (isDesktop.matches) scheduleClose(menu);
      });
    });
  });
}

/**
 * Toggles the mobile drawer open/closed.
 * @param {Element} nav
 */
function toggleMenu(nav, forceClosed = false) {
  const expanded = nav.getAttribute('aria-expanded') === 'true';
  const next = forceClosed ? false : !expanded;
  nav.setAttribute('aria-expanded', next ? 'true' : 'false');
  document.body.style.overflowY = next && !isDesktop.matches ? 'hidden' : '';
  const button = nav.querySelector('.nav-hamburger button');
  if (button) button.setAttribute('aria-label', next ? 'Close navigation' : 'Open navigation');
}

/**
 * loads and decorates the header nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // metadata-independent dual-fetch: /content first (localhost), then root (DA/EDS prod)
  let resp = await fetch('/content/nav.plain.html');
  if (!resp.ok) resp = await fetch('/nav.plain.html');
  if (!resp.ok) return;

  const html = await resp.text();
  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ['brand', 'sections', 'tools'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) decorateSections(navSections);

  // hamburger for mobile
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  hamburger.querySelector('button').addEventListener('click', () => toggleMenu(nav));
  nav.prepend(hamburger);
  nav.setAttribute('aria-expanded', 'false');

  // close menus when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navSections) closeAllMenus(navSections);
  });

  // reset state when crossing the desktop/mobile breakpoint
  isDesktop.addEventListener('change', () => {
    toggleMenu(nav, true);
    if (navSections) closeAllMenus(navSections);
  });

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}
