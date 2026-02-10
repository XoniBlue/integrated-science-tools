(function () {
  const fileTypeIcons = {
    pdf: "PDF",
    ppt: "PPT",
    pptx: "PPT",
    html: "SIM",
    doc: "DOC",
    docx: "DOC",
    xls: "XLS",
    xlsx: "XLS",
    jpg: "IMG",
    jpeg: "IMG",
    png: "IMG",
    mp4: "VID",
    default: "FILE",
  };
  const DOWNLOADABLE_EXTENSIONS = new Set(["pdf", "ppt", "pptx"]);

  const manifest = {
    chemistry: {
      "unit-1": ["lewis-dot.html"],
    },
    "earth-sciences": {},
    physics: {},
  };
  const githubFileCache = new Map();

  function getFileExtension(filename) {
    const parts = String(filename).split(".");
    return parts.length > 1 ? parts.pop().toLowerCase() : "";
  }

  function formatLabel(filename) {
    return filename
      .replace(/\.[^.]+$/, "")
      .replace(/[-_]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function toTitleCase(text) {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  function parseContainerId(id) {
    const match = String(id).match(/^(chemistry|earth-sciences|physics)-unit-(\d+)-resources$/);
    if (!match) {
      return null;
    }
    return {
      subject: match[1],
      unit: `unit-${match[2]}`,
      folder: `sims/${match[1]}/unit-${match[2]}`,
    };
  }

  function getGitHubRepoContext() {
    const host = window.location.hostname || "";
    const pathParts = window.location.pathname.split("/").filter(Boolean);
    if (!host.endsWith(".github.io") || pathParts.length < 1) {
      return null;
    }
    const owner = host.split(".")[0];
    const repo = pathParts[0];
    if (!owner || !repo) {
      return null;
    }
    return { owner, repo };
  }

  async function fetchGitHubFolderFiles(folder) {
    if (githubFileCache.has(folder)) {
      return githubFileCache.get(folder);
    }

    const repoContext = getGitHubRepoContext();
    if (!repoContext) {
      githubFileCache.set(folder, []);
      return [];
    }

    const url = `https://api.github.com/repos/${repoContext.owner}/${repoContext.repo}/contents/${folder}`;
    try {
      const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
      if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.status}`);
      }
      const payload = await response.json();
      const files = Array.isArray(payload)
        ? payload.filter((item) => item && item.type === "file").map((item) => item.name)
        : [];
      githubFileCache.set(folder, files);
      return files;
    } catch (_error) {
      githubFileCache.set(folder, []);
      return [];
    }
  }

  function buildRow(folder, file) {
    const ext = getFileExtension(file);
    const icon = fileTypeIcons[ext] || fileTypeIcons.default;
    const href = `${folder}/${file}`;
    const li = document.createElement("li");

    li.innerHTML = `
      <span class="file-icon" aria-hidden="true">${icon}</span>
      <span class="file-name">${toTitleCase(formatLabel(file))}</span>
      <a class="button-link button-subtle" href="${href}" target="_blank" rel="noopener noreferrer">Open</a>
      <a class="button-link" href="${href}" target="_blank" rel="noopener noreferrer" download>Download</a>
    `;
    return li;
  }

  function renderResourceList(container, files, folder) {
    const visibleFiles = files.filter((file) => {
      const name = String(file).toLowerCase();
      if (name.startsWith("readme")) {
        return false;
      }
      return DOWNLOADABLE_EXTENSIONS.has(getFileExtension(name));
    });
    const heading = container.querySelector("h4");
    container.innerHTML = "";
    if (heading) {
      container.appendChild(heading);
    }
    if (!visibleFiles.length) {
      const empty = document.createElement("p");
      empty.className = "resource-list-empty";
      empty.textContent = "No PDF or PowerPoint resources available yet for this unit.";
      container.appendChild(empty);
      return;
    }

    const list = document.createElement("ul");
    list.className = "resource-list";

    visibleFiles.forEach((file) => {
      list.appendChild(buildRow(folder, file));
    });

    if (visibleFiles.length > 4) {
      const search = document.createElement("input");
      search.className = "resource-search";
      search.type = "search";
      search.placeholder = "Filter resources...";
      search.setAttribute("aria-label", "Filter resources");
      search.addEventListener("input", () => {
        const term = search.value.trim().toLowerCase();
        list.querySelectorAll("li").forEach((row) => {
          const name = row.querySelector(".file-name")?.textContent?.toLowerCase() || "";
          row.hidden = !name.includes(term);
        });
      });
      container.appendChild(search);
    }

    container.appendChild(list);
  }

  async function initResourceLists() {
    const containers = document.querySelectorAll(".resource-list-container[id]");
    const tasks = Array.from(containers).map(async (container) => {
      const parsed = parseContainerId(container.id);
      if (!parsed) {
        return;
      }

      const remoteFiles = await fetchGitHubFolderFiles(parsed.folder);
      const files = remoteFiles.length ? remoteFiles : (manifest[parsed.subject]?.[parsed.unit] || []);
      renderResourceList(container, files, parsed.folder);
    });
    await Promise.all(tasks);
  }

  document.addEventListener("DOMContentLoaded", initResourceLists);
})();
