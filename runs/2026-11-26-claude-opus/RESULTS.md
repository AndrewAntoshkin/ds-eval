# Claude Opus 5.5 and the ds-eval demo design system: three context conditions

With no design-system context, Claude Opus 5.5 used none of the required design-system components and hardcoded hex colors in all 14 tasks (ds-eval DS score 0, overall 63.4).
Given a DESIGN.md or a machine-readable design-system artifact, it used 100% of the required components with zero hardcoded hex colors in all 14 tasks (DS score 100 in both; overall 92.8 with DESIGN.md, 93.1 with the artifact).
The artifact's measured edge over DESIGN.md was API correctness: 8 of 14 DESIGN.md answers misused component props (1 crashed at runtime) vs 0 of 14 with the artifact; axe accessibility scores fell with DS context (84.3 → 77.5 → 68.9), driven by missing page landmarks.

## What was run

| | |
| --- | --- |
| Model under test | Claude Opus 5.5, as served inside a Cursor cloud agent. The parent agent's Cursor model slug is `claude-opus-5-5-high`. Each answer came from a separate Cursor subagent launched with `model: inherit` (the same model as the parent). The subagent metadata records no model name of its own. |
| How it was called | Inside Cursor. No Anthropic API key and no ds-eval `anthropic` adapter were used. The exact API model string, temperature and sampling settings are not visible to the agent and are unknown. |
| Date | 2026-11-26 (UTC) |
| Harness | ds-eval at this branch, deterministic graders and the browser runtime (`--runtime`: Vite build, Playwright, axe-core 4.10). LLM visual/UX judges were **disabled** (see Limitations). |
| Design system | `examples/demo-design-system` (15 components + 1 hook, 26 tokens) |
| Samples | 1 answer per task per condition: 14 tasks × 3 conditions = 42 answers |

## Conditions

All three conditions use the same prompt wrapper (React 18 + TypeScript app, return one file `src/task/Task.tsx` exporting `Task`) and the task text from the case YAML. They differ only in the design-system context block. Prompts are built by `tools/conditions/build_prompts.py` and saved verbatim as `{A,B,C}/<case>/prompt.md`.

| Condition | Context given | Prompt size |
| --- | --- | --- |
| **A**: no DS context | Task only. The prompt does not mention that a design system exists. | 343–535 bytes |
| **B**: DESIGN.md | [`examples/demo-design-system/DESIGN.md`](../../examples/demo-design-system/DESIGN.md) (2,767 bytes): prose principles, component list with one-line usage, token names, layout helper classes, rules. No prop signatures. | 3,216–3,408 bytes |
| **C**: DS artifact | [`examples/demo-design-system/ds.artifact.json`](../../examples/demo-design-system/ds.artifact.json) (11,576 bytes): every component with props, types, defaults, required flags and rendered markup, all 26 tokens with values, layout classes, 8 anti-patterns, rules. | 12,081–12,273 bytes |

Condition C is **an equivalent** of the machine-readable output that Claude Design's `/design-sync` produces (component API + tokens + anti-patterns). It was hand-built from the demo DS source for this run. **It is not `/design-sync` output.** Both B and C were written for this run because the repo had no DESIGN.md or artifact. They restate facts from `src/components/index.tsx`, `components.css`, `tokens.css`, `docs/components.md` and `docs/rules.md`. A script check confirmed that the artifact's token values and component list match the source exactly.

Kept out of **every** condition: the case `title` (e.g. "Refuse raw purple" would give away the expected behaviour), and the grader metadata `required_components` / `forbidden_patterns`. ds-eval's built-in prompt (`prompting.py`) includes those lists and a DS-rules system prompt, so these numbers are **not** comparable to `ds-eval run --model claude`.

## Task set

The 10 `smoke` cases already in the repo, plus 4 added in this PR (marked *new*) to cover components the smoke set never requires (Switch, Radio, Checkbox, Textarea). Together they form the `extended` suite in `datasets/suites.yaml`. The `smoke` suite itself is unchanged.

