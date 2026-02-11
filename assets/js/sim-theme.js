(function () {
  const STORAGE_KEY = "ist-theme";
  const WINDOW_NAME_KEY = "ist-theme";
  const QUERY_KEY = "istTheme";

  function getThemeFromQuery() {
    try {
      const params = new URLSearchParams(window.location.search);
      const value = params.get(QUERY_KEY);
      return value === "ocean" || value === "purple" ? value : null;
    } catch (_error) {
      return null;
    }
  }

  function setThemeQueryParam(theme) {
    const safeTheme = theme === "ocean" ? "ocean" : "purple";
    try {
      const url = new URL(window.location.href);
      url.searchParams.set(QUERY_KEY, safeTheme);
      if (history.replaceState) {
        history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
      }
    } catch (_error) {
      // Ignore URL failures.
    }
  }

  function getThemeFromWindowName() {
    const raw = typeof window.name === "string" ? window.name : "";
    const entries = raw.split(";").map((entry) => entry.trim()).filter(Boolean);
    const pair = entries.find((entry) => entry.startsWith(`${WINDOW_NAME_KEY}=`));
    if (!pair) {
      return null;
    }
    const value = pair.slice(`${WINDOW_NAME_KEY}=`.length);
    return value === "ocean" || value === "purple" ? value : null;
  }

  function setThemeInWindowName(theme) {
    const safeTheme = theme === "ocean" ? "ocean" : "purple";
    const raw = typeof window.name === "string" ? window.name : "";
    const entries = raw.split(";").map((entry) => entry.trim()).filter(Boolean);
    const filtered = entries.filter((entry) => !entry.startsWith(`${WINDOW_NAME_KEY}=`));
    filtered.push(`${WINDOW_NAME_KEY}=${safeTheme}`);
    window.name = filtered.join(";");
  }

  function currentTheme() {
    const queryTheme = getThemeFromQuery();
    if (queryTheme) {
      return queryTheme;
    }
    const windowTheme = getThemeFromWindowName();
    if (windowTheme) {
      return windowTheme;
    }
    return document.documentElement.getAttribute("data-theme") === "ocean" ? "ocean" : "purple";
  }

  function applyTheme(theme) {
    if (theme === "ocean") {
      document.documentElement.setAttribute("data-theme", "ocean");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    window.dispatchEvent(new CustomEvent("ist-theme-change", { detail: { theme } }));
  }

  function setTheme(theme) {
    const safeTheme = theme === "ocean" ? "ocean" : "purple";
    setThemeInWindowName(safeTheme);
    setThemeQueryParam(safeTheme);
    try {
      localStorage.setItem(STORAGE_KEY, safeTheme);
    } catch (_error) {
      // Ignore storage failures (Firefox/file contexts).
    }
    applyTheme(safeTheme);
    return safeTheme;
  }

  function updateToggleLabel(button, theme) {
    const nextTheme = theme === "ocean" ? "purple" : "ocean";
    button.textContent = "◐";
    button.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
    button.setAttribute("title", `Switch to ${nextTheme} theme`);
  }

  document.addEventListener("DOMContentLoaded", function () {
    const button = document.querySelector("[data-theme-toggle]");
    if (!button) {
      return;
    }

    let activeTheme = currentTheme();
    updateToggleLabel(button, activeTheme);

    button.addEventListener("click", function () {
      activeTheme = setTheme(activeTheme === "purple" ? "ocean" : "purple");
      updateToggleLabel(button, activeTheme);
    });

    function syncFromStorage() {
      const windowTheme = getThemeFromWindowName();
      if (windowTheme) {
        activeTheme = windowTheme;
      } else {
        try {
          activeTheme = localStorage.getItem(STORAGE_KEY) === "ocean" ? "ocean" : "purple";
        } catch (_error) {
          activeTheme = "purple";
        }
      }
      applyTheme(activeTheme);
      setThemeInWindowName(activeTheme);
      setThemeQueryParam(activeTheme);
      updateToggleLabel(button, activeTheme);
    }

    window.addEventListener("storage", function (event) {
      if (event.key !== STORAGE_KEY) {
        return;
      }
      syncFromStorage();
    });

    window.addEventListener("pageshow", syncFromStorage);
    window.addEventListener("focus", syncFromStorage);
    document.addEventListener("visibilitychange", function () {
      if (document.visibilityState === "visible") {
        syncFromStorage();
      }
    });
  });
})();
