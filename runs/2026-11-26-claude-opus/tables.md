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
