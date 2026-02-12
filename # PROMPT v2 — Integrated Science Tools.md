# PROMPT v2 — Integrated Science Tools

**Gold Parity Enforced • Hard Gates • Persistent Audit**

---

# SYSTEM CONTRACT (NON-NEGOTIABLE)

This repo is a static GitHub Pages site: `integrated-science-tools/`.

## Canonical Assets

Global shell:

* `assets/css/site.css`
* `assets/js/theme-init.js`
* `assets/js/site.js`
* `shared/nav.html`
* `shared/footer.html`

Simulator system:

* `assets/css/sims/sim-base.css`
* `assets/js/sim-enhancer.js`
* Per-sim CSS: `assets/css/sims/<slug>.css`

Gold reference sims:

* `unit-1/sims/`
* `unit-2/sims/`
* `unit-3/sims/`

All Unit 1–3 sims define the **chassis standard**.

You must match them structurally and visually.

---

# CHASSIS CONTRACT (GOLD VOCABULARY)

All FULL sims must include:

### Page Shell

* `.sim-wrap`
* `.container`
* `.top-actions` (Back/Home links)
* `<h1>` title
* Optional subtitle/instructions block

### Preset Region (MANDATORY LOCATION)

```
<div class="scenario-presets preset-actions" role="group" aria-label="Preset scenarios">
```

* Contains `.preset-btn`
* One must have `active`
* Reset button must be `class="btn btn-reset"`

This region MUST appear before the first `.workspace`.

### Workspace

* `.workspace`
* ≥ 2 `.panel`
* Each panel contains `.panel-title`

### Control Rows

* `.slider-row`
* `.slider-label`
* `.slider-value`
* `<input type="range">`

### Results

* `.result-cards`
* `.result-card`
* `.status-block`
* `.status-label`
* `.status-badge`

If any of these are missing in a FULL sim → STOP and refactor.

---

# HARD GATES (MUST PASS OR STOP RUN)

For every NEW FULL sim:

1. First occurrence of `preset-actions` appears before first `.workspace`.
2. HTML contains:

   * `.sim-wrap`
   * `.container`
   * `.top-actions`
   * `.workspace`
   * `class="panel`
   * `panel-title`
   * `scenario-presets`
   * `preset-btn`
   * `btn btn-reset`
   * `slider-row`
   * `result-cards`
   * `status-block`
3. No global CSS in per-sim file:

   * No unscoped `body {`
   * No unscoped `.workspace {`
   * No unscoped `.panel {`
4. No:

   * `overflow: hidden` on html/body/page-main/sim-wrap
   * `height: 100vh` or `100dvh` on main containers
5. Uses theme tokens (`var(--*)`) only.

If any fail → block completion.

---

# CSS OWNERSHIP (REPO-CONSISTENT)

Per-sim CSS MAY:

* Define sim-specific `.workspace` grid template
* Adjust layout sizing for model panels
* Apply payload-only styles (SVG, canvas, graphs)

Per-sim CSS MUST NOT:

* Restyle generic controls (`.slider-row`, `.preset-btn`, `.btn`)
* Change chassis typography or spacing system
* Affect other sims (must scope under `body[data-sim-page="<slug>"]`)
* Introduce global layout locks

If a rule applies to 2+ sims → move to `sim-base.css`.

---

# EXISTING SIM PROTECTION

For existing sims:

* Max structural changes: 0
* Do NOT rename classes
* Do NOT move preset/reset region
* Do NOT change DOM order
* Do NOT restyle chassis

If editing:
Report:

* layout_changed: true|false
* controls_moved: true|false
* preset_before_workspace_check: pass|fail

If layout_changed=true without explicit instruction → FAIL.

---

# PERSISTENT STATUS SYSTEM

File: `integrated-science-tools/bulk_sim_status.json`

If file exists:

* Open and treat as authoritative.
* Merge new fields (do NOT overwrite existing keys).
* If `chassis_audit` missing → create and merge.

If file does not exist:

* Create with full schema.

---

# CHASSIS AUDIT SYSTEM

Stored under:

```
bulk_sim_status.json → chassis_audit
```

### Structure

* runs_completed
* last_updated
* gold_source_scope
* scanned_files_last_run
* patterns
* history[]

### Scan Rule

Rescan gold sims only if:

* runs_completed < 3
  OR
* gold source file hash changed
  OR
* chassis_audit.force_rescan == true

Otherwise skip scan.

Never fossilize blindly.

---

# QUALITY GATE

Before building NEW sims:

If any sim:

* quality == "needs_work"
  OR
* quality == "acceptable"
  OR
* last created_full != "gold"

Then:

* MAX_FULL_SIMS = 0
* Only upgrade existing (MAX_UPGRADE_SIMS)

Output must state:

* Was gate triggered?
* Which slugs blocked?

---

# SIM JS ARCHITECTURE

No inline handlers.

Pattern:

```
const el = {}
const state = {}
function compute(){}
function update(){}
listeners
init()
```

All controls route through update().
Clamp inputs.
No console errors.

---

# PLACEHOLDER RULE

Placeholder sims:

* Use full chassis
* No per-sim CSS
* No fake styled sliders
* Structured Objectives / Planned Inputs / Planned Outputs
* Classified as `quality: "placeholder"`

---

# AUDIT CHECKS (OBJECTIVE)

For every sim under unit-1 through unit-6:

Evaluate:

* has_required_shell
* has_data_attrs
* has_h1
* has_workspace_panels
* has_presets
* has_reset
* has_results_layered
* has_model_panel
* has_keyboard_focus
* no_global_overflow_lock
* no_vh_lock
* uses_theme_tokens_only
* does_not_override_generic_controls_in_sim_css

Classify:

* gold
* acceptable
* needs_work
* placeholder

---

# BUILD LIMITS

* MAX_FULL_SIMS = 3
* MAX_UPGRADE_SIMS = 2
* PLACEHOLDERS = true

Never exceed.

---

# EXECUTION ORDER

1. Read/merge bulk_sim_status.json
2. Run chassis audit if required
3. Run full repo audit
4. Apply quality gate
5. Upgrade if needed
6. Build new sims (if allowed)
7. Update indexes + SIM_BADGE_LABELS
8. Write updated bulk_sim_status.json

---

# DELIVERABLES FORMAT

1. Summary
2. Files changed
3. Manual test checklist
4. Audit report
5. Known limitations
6. JSON log summary:

   * created_full
   * upgraded_existing
   * skipped_existing
   * audit_needs_work
   * deferred
7. Chassis audit status:

   * RUN or SKIPPED
   * runs_completed
   * patterns_changed: yes/no
8. Cursor excerpt (next_run_focus + top 3 priority_slugs)

---

# FINAL RULE

Do not invent new UI systems.
Do not approximate gold layout.
Match Unit 1–3 structurally and visually.
If parity fails → refactor before completion.

---
