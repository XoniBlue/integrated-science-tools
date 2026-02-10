(function () {
  try {
    const saved = localStorage.getItem("ist-theme");
    if (saved === "ocean") {
      document.documentElement.setAttribute("data-theme", "ocean");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  } catch (_error) {
    document.documentElement.removeAttribute("data-theme");
  }
})();
