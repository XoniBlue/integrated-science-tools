(function () {
  const STORAGE_KEY = "ist-theme";
  const THEMES = ["purple", "ocean"];

  const fallbackNav = `
<div class="site-header-shell">
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
    <span class="nav-badge" aria-live="polite">Now: Home</span>
    <button class="theme-toggle" type="button" aria-label="Switch color theme" title="Switch color theme">◐</button>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-menu" aria-label="Toggle navigation">
      <span></span><span></span><span></span>
    </button>
    <nav id="primary-menu" class="site-nav" aria-label="Primary">
      <a data-link="index.html" data-page-link="home">Home</a>
      <a data-link="unit-1/index.html" data-page-link="unit-1" title="Unit 1: Chemical Bonds and Fundamental Forces" aria-label="Unit 1: Chemical Bonds and Fundamental Forces">Unit 1</a>
      <a data-link="unit-2/index.html" data-page-link="unit-2" title="Unit 2: Molecules and Engineering Solutions" aria-label="Unit 2: Molecules and Engineering Solutions">Unit 2</a>
      <a data-link="unit-3/index.html" data-page-link="unit-3" title="Unit 3: Energy and Orbital Motion" aria-label="Unit 3: Energy and Orbital Motion">Unit 3</a>
      <a data-link="unit-4/index.html" data-page-link="unit-4" title="Unit 4: Fields, Forces, and the Universe’s Origin" aria-label="Unit 4: Fields, Forces, and the Universe’s Origin">Unit 4</a>
      <a data-link="unit-5/index.html" data-page-link="unit-5" title="Unit 5: Apply the Laws of Motion" aria-label="Unit 5: Apply the Laws of Motion">Unit 5</a>
      <a data-link="unit-6/index.html" data-page-link="unit-6" title="Unit 6: Momentum, Mechanics, and Engineering Solutions" aria-label="Unit 6: Momentum, Mechanics, and Engineering Solutions">Unit 6</a>
    </nav>
  </div>
</div>`;

  const fallbackFooter = `
<div class="site-footer-shell">
  <p class="footer-meta">Integrated Science Tools</p>
  <p class="footer-credit">Made by Xoni for Ms. H with ❤️</p>
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
</div>`;

  function resolveHref(root, path) {
    const trimmed = (root || ".").replace(/\/$/, "");
    return trimmed === "." ? `./${path}` : `${trimmed}/${path}`;
  }

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return THEMES.includes(saved) ? saved : "purple";
  }

  function applyTheme(theme) {
    if (theme === "ocean") {
      document.documentElement.setAttribute("data-theme", "ocean");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }

  function setTheme(theme) {
    const value = THEMES.includes(theme) ? theme : "purple";
    applyTheme(value);
    localStorage.setItem(STORAGE_KEY, value);
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      const nextTheme = value === "purple" ? "ocean" : "purple";
      toggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
      toggle.setAttribute("title", `Switch to ${nextTheme} theme`);
    }
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
    if (badge && activeLink) {
      badge.textContent = `Now: ${activeLink.textContent.trim()}`;
    }

    const button = document.querySelector(".nav-toggle");
    const nav = document.getElementById("primary-menu");
    if (!button || !nav) {
      return;
    }

    const closeNav = () => {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      button.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        closeNav();
      });
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("open")) {
        return;
      }
      if (!nav.contains(event.target) && !button.contains(event.target)) {
        closeNav();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeNav();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) {
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

      function activate(targetId, updateHash = false) {
        if (!panelIds.has(targetId)) {
          return;
        }

        buttons.forEach((button) => {
          const active = button.getAttribute("aria-controls") === targetId;
          button.setAttribute("aria-selected", active ? "true" : "false");
          button.tabIndex = active ? 0 : -1;
        });

        panels.forEach((panel) => {
          panel.hidden = panel.id !== targetId;
        });

        if (updateHash && history.replaceState) {
          history.replaceState(null, "", `#${targetId}`);
        }
      }

      const hashTarget = window.location.hash.replace(/^#/, "");
      const selected = buttons.find((button) => button.getAttribute("aria-selected") === "true");
      const defaultTarget = (selected || buttons[0]).getAttribute("aria-controls");
      activate(panelIds.has(hashTarget) ? hashTarget : defaultTarget);

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

  function syncHeaderOffset() {
    const header = document.getElementById("site-header");
    if (!header) {
      return;
    }
    const offset = Math.ceil(header.getBoundingClientRect().height + 16);
    document.documentElement.style.setProperty("--site-header-offset", `${offset}px`);
  }

  async function initSharedChrome() {
    const root = document.body.dataset.siteRoot || ".";
    const pageId = document.body.dataset.page || "";
    const header = document.getElementById("site-header");
    const footer = document.getElementById("site-footer");

    if (!header || !footer) {
      return;
    }

    const navPath = resolveHref(root, "shared/nav.html");
    const footerPath = resolveHref(root, "shared/footer.html");

    const [navHtml, footerHtml] = await Promise.all([
      loadPartial(navPath, fallbackNav),
      loadPartial(footerPath, fallbackFooter),
    ]);

    header.innerHTML = navHtml;
    footer.innerHTML = footerHtml;
    wireNav(root, pageId);
    setTheme(getSavedTheme());
    syncHeaderOffset();
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(() => syncHeaderOffset());
      observer.observe(header);
    }
    window.addEventListener("resize", syncHeaderOffset);
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(getSavedTheme());
    initSkipLink();
    initSharedChrome();
    initUnitTabs();
  });
})();