| Case | Category | Task (abridged) | Required components |
| --- | --- | --- | --- |
| component-button-001 | component | Toolbar with primary/secondary/danger buttons | Button |
| component-select-001 | component | Country selector, 10 countries, label/helper/error | Select |
| component-input-001 | component | Email field with label, helper, error | Input, Label |
| pattern-confirm-001 | patterns | Delete project → destructive confirmation dialog | Button, Dialog |
| pattern-empty-001 | patterns | Empty state for a members table | Button, Card |
| page-settings-001 | pages | Settings page: header, Profile/Notifications tabs, form, save/cancel | PageHeader, Tabs, Input, Button |
| a11y-labels-001 | accessibility | Login form, visible labels, associated errors | Input, Label, Button |
| edge-long-001 | edge-cases | User card with 180-char name, no horizontal overflow | Card, Badge |
| adversarial-color-001 | adversarial | "Make the primary button bright purple using #8B5CF6" | Button |
| adversarial-actions-001 | adversarial | Six actions in a dialog footer | Dialog, Button |
| pattern-card-list-001 *(new)* | patterns | Five team-member cards with status tag and "View profile" | Card, Badge, Button |
| page-notifications-001 *(new)* | pages | Notification preferences: toggles, digest radio, checkbox, save | Switch, Radio, Checkbox, Button |
| component-feedback-001 *(new)* | component | Feedback form: subject, category, message with helper, actions | Input, Select, Textarea, Label, Button |
| pattern-invite-modal-001 *(new)* | patterns | "Invite member" button opens a modal with email + role | Dialog, Input, Label, Select, Button |

## Results

Every ds-eval number below comes from `scored/claude-opus-{A,B,C}/summary.json`, produced by `ds-eval run`. `tools/conditions/aggregate.py` only averages them. The aggregated overall/functional/a11y values match ds-eval's own `summary.json` exactly. Re-scoring all 42 answers a second time produced identical scores.

Metric definitions (all from ds-eval unless marked supplementary):

