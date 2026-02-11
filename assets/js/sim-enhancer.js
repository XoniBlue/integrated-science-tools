(function () {
  function createEl(tag, className, textContent) {
    const node = document.createElement(tag);
    if (className) {
      node.className = className;
    }
    if (typeof textContent === "string") {
      node.textContent = textContent;
    }
    return node;
  }

  function buildInstructionsPanel(container) {
    const existing = container.querySelector(".instructions");
    if (existing) {
      return existing;
    }

    const legacyInstruction = container.querySelector(".instruction");
    const stepGuideBox = Array.from(container.querySelectorAll(".info-box")).find(function (box) {
      const label = box.querySelector(".info-label");
      return !!(label && /step-by-step guide/i.test(label.textContent));
    });

    if (!legacyInstruction && !stepGuideBox) {
      return null;
    }

    const panel = createEl("section", "instructions");
    panel.setAttribute("aria-label", "Instructions");
    panel.appendChild(createEl("h2", "", "How To Use"));

    if (legacyInstruction) {
      const body = createEl("div", "sim-instructions-body");
      body.innerHTML = legacyInstruction.innerHTML.replace(/^\s*<strong>\s*Instructions:\s*<\/strong>\s*<br>/i, "");
      panel.appendChild(body);
      legacyInstruction.remove();
    }

    if (stepGuideBox) {
      const stepWrap = createEl("div", "sim-step-guide");
      const label = stepGuideBox.querySelector(".info-label");
      stepWrap.appendChild(createEl("p", "sim-step-title", label ? label.textContent.replace(/:\s*$/, "") : "Step-by-Step Guide"));
      const list = stepGuideBox.querySelector("ol, ul");
      if (list) {
        stepWrap.appendChild(list.cloneNode(true));
      }
      panel.appendChild(stepWrap);
      stepGuideBox.remove();
    }

    const subtitle = container.querySelector(".subtitle");
    if (subtitle && subtitle.parentElement === container) {
      subtitle.insertAdjacentElement("afterend", panel);
    } else {
      container.insertBefore(panel, container.firstChild);
    }

    return panel;
  }

  function promoteHeaderIntoTopActions(container) {
    const topActions = container.querySelector(".top-actions");
    const heading = container.querySelector("h1");
    const subtitle = container.querySelector(".subtitle");
    if (!topActions || !heading || topActions.querySelector(".sim-title-inline")) {
      return;
    }

    const titleWrap = createEl("div", "sim-title-inline");
    titleWrap.appendChild(heading);
    if (subtitle) {
      titleWrap.appendChild(subtitle);
    }

    const actionLinks = Array.from(topActions.querySelectorAll("a, button"));
    if (actionLinks.length >= 2) {
      topActions.insertBefore(titleWrap, actionLinks[1]);
    } else {
      topActions.appendChild(titleWrap);
    }
  }

  function bindHelpPopover(helpWrap, toggleButton, instructionsPanel) {
    let closeTimer = null;

    function setOpen(isOpen) {
      toggleButton.setAttribute("aria-expanded", String(isOpen));
      instructionsPanel.hidden = !isOpen;
    }

    function cancelClose() {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
    }

    function scheduleClose() {
      cancelClose();
      closeTimer = window.setTimeout(function () {
        setOpen(false);
      }, 140);
    }

    toggleButton.addEventListener("click", function () {
      const isOpen = toggleButton.getAttribute("aria-expanded") === "true";
      setOpen(!isOpen);
    });

    toggleButton.addEventListener("mouseenter", function () {
      cancelClose();
      setOpen(true);
    });

    helpWrap.addEventListener("mouseenter", function () {
      cancelClose();
      setOpen(true);
    });

    helpWrap.addEventListener("mouseleave", function () {
      scheduleClose();
    });

    toggleButton.addEventListener("focus", function () {
      cancelClose();
      setOpen(true);
    });

    document.addEventListener("click", function (event) {
      if (instructionsPanel.hidden) {
        return;
      }
      if (helpWrap.contains(event.target)) {
        return;
      }
      setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    });

    const closeButton = instructionsPanel.querySelector(".help-close");
    if (closeButton) {
      closeButton.addEventListener("click", function () {
        setOpen(false);
      });
    }

    setOpen(false);
  }

  function moveLegendsIntoHelp(container, instructionsPanel) {
    const legendNodes = Array.from(container.querySelectorAll(".viz-legend, .curve-legend"));
    if (legendNodes.length === 0) {
      return;
    }

    const legendWrap = createEl("div", "help-legends");
    legendNodes.forEach(function (legendNode) {
      const text = legendNode.textContent.trim();
      if (text.length === 0) {
        return;
      }
      const entry = createEl("p", "help-legend", text);
      legendWrap.appendChild(entry);
      legendNode.remove();
    });

    if (legendWrap.childElementCount > 0) {
      instructionsPanel.appendChild(legendWrap);
    }
  }

  function enhanceHelpUI(container) {
    if (!container || container.querySelector(".sim-help")) {
      return;
    }

    const instructionsPanel = buildInstructionsPanel(container);
    if (!instructionsPanel) {
      return;
    }

    if (!instructionsPanel.id) {
      instructionsPanel.id = "sim-instructions";
    }

    const helpWrap = createEl("div", "sim-help");
    const helpButton = createEl("button", "help-toggle", "i");
    helpButton.type = "button";
    helpButton.id = "help-toggle";
    helpButton.setAttribute("aria-expanded", "false");
    helpButton.setAttribute("aria-controls", instructionsPanel.id);
    helpButton.setAttribute("title", "How to use this simulator");

    instructionsPanel.classList.add("sim-help-panel");
    instructionsPanel.hidden = true;

    let closeButton = instructionsPanel.querySelector(".help-close");
    if (!closeButton) {
      closeButton = createEl("button", "help-close", "Close");
      closeButton.type = "button";
      closeButton.setAttribute("aria-label", "Close instructions");
      instructionsPanel.appendChild(closeButton);
    }

    moveLegendsIntoHelp(container, instructionsPanel);

    helpWrap.appendChild(helpButton);
    helpWrap.appendChild(instructionsPanel);

    const actionsRow = container.querySelector(".preset-actions, .reaction-presets, .equation-selector, .molecule-selector");
    const controlsWrap = actionsRow ? actionsRow.closest(".controls") : null;
    const controlsAsTopRow = !!(controlsWrap && controlsWrap.parentElement === container);
    const insertionPoint = controlsAsTopRow ? controlsWrap : ((actionsRow && actionsRow.parentElement === container) ? actionsRow : instructionsPanel);
    const nextSibling = insertionPoint.nextSibling;

    if (actionsRow) {
      const toolbar = createEl("div", "sim-toolbar");
      actionsRow.classList.add("sim-toolbar-actions");
      toolbar.appendChild(actionsRow);
      toolbar.appendChild(helpWrap);

      if (controlsAsTopRow) {
        controlsWrap.remove();
      }

      if (nextSibling) {
        container.insertBefore(toolbar, nextSibling);
      } else {
        container.appendChild(toolbar);
      }
    } else {
      const toolbar = createEl("div", "sim-toolbar");
      toolbar.classList.add("sim-toolbar-help-only");
      toolbar.appendChild(helpWrap);
      if (nextSibling) {
        container.insertBefore(toolbar, nextSibling);
      } else {
        container.appendChild(toolbar);
      }
    }

    bindHelpPopover(helpWrap, helpButton, instructionsPanel);
  }

  function enableViewportFit(container) {
    const body = document.body;
    if (!body || body.dataset.simPage === "orbital-motion") {
      return;
    }

    if (!container.querySelector(".panel, .workspace, .grid")) {
      return;
    }

    const MIN_FIT_WIDTH = 1280;
    const MIN_READABLE_SCALE = 0.9;

    function resetFitState() {
      body.classList.remove("sim-viewport-fit");
      container.style.height = "";
      container.style.overflow = "";
      const fitRoot = container.querySelector(":scope > .sim-fit-root");
      if (fitRoot) {
        fitRoot.style.transform = "";
        fitRoot.style.width = "";
      }
    }

    function ensureFitRoot() {
      let fitRoot = container.querySelector(":scope > .sim-fit-root");
      if (fitRoot) {
        return fitRoot;
      }

      fitRoot = createEl("div", "sim-fit-root");
      const children = Array.from(container.children);
      children.forEach(function (child) {
        if (child.classList.contains("top-actions")) {
          return;
        }
        fitRoot.appendChild(child);
      });
      container.appendChild(fitRoot);
      return fitRoot;
    }

    function applyFitScale(targetHeight) {
      const fitRoot = ensureFitRoot();
      const topActions = container.querySelector(":scope > .top-actions");
      if (!fitRoot || !topActions) {
        return true;
      }

      fitRoot.style.transform = "none";
      fitRoot.style.transformOrigin = "top center";
      fitRoot.style.width = "100%";

      const cs = window.getComputedStyle(container);
      const padTop = parseFloat(cs.paddingTop) || 0;
      const padBottom = parseFloat(cs.paddingBottom) || 0;
      const padLeft = parseFloat(cs.paddingLeft) || 0;
      const padRight = parseFloat(cs.paddingRight) || 0;
      const staticHeight = topActions.offsetHeight + padTop + padBottom;
      const available = Math.max(120, targetHeight - staticHeight - 4);
      const availableWidth = Math.max(200, container.clientWidth - padLeft - padRight - 4);
      const naturalHeight = Math.max(1, fitRoot.scrollHeight);
      const naturalWidth = Math.max(1, fitRoot.scrollWidth);
      const scaleY = available / naturalHeight;
      const scaleX = availableWidth / naturalWidth;
      const scale = Math.min(1, scaleY, scaleX);

      if (scale < MIN_READABLE_SCALE) {
        fitRoot.style.transform = "";
        fitRoot.style.width = "";
        return false;
      }

      if (scale < 0.999) {
        fitRoot.style.transform = "scale(" + scale.toFixed(4) + ")";
        fitRoot.style.width = "100%";
      }

      return true;
    }

    function updateLayoutHeight() {
      if (window.innerWidth < MIN_FIT_WIDTH) {
        resetFitState();
        return;
      }

      const sidebarShell = document.querySelector(".site-header-shell");
      if (!sidebarShell) {
        return;
      }

      body.classList.add("sim-viewport-fit");
      const bounds = sidebarShell.getBoundingClientRect();
      body.style.setProperty("--sim-target-top", String(Math.round(bounds.top)) + "px");
      const targetHeight = Math.round(bounds.height);
      body.style.setProperty("--sim-target-height", String(targetHeight) + "px");
      container.style.height = String(targetHeight) + "px";
      container.style.overflow = "hidden";
      if (!applyFitScale(targetHeight)) {
        resetFitState();
      }
    }

    window.addEventListener("resize", updateLayoutHeight);

    let attempts = 0;
    const intervalId = window.setInterval(function () {
      updateLayoutHeight();
      attempts += 1;
      if (document.querySelector(".site-header-shell") || attempts > 14) {
        window.clearInterval(intervalId);
      }
    }, 120);

    updateLayoutHeight();
  }

  function initSimEnhancer() {
    const container = document.querySelector(".sim-wrap > .container");
    if (!container) {
      return;
    }

    promoteHeaderIntoTopActions(container);
    enhanceHelpUI(container);
    enableViewportFit(container);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSimEnhancer);
  } else {
    initSimEnhancer();
  }
})();
