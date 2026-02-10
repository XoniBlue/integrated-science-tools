(function () {
  const STORAGE_KEY = "ist-theme";

  function currentTheme() {
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
    localStorage.setItem(STORAGE_KEY, safeTheme);
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

    window.addEventListener("storage", function (event) {
      if (event.key !== STORAGE_KEY) {
        return;
      }
      activeTheme = event.newValue === "ocean" ? "ocean" : "purple";
      applyTheme(activeTheme);
      updateToggleLabel(button, activeTheme);
    });
  });
})();
