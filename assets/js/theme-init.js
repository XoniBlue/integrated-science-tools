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

  function getThemeFromWindowName() {
    const raw = typeof window.name === "string" ? window.name : "";
    const parts = raw.split(";").map((entry) => entry.trim()).filter(Boolean);
    const match = parts.find((entry) => entry.startsWith(`${WINDOW_NAME_KEY}=`));
    if (!match) {
      return null;
    }
    const value = match.slice(`${WINDOW_NAME_KEY}=`.length);
    return value === "ocean" || value === "purple" ? value : null;
  }

  function getThemeFromStorage() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved === "ocean" || saved === "purple" ? saved : null;
    } catch (_error) {
      return null;
    }
  }

  function applyTheme(theme) {
    if (theme === "ocean") {
      document.documentElement.setAttribute("data-theme", "ocean");
      return;
    }
    document.documentElement.removeAttribute("data-theme");
  }

  try {
    // Query param fallback makes theme portable even when Firefox isolates file:// storage.
    const theme = getThemeFromQuery() || getThemeFromWindowName() || getThemeFromStorage() || "purple";
    applyTheme(theme);
    if (theme === "ocean" || theme === "purple") {
      try {
        localStorage.setItem(STORAGE_KEY, theme);
      } catch (_error) {
        // Ignore storage failures.
      }
    }
  } catch (_error) {
    document.documentElement.removeAttribute("data-theme");
  }
})();