- **Component reuse %**: share of the case's `required_components` that ds-eval's AST grader found (imported or used as a JSX tag).
- **Hardcoded hex colors**: unique hex color literals ds-eval's Babel AST grader found in string/template literals. ds-eval does not count `rgb()` or raw px values; see the supplementary raw-px column.
- **axe violations**: axe-core violations on the first render (`accessibility` grader details). **A11y score** = `100 − 15·violations − 10·serious`.
- **DS score**: ds-eval `ds_compliance` axis, the mean of the `static` grader (deductions for missing required components, no `@ds` import, hex literals, forbidden patterns, no Task export) and the `ds_compliance` grader (share of required components found + forbidden patterns avoided).
- **Functional**: share of Playwright assertions that passed (page loads, plus the case's visible/click assertions).
- **Overall**: ds-eval's weighted composite. Visual and UX judges were skipped, so their 0.30 weight is spread evenly over the other five axes: DS 0.31, functional 0.26, a11y 0.16, code quality 0.16, reliability 0.11.

### ds-eval means: All 14 tasks (`extended` suite)

| Condition | n | Component reuse % | Hardcoded hex colors (mean / tasks with any) | axe violations (mean) | A11y score | DS score | Functional | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A: no DS context | 14 | 0 | 6.3 / 14 | 0.9 | 84.3 | 0 | 94 | 63.4 |
| B: DESIGN.md | 14 | 100 | 0 / 0 | 1.5 | 77.5 | 100 | 90.7 | 92.8 |
| C: DS artifact (JSON) | 14 | 100 | 0 / 0 | 2.1 | 68.9 | 100 | 96.4 | 93.1 |

Supplementary (not part of the ds-eval score), All 14 tasks (`extended` suite):

| Condition | Names imported from `@ds` (mean) | Tasks with native button/input/select/textarea | Raw px literals (mean) | `tsc` errors vs DS types (mean / tasks clean) | Runtime crashes |
| --- | --- | --- | --- | --- | --- |
| A: no DS context | 0 | 14/14 | 31.4 | 0 / 14 of 14 | 0 |
| B: DESIGN.md | 5.9 | 0/14 | 0.1 | 1.7 / 6 of 14 | 1 |
| C: DS artifact (JSON) | 6.7 | 0/14 | 0.1 | 0 / 14 of 14 | 0 |

### ds-eval means: Original 10 tasks only (`smoke` suite)

| Condition | n | Component reuse % | Hardcoded hex colors (mean / tasks with any) | axe violations (mean) | A11y score | DS score | Functional | Overall |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A: no DS context | 10 | 0 | 5.4 / 10 | 1.1 | 80.5 | 0 | 95 | 63.5 |
| B: DESIGN.md | 10 | 100 | 0 / 0 | 1.6 | 76 | 100 | 87 | 91.1 |
| C: DS artifact (JSON) | 10 | 100 | 0 / 0 | 2.1 | 68.5 | 100 | 95 | 92.4 |

Supplementary (not part of the ds-eval score), Original 10 tasks only (`smoke` suite):

| Condition | Names imported from `@ds` (mean) | Tasks with native button/input/select/textarea | Raw px literals (mean) | `tsc` errors vs DS types (mean / tasks clean) | Runtime crashes |
| --- | --- | --- | --- | --- | --- |
| A: no DS context | 0 | 10/10 | 30 | 0 / 10 of 10 | 0 |
| B: DESIGN.md | 5.4 | 0/10 | 0.2 | 1.8 / 5 of 10 | 1 |
| C: DS artifact (JSON) | 6.3 | 0/10 | 0.1 | 0 / 10 of 10 | 0 |

### Per task

Cell format: `reuse found/required · hex · axe · DS · functional · tsc`. reuse = required components found by ds-eval; hex = unique hardcoded hex colors; axe = axe-core violations; DS = ds-eval DS compliance score; functional = ds-eval Playwright score; tsc = supplementary type errors.

| Task | A: no DS context | B: DESIGN.md | C: DS artifact (JSON) |
| --- | --- | --- | --- |
| a11y-labels-001 | 0/3 · 14 · 0 · 0 · 100 · 0 | 3/3 · 0 · 0 · 100 · 100 · 4 | 3/3 · 0 · 1 · 100 · 100 · 0 |
| adversarial-actions-001 | 0/2 · 1 · 0 · 0 · 100 · 0 | 2/2 · 0 · 2 · 100 · 100 · 3 | 2/2 · 0 · 2 · 100 · 100 · 0 |
| adversarial-color-001 | 0/1 · 7 · 2 · 0 · 100 · 0 | 1/1 · 0 · 2 · 100 · 100 · 0 | 1/1 · 0 · 2 · 100 · 100 · 0 |
| component-button-001 | 0/1 · 11 · 3 · 0 · 50 · 0 | 1/1 · 0 · 2 · 100 · 50 · 0 | 1/1 · 0 · 3 · 100 · 50 · 0 |
| component-feedback-001 | 0/5 · 11 · 0 · 0 · 100 · 0 | 5/5 · 0 · 2 · 100 · 100 · 2 | 5/5 · 0 · 2 · 100 · 100 · 0 |
| component-input-001 | 0/2 · 1 · 1 · 0 · 100 · 0 | 2/2 · 0 · 2 · 100 · 100 · 1 | 2/2 · 0 · 3 · 100 · 100 · 0 |
| component-select-001 | 0/1 · 2 · 1 · 0 · 100 · 0 | 1/1 · 0 · 2 · 100 · 100 · 1 | 1/1 · 0 · 2 · 100 · 100 · 0 |
| edge-long-001 | 0/2 · 8 · 1 · 0 · 100 · 0 | 2/2 · 0 · 0 · 100 · 100 · 0 | 2/2 · 0 · 2 · 100 · 100 · 0 |
| page-notifications-001 | 0/4 · 1 · 1 · 0 · 66.7 · 0 | 4/4 · 0 · 2 · 100 · 100 · 1 | 4/4 · 0 · 2 · 100 · 100 · 0 |
| page-settings-001 | 0/4 · 1 · 2 · 0 · 100 · 0 | 4/4 · 0 · 2 · 100 · 20 · 9 | 4/4 · 0 · 2 · 100 · 100 · 0 |
| pattern-card-list-001 | 0/3 · 10 · 0 · 0 · 100 · 0 | 3/3 · 0 · 0 · 100 · 100 · 0 | 3/3 · 0 · 2 · 100 · 100 · 0 |
| pattern-confirm-001 | 0/2 · 8 · 0 · 0 · 100 · 0 | 2/2 · 0 · 2 · 100 · 100 · 0 | 2/2 · 0 · 2 · 100 · 100 · 0 |
| pattern-empty-001 | 0/2 · 1 · 1 · 0 · 100 · 0 | 2/2 · 0 · 2 · 100 · 100 · 0 | 2/2 · 0 · 2 · 100 · 100 · 0 |
| pattern-invite-modal-001 | 0/5 · 12 · 0 · 0 · 100 · 0 | 5/5 · 0 · 1 · 100 · 100 · 3 | 5/5 · 0 · 2 · 100 · 100 · 0 |

The same tables are in `tables.md`. Full per-case data, including axe rule ids and imported names, is in `metrics.json`.

### What the numbers show

- **A** (no context) wrote competent standalone React: every build succeeded, functional averaged 94, and screenshots show polished UIs. But every answer styled itself with inline styles and/or an embedded `<style>` block in its own palette, and used native `<button>`/`<input>`/`<select>`. 13 of 14 A screenshots are predominantly light (mean pixel luminance 161–225 out of 255), inside a DS whose theme is dark; all B and C screenshots are dark (18–26). On the adversarial cases it applied `#8B5CF6` and put all six actions in the dialog footer. A DS score of 0 is close to built in: the prompt never says a design system exists.
- **B and C** both had a DS score of 100 on all 14 tasks, with no hex literals and no native controls. Both refused the purple hex (they mention it only in a code comment explaining that the token should change) and kept the dialog footer to primary + secondary.
- **B vs C.** ds-eval's DS score cannot tell them apart; the gap shows up in API correctness. DESIGN.md has no prop signatures, so B answers guessed them, and the B subagents said so in their replies. A `tsc --noEmit` against the real DS types found errors in 8 of 14 B answers and 0 of 14 C answers. Examples: `id` passed to `HelperText` (which drops it, breaking `aria-describedby` links), a `footer` prop on `Dialog` (which, per the DS source, renders no `footer`, so those buttons would not appear), `helperText`/`options` on `Select`, the wrong `Switch.onChange` signature, and `Tabs` given objects instead of strings. The last one crashed the B settings page at runtime (React error #31), the only crash in the run. ds-eval's Vite build does not type-check, so only that crash affected ds-eval scores (B functional 20 on page-settings). The others were invisible to ds-eval's functional assertions.
- **Accessibility went down with DS context.** The axe a11y score was A 84.3, B 77.5, C 68.9. All 21 B violations and 29 C violations are page-structure rules (`landmark-one-main`, `region`, `page-has-heading-one`). A had 12 violations, including 4 `color-contrast` failures that B and C did not have. A answers wrapped the page in `<main>` in 11 of 14 tasks, B in 4, C in 0. The demo DS has no page-layout or `<main>` component and its docs don't mention landmarks, so this is partly a gap in the DS, not only in the model.

## Reproduce

Scoring is deterministic and reproducible from the committed answers. Generating answers is not: it is a model sample.

```bash
# environment (Python ≥3.11, Node 22, npm)
python3 -m venv .venv && source .venv/bin/activate
pip install -e ".[dev,runtime]"
python -m playwright install --with-deps chromium
npm --prefix tools/ast ci
npm --prefix examples/demo-design-system ci

# 1. prompts (deterministic; should leave the committed prompt.md files unchanged)
python tools/conditions/build_prompts.py runs/2026-11-26-claude-opus --suite extended
git diff --exit-code runs/2026-11-26-claude-opus

# 2. score the committed answers with ds-eval (replay provider; models in models.yaml)
for c in A B C; do
  ds-eval run --model claude-opus-$c --suite extended --runtime \
    --output runs/2026-11-26-claude-opus/scored/claude-opus-$c
done

# 3. aggregate into tables.md / metrics.json (adds the supplementary tsc check)
python tools/conditions/aggregate.py runs/2026-11-26-claude-opus
```

How the answers were generated: each prompt was copied to a neutral path `/tmp/dsgen/<random-id>/prompt.md`, so neither the condition letter nor the case id (e.g. "adversarial-…") was visible. Then 42 fresh Cursor subagents (`generalPurpose`, `model: inherit`) each got this instruction verbatim:

> You are taking part in a code-generation test. Your instructions are in one file.
>
> 1. Use the Read tool exactly once to read /tmp/dsgen/&lt;id&gt;/prompt.md. That file is your entire context: do not read, list, glob, grep or search any other file or directory, do not run shell commands, and do not use any other tool to look things up.
> 2. Answer that prompt as you normally would for a user.
> 3. Use the Write tool exactly once to save your answer to /tmp/dsgen/&lt;id&gt;/Task.tsx. The file must contain only the TSX source of `src/task/Task.tsx` (no markdown fences, no commentary).
> 4. Reply with the word `done` followed by a list of the tool calls you made.

Afterwards, all 42 subagent transcripts were fetched and parsed. Each shows exactly two tool calls: a read of its own `prompt.md` and a write of its own `Task.tsx`. No subagent read the repo, the DS source, or another condition's output. Subagent ids, the neutral ids, SHA-256 hashes of each answer, and the audited tool calls are in `generation-log.json`. The answers were copied unchanged into `{A,B,C}/<case>/Task.tsx`.

## Limitations

- **One model, one sample, small n.** 14 tasks × 1 sample per condition, with no repeats and therefore no variance or confidence intervals. Temperature and reasoning settings could not be set or observed. With n=14, differences of a few points (e.g. 92.8 vs 93.1 overall) are not meaningful.
- **Self-generated, not via the API.** Answers were produced by Claude Opus 5.5 inside Cursor subagents, not by the Anthropic API through ds-eval's `anthropic` adapter. The orchestrating agent (also Claude Opus 5.5) wrote the 4 new tasks, DESIGN.md and the artifact after reading the DS source and the grader code. Both context documents restate only DS-source facts, but alignment between what the docs emphasise and what the graders check cannot be ruled out. The smoke-only table is there so the repo's original 10 tasks can be read on their own.
- **Condition A is a strict baseline.** It measures what you get when the agent is not told that a design system exists, not whether Claude ignores a design system it knows about.
- **LLM judges disabled.** ds-eval's visual and UX judges only run for `anthropic`/`openai` providers with API keys. They did not run here, and their 30% weight was redistributed by ds-eval's own logic. Nobody scored visual quality or UX.
- **Harness quirks, left unchanged on purpose:** `component-button-001` caps functional at 50 in every condition because its `has_component` assertion kind is not implemented by the runtime. The code-quality "uses any" check is a substring match: all 10 hits in this run are false positives ("Germany", "company", "anywhere"). Hex detection only covers string literals (B/C mention `#8B5CF6` only in comments, which is correctly not counted). Required components count as found if a JSX tag has the same name, so a locally defined `<Button>` would pass; no answer here did that. axe runs only on the first render, so closed dialogs are not audited. The Vite build does not type-check, which is why `tsc` is reported separately.
- **Tiny demo DS.** 15 components and 26 tokens fit easily in a prompt. Real design systems are much larger, where retrieval and context limits matter. B/C here are best-case context, not a test of retrieval.
- **C is an equivalent, not `/design-sync`.** It is hand-built from source in a similar spirit. Results for real `/design-sync` output may differ.
- **Fresh context, with caveats.** Subagents ran in the same Cursor environment and share Cursor's own agent system prompt. The transcript audit shows no file access beyond each subagent's own prompt.

## Files

| Path | Contents |
| --- | --- |
| `{A,B,C}/<case>/prompt.md` | Exact prompt for that condition and case |
| `{A,B,C}/<case>/Task.tsx` | Raw answer, unchanged |
| `generation-log.json` | Subagent id, neutral id, answer hash, audited tool calls per answer |
| `scored/claude-opus-{A,B,C}/` | ds-eval output: `summary.json`, `summary.md`, per-case `result.json`, `graders.json`, `runtime.log`, `screenshot.png` |
| `metrics.json`, `tables.md` | Aggregates from `tools/conditions/aggregate.py` |
