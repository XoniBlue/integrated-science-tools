(function () {
  /*
   * Motion migration summary:
   * - MIGRATED TO CSS: simulator idle pulse cycle formerly driven by requestAnimationFrame custom properties.
   * - MIGRATED TO CSS: unit tab panel show/hide now uses class-driven transitions with delayed [hidden] on close.
   */
  const STORAGE_KEY = "ist-theme";
  const WINDOW_NAME_KEY = "ist-theme";
  const QUERY_KEY = "istTheme";
  const MOBILE_NAV_BREAKPOINT = 1024;
  const THEMES = ["purple", "ocean"];
  const TAB_TRANSITION_FALLBACK_MS = 320;
  const SIM_BADGE_LABELS = {
    "lewis-dot": "Lewis Dot Structure",
    "electron-configuration": "Electron Configuration",
    "equation-balancer": "Equation Balancer",
    "molecular-geometry": "Molecular Geometry",
    "ph-titration": "pH Titration",
    "coulombs-law-playground": "Coulomb's Law",
    "material-selector": "Material Selector",
    "molecular-polarity": "Molecular Polarity",
    "solution-mixer": "Solution Mixer",
    "energy-conversion": "Energy Conversion",
    "orbital-motion": "Orbital Motion",
    "resonance-lab": "Resonance Lab",
    "cosmic-expansion": "Cosmic Expansion",
    "field-superposition": "Field Superposition",
    "gravity-well": "Gravity Well",
    "electric-field-mapper": "E-Field Mapper",
    "force-balance": "Force Balance",
    "newtons-second-law-lab": "Newton 2nd Law",
    "motion-graph-lab": "Motion Graph Lab",
    "ramp-dynamics": "Ramp Dynamics",
    "collision-lab": "Collision Lab",
    "crash-absorber": "Crash Absorber",
    "impulse-analyzer": "Impulse Analyzer",
    "unit-3-test-checklist": "Unit 3 Test Checklist"
  };

  const fallbackNav = `
<nav class="site-header-shell" aria-label="Site navigation">
  <div class="sidebar-top">
    <a class="brand" data-link="index.html">
      <span class="brand-mark" aria-hidden="true">
        <svg class="brand-icon" viewBox="0 0 48 48" role="img">
          <defs>
            <linearGradient id="brandFlaskFill" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="var(--accent)"/>
              <stop offset="100%" stop-color="var(--accent2)"/>
            </linearGradient>
          </defs>
          <path d="M18 7h12a2 2 0 0 1 0 4h-1v9.1l7.9 12.5A7 7 0 0 1 31 43H17a7 7 0 0 1-5.9-10.4L19 20.1V11h-1a2 2 0 0 1 0-4z" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>
          <path d="M16.2 29.4h15.6c1.5 0 2.4 1.7 1.5 3L30.8 36a4.7 4.7 0 0 1-3.9 2.1h-5.8a4.7 4.7 0 0 1-3.9-2.1l-2.5-3.6c-.9-1.3 0-3 1.5-3z" fill="url(#brandFlaskFill)"/>
          <path d="M35 8.5l1.2 2.6 2.8 1.2-2.8 1.2L35 16l-1.2-2.5-2.8-1.2 2.8-1.2z" fill="var(--accent2)"/>
        </svg>
      </span>
      <span class="brand-title">Integrated Science Tools</span>
    </a>
    <div class="header-controls">
      <span class="nav-badge" aria-live="polite">Home</span>
      <button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme">◐</button>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
  <div id="primary-menu" class="site-nav" aria-label="Primary">
    <a data-link="index.html" data-page-link="home">Home</a>
    <a data-link="unit-1/index.html" data-page-link="unit-1" title="Unit 1: Chemical Bonds and Fundamental Forces" aria-label="Unit 1: Chemical Bonds and Fundamental Forces">Unit 1</a>
    <a data-link="unit-2/index.html" data-page-link="unit-2" title="Unit 2: Molecules and Engineering Solutions" aria-label="Unit 2: Molecules and Engineering Solutions">Unit 2</a>
    <a data-link="unit-3/index.html" data-page-link="unit-3" title="Unit 3: Energy and Orbital Motion" aria-label="Unit 3: Energy and Orbital Motion">Unit 3</a>
    <a data-link="unit-4/index.html" data-page-link="unit-4" title="Unit 4: Fields, Forces, and the Universe’s Origin" aria-label="Unit 4: Fields, Forces, and the Universe’s Origin">Unit 4</a>
    <a data-link="unit-5/index.html" data-page-link="unit-5" title="Unit 5: Apply the Laws of Motion" aria-label="Unit 5: Apply the Laws of Motion">Unit 5</a>
    <a data-link="unit-6/index.html" data-page-link="unit-6" title="Unit 6: Momentum, Mechanics, and Engineering Solutions" aria-label="Unit 6: Momentum, Mechanics, and Engineering Solutions">Unit 6</a>
  </div>
  <div class="nav-footer">
    <p class="nav-credit">Made by Xoni for Ms. H with ❤️</p>
    <div class="nav-footer-badges">
      <a
        class="footer-github-badge"
        href="https://github.com/XoniBlue/integrated-science-tools"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Integrated Science Tools on GitHub"
      >
        <img
          src="https://img.shields.io/badge/GitHub-Repo-06b6d4?logo=github&logoColor=ffffff"
          alt="GitHub Repo badge"
          loading="lazy"
          decoding="async"
        />
      </a>
      <a
        class="footer-github-badge"
        href="https://github.com/XoniBlue/integrated-science-tools"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Built with Vanilla JavaScript"
      >
        <img
          src="https://img.shields.io/badge/Vanilla-JS-f7df1e?logo=javascript&logoColor=000"
          alt="Vanilla JS badge"
          loading="lazy"
          decoding="async"
        />
      </a>
    </div>
  </div>
</nav>`;

  function resolveHref(root, path) {
    const trimmed = (root || ".").replace(/\/$/, "");
    return trimmed === "." ? `./${path}` : `${trimmed}/${path}`;
  }

  function getThemeFromWindowName() {
    const raw = typeof window.name === "string" ? window.name : "";
    const entries = raw.split(";").map((entry) => entry.trim()).filter(Boolean);
    const pair = entries.find((entry) => entry.startsWith(`${WINDOW_NAME_KEY}=`));
    if (!pair) {
      return null;
    }
    const value = pair.slice(`${WINDOW_NAME_KEY}=`.length);
    return THEMES.includes(value) ? value : null;
  }

  function setThemeInWindowName(theme) {
    const safeTheme = THEMES.includes(theme) ? theme : "purple";
    const raw = typeof window.name === "string" ? window.name : "";
    const entries = raw.split(";").map((entry) => entry.trim()).filter(Boolean);
    const filtered = entries.filter((entry) => !entry.startsWith(`${WINDOW_NAME_KEY}=`));
    filtered.push(`${WINDOW_NAME_KEY}=${safeTheme}`);
    window.name = filtered.join(";");
  }

  function getThemeFromQuery() {
    try {
      const params = new URLSearchParams(window.location.search);
      const value = params.get(QUERY_KEY);
      return THEMES.includes(value) ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function setThemeQueryParam(theme) {
    if (!THEMES.includes(theme)) {
      return;
    }
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(QUERY_KEY, theme);
      if (history.replaceState) {
        history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
    } catch (_error) {
      // Ignore URL manipulation failures.
    }
  }

  function shouldTreatAsInternalLink(url) {
    if (window.location.protocol === "file:") {
      return url.protocol === "file:";
    }
    return url.origin === window.location.origin;
  }

  function applyThemeParamToLinks(theme) {
    if (!THEMES.includes(theme)) {
      return;
    }
    document.querySelectorAll("a[href]").forEach((link) => {
      const raw = link.getAttribute("href");
      if (!raw || raw.startsWith("#") || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) {
        return;
      }
      try {
        const url = new URL(raw, window.location.href);
        if (!shouldTreatAsInternalLink(url)) {
          return;
        }
        url.searchParams.set(QUERY_KEY, theme);
        link.setAttribute("href", url.href);
      } catch (_error) {
        // Ignore invalid URLs.
      }
    });
  }

  function getSavedTheme() {
    const queryTheme = getThemeFromQuery();
    if (queryTheme) {
      return queryTheme;
    }
    const windowTheme = getThemeFromWindowName();
    if (windowTheme) {
      return windowTheme;
    }
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return THEMES.includes(saved) ? saved : "purple";
    } catch (_error) {
      return "purple";
    }
  }

  function applyTheme(theme) {
    if (theme === "ocean") {
      document.documentElement.setAttribute("data-theme", "ocean");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function updateThemeToggleLabel(theme) {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) {
      return;
    }
    const nextTheme = theme === "purple" ? "ocean" : "purple";
    toggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    toggle.setAttribute("title", `Switch to ${nextTheme} theme`);
  }

  function syncThemeFromStorage() {
    const current = getSavedTheme();
    applyTheme(current);
    setThemeInWindowName(current);
    setThemeQueryParam(current);
    applyThemeParamToLinks(current);
    updateThemeToggleLabel(current);
  }

  function setTheme(theme) {
    const value = THEMES.includes(theme) ? theme : "purple";
    applyTheme(value);
    setThemeInWindowName(value);
    setThemeQueryParam(value);
    applyThemeParamToLinks(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch (_error) {
      // Storage can be unavailable in some Firefox/file contexts.
    }
    updateThemeToggleLabel(value);
  }

  function initSkipLink() {
    const main = document.querySelector("main");
    if (!main) {
      return;
    }
    if (!main.id) {
      main.id = "main-content";
    }
    if (!document.querySelector(".skip-link")) {
      const skip = document.createElement("a");
      skip.className = "skip-link";
      skip.href = `#${main.id}`;
      skip.textContent = "Skip to main content";
      document.body.insertBefore(skip, document.body.firstChild);
    }
  }

  async function loadPartial(path, fallback) {
    try {
      const response = await fetch(path);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.text();
    } catch (_error) {
      return fallback;
    }
  }

  function cleanLabel(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function getSimContextLabel() {
    const isSimPage = Boolean(document.body.dataset.simPage) || window.location.pathname.includes("/sims/");
    if (!isSimPage) {
      return "";
    }

    const simKey = cleanLabel(document.body.dataset.simPage) || cleanLabel(window.location.pathname.split("/").pop() || "").replace(/\.html$/i, "");
    if (simKey && SIM_BADGE_LABELS[simKey]) {
      return SIM_BADGE_LABELS[simKey];
    }

    const heading = document.querySelector(".sim-wrap h1, main h1");
    if (heading) {
      const headingText = cleanLabel(heading.textContent)
        .replace(/\bInteractive\b/gi, "")
        .replace(/\bSimulator\b/gi, "")
        .replace(/\bBuilder\b/gi, "")
        .replace(/\bDesigner\b/gi, "")
        .replace(/\bExplorer\b/gi, "")
        .replace(/\bModel\b/gi, "")
        .replace(/\s+/g, " ")
        .trim();
      if (headingText) {
        return headingText;
      }
    }

    const pageTitle = cleanLabel(document.title).replace(/\s*\|\s*Integrated Science Tools\s*$/i, "");
    return cleanLabel(pageTitle);
  }

  function wireNav(root, pageId) {
    document.querySelectorAll("[data-link]").forEach((element) => {
      element.setAttribute("href", resolveHref(root, element.getAttribute("data-link")));
    });

    document.querySelectorAll("[data-page-link]").forEach((element) => {
      if (element.getAttribute("data-page-link") === pageId) {
        element.classList.add("active");
        element.setAttribute("aria-current", "page");
      }
    });

    const activeLink = document.querySelector("[data-page-link].active");
    const badge = document.querySelector(".nav-badge");
    if (badge) {
      const simLabel = getSimContextLabel();
      const unitText = activeLink ? (cleanLabel(activeLink.textContent) || "Page") : "Page";
      const fullLabel = simLabel || unitText;
      badge.textContent = fullLabel;
      badge.setAttribute("title", fullLabel);
    }

    const button = document.querySelector(".nav-toggle");
    const drawerOpenButton = document.querySelector(".sidebar-open");
    const nav = document.getElementById("primary-menu");
    if (!button || !nav) {
      return;
    }

    const isDrawerMode = () => window.innerWidth <= MOBILE_NAV_BREAKPOINT;

    const openNav = () => {
      if (!isDrawerMode()) {
        return;
      }
      document.body.classList.add("nav-open");
      document.body.classList.remove("menu-hidden");
      document.body.classList.add("menu-compact");
      button.setAttribute("aria-expanded", "true");
      if (drawerOpenButton) {
        drawerOpenButton.setAttribute("aria-expanded", "true");
      }
    };

    const closeNav = () => {
      button.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
      document.body.classList.remove("menu-hidden");
      if (drawerOpenButton) {
        drawerOpenButton.setAttribute("aria-expanded", "false");
      }
    };

    button.addEventListener("click", () => {
      if (document.body.classList.contains("nav-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    if (drawerOpenButton) {
      drawerOpenButton.addEventListener("click", () => {
        if (document.body.classList.contains("nav-open")) {
          closeNav();
        } else {
          openNav();
        }
      });
    }

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (isDrawerMode()) {
          closeNav();
        }
      });
    });

    document.addEventListener("click", (event) => {
      if (!document.body.classList.contains("nav-open") || !isDrawerMode()) {
        return;
      }
      const header = document.getElementById("site-header");
      if (!header) {
        return;
      }
      if (!header.contains(event.target) && (!drawerOpenButton || !drawerOpenButton.contains(event.target))) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > MOBILE_NAV_BREAKPOINT) {
        closeNav();
      }
    });

    const themeToggle = document.querySelector(".theme-toggle");
    if (themeToggle) {
      themeToggle.addEventListener("click", () => {
        const current = document.documentElement.getAttribute("data-theme") === "ocean" ? "ocean" : "purple";
        setTheme(current === "purple" ? "ocean" : "purple");
      });
    }
  }

  function initUnitTabs() {
    const groups = document.querySelectorAll(".unit-tabs");
    groups.forEach((group) => {
      const buttons = Array.from(group.querySelectorAll(".tab-button"));
      const panels = Array.from(group.querySelectorAll(".tab-panel"));
      if (!buttons.length || !panels.length) {
        return;
      }

      const panelIds = new Set(panels.map((panel) => panel.id));
      const closeTimers = new WeakMap();

      const clearCloseTimer = (panel) => {
        const timer = closeTimers.get(panel);
        if (timer) {
          window.clearTimeout(timer);
          closeTimers.delete(panel);
        }
      };

      const hidePanel = (panel) => {
        clearCloseTimer(panel);
        panel.hidden = true;
        panel.classList.remove("is-exiting", "is-active");
        panel.setAttribute("aria-hidden", "true");
      };

      function activate(targetId, updateHash = false, skipEnterAnimation = false) {
        if (!panelIds.has(targetId)) {
          return;
        }

        buttons.forEach((button) => {
          const active = button.getAttribute("aria-controls") === targetId;
          button.setAttribute("aria-selected", active ? "true" : "false");
          button.tabIndex = active ? 0 : -1;
        });

        const targetPanel = panels.find((panel) => panel.id === targetId);
        if (!targetPanel) {
          return;
        }

        // MIGRATED TO CSS: tab panel visibility now transitions via classes, with [hidden] set after close.
        panels.forEach((panel) => {
          const isTarget = panel === targetPanel;
          if (isTarget) {
            clearCloseTimer(panel);
            panel.hidden = false;
            panel.classList.remove("is-exiting");
            panel.setAttribute("aria-hidden", "false");
            if (skipEnterAnimation) {
              panel.classList.add("is-active");
            } else {
              window.requestAnimationFrame(() => {
                panel.classList.add("is-active");
              });
            }
            return;
          }

          if (panel.hidden) {
            panel.classList.remove("is-active", "is-exiting");
            panel.setAttribute("aria-hidden", "true");
            return;
          }

          panel.classList.remove("is-active");
          panel.classList.add("is-exiting");
          panel.setAttribute("aria-hidden", "true");

          const finalizeHide = (event) => {
            if (event && event.target !== panel) {
              return;
            }
            panel.removeEventListener("transitionend", finalizeHide);
            hidePanel(panel);
          };

          panel.addEventListener("transitionend", finalizeHide);
          const fallback = window.setTimeout(finalizeHide, TAB_TRANSITION_FALLBACK_MS);
          closeTimers.set(panel, fallback);
        });

        if (updateHash && history.replaceState) {
          history.replaceState(null, "", `#${targetId}`);
        }
      }

      const hashTarget = window.location.hash.replace(/^#/, "");
      const selected = buttons.find((button) => button.getAttribute("aria-selected") === "true");
      const defaultTarget = (selected || buttons[0]).getAttribute("aria-controls");
      panels.forEach((panel) => {
        panel.hidden = true;
        panel.classList.remove("is-active", "is-exiting");
        panel.setAttribute("aria-hidden", "true");
      });
      activate(panelIds.has(hashTarget) ? hashTarget : defaultTarget, false, true);

      buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
          activate(button.getAttribute("aria-controls"), true);
        });

        button.addEventListener("keydown", (event) => {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
            return;
          }
          event.preventDefault();
          const nextIndex = event.key === "ArrowRight"
            ? (index + 1) % buttons.length
            : (index - 1 + buttons.length) % buttons.length;
          buttons[nextIndex].focus();
          activate(buttons[nextIndex].getAttribute("aria-controls"), true);
        });
      });

      window.addEventListener("hashchange", () => {
        const nextTarget = window.location.hash.replace(/^#/, "");
        if (panelIds.has(nextTarget)) {
          activate(nextTarget);
        }
      });
    });
  }

  function initSectionCarousels() {
    const grids = document.querySelectorAll(".page-panel .section-grid");
    grids.forEach((grid) => {
      if (grid.closest(".section-carousel")) {
        return;
      }

      const cards = Array.from(grid.querySelectorAll(".card"));
      if (!cards.length) {
        return;
      }

      const carousel = document.createElement("div");
      carousel.className = "section-carousel";

      const prev = document.createElement("button");
      prev.type = "button";
      prev.className = "section-carousel-arrow section-carousel-prev";
      prev.setAttribute("aria-label", "Previous simulations");
      prev.textContent = "‹";

      const next = document.createElement("button");
      next.type = "button";
      next.className = "section-carousel-arrow section-carousel-next";
      next.setAttribute("aria-label", "Next simulations");
      next.textContent = "›";

      const viewport = document.createElement("div");
      viewport.className = "section-carousel-viewport";

      grid.classList.add("section-grid--carousel");

      const parent = grid.parentElement;
      if (!parent) {
        return;
      }
      parent.insertBefore(carousel, grid);
      viewport.appendChild(grid);
      carousel.append(prev, viewport, next);

      cards.forEach((card) => {
        const link = card.querySelector('a.button-link[href], a[href]');
        if (!link) {
          return;
        }
        card.classList.add("card-clickable");
        card.addEventListener("click", (event) => {
          if (event.target.closest("a, button, input, select, textarea, label")) {
            return;
          }
          link.click();
        });
      });

      const columnsPerView = () => {
        const width = viewport.clientWidth;
        if (width >= 1280) return 4;
        if (width >= 980) return 3;
        if (width >= 680) return 2;
        return 1;
      };

      const stepSize = () => Math.max(220, viewport.clientWidth);

      const sync = () => {
        carousel.style.setProperty("--carousel-cols", String(columnsPerView()));
        const max = grid.scrollWidth - viewport.clientWidth;
        const hasOverflow = max > 4;
        carousel.classList.toggle("is-static", !hasOverflow);
        prev.disabled = !hasOverflow || grid.scrollLeft <= 2;
        next.disabled = !hasOverflow || grid.scrollLeft >= max - 2;
      };

      prev.addEventListener("click", () => {
        grid.scrollBy({ left: -stepSize(), behavior: "smooth" });
      });

      next.addEventListener("click", () => {
        grid.scrollBy({ left: stepSize(), behavior: "smooth" });
      });

      grid.addEventListener("scroll", () => {
        window.requestAnimationFrame(sync);
      }, { passive: true });

      window.addEventListener("resize", sync);
      if (typeof ResizeObserver !== "undefined") {
        const observer = new ResizeObserver(sync);
        observer.observe(viewport);
        observer.observe(grid);
      }
      sync();
    });
  }

  function syncHeaderOffset() {
    const header = document.getElementById("site-header");
    if (!header) {
      return;
    }
    if (window.innerWidth > MOBILE_NAV_BREAKPOINT) {
      document.documentElement.style.setProperty("--site-header-offset", "1.2rem");
      return;
    }
    document.documentElement.style.setProperty("--site-header-offset", "1rem");
  }

  function initFloatingMenuBehavior() {
    const menuButton = document.querySelector(".sidebar-open");
    if (!menuButton) {
      return;
    }

    let lastY = window.scrollY;

    const syncMenuState = () => {
      if (window.innerWidth > MOBILE_NAV_BREAKPOINT) {
        document.body.classList.remove("menu-compact", "menu-hidden");
        lastY = window.scrollY;
        return;
      }

      if (document.body.classList.contains("nav-open")) {
        document.body.classList.remove("menu-hidden");
        document.body.classList.add("menu-compact");
        lastY = window.scrollY;
        return;
      }

      const y = window.scrollY;
      const nearTop = y < 72;
      const scrollingDown = y > lastY + 6;
      const scrollingUp = y < lastY - 6;

      if (nearTop) {
        document.body.classList.remove("menu-compact", "menu-hidden");
      } else if (scrollingDown) {
        document.body.classList.add("menu-compact", "menu-hidden");
      } else if (scrollingUp) {
        document.body.classList.add("menu-compact");
        document.body.classList.remove("menu-hidden");
      }

      lastY = y;
    };

    window.addEventListener("scroll", syncMenuState, { passive: true });
    window.addEventListener("resize", syncMenuState);
    syncMenuState();
  }

  async function initSharedChrome() {
    const root = document.body.dataset.siteRoot || ".";
    const pageId = document.body.dataset.page || "";
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");

    if (!header) {
      return;
    }

    const navPath = resolveHref(root, "shared/nav.html");
    const navHtml = await loadPartial(navPath, fallbackNav);

    header.innerHTML = navHtml;
    if (!document.querySelector(".sidebar-open")) {
      const openBtn = document.createElement("button");
      openBtn.type = "button";
      openBtn.className = "sidebar-open";
      openBtn.setAttribute("aria-label", "Open navigation");
      openBtn.setAttribute("aria-controls", "site-header");
      openBtn.setAttribute("aria-expanded", "false");
      openBtn.innerHTML = '<span class="sidebar-open-icon" aria-hidden="true">☰</span><span>Menu</span>';
      document.body.appendChild(openBtn);
    }
    if (footer) {
      footer.innerHTML = "";
      footer.hidden = true;
    }
    wireNav(root, pageId);
    initFloatingMenuBehavior();
    syncThemeFromStorage();
    applyThemeParamToLinks(getSavedTheme());
    syncHeaderOffset();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => syncHeaderOffset());
      observer.observe(header);
    }
    window.addEventListener("resize", syncHeaderOffset);
  }

  document.addEventListener("DOMContentLoaded", () => {
    syncThemeFromStorage();
    initSkipLink();
    initSharedChrome();
    initUnitTabs();
    initSectionCarousels();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }
    syncThemeFromStorage();
  });

  // Firefox often restores pages from BFCache; re-sync theme when page becomes active again.
  window.addEventListener("pageshow", () => {
    syncThemeFromStorage();
  });

  window.addEventListener("focus", () => {
    syncThemeFromStorage();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      syncThemeFromStorage();
    }
  });
})();
