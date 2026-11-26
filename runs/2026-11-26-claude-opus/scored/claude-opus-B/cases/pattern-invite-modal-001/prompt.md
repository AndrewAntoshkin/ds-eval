You are writing UI code for an existing React 18 + TypeScript app (Vite).

This project has a design system. Build the UI with it. Its DESIGN.md follows.

<design_md>
# Demo DS — DESIGN.md

Compact, human-readable guide to the demo design system. Source of truth:
`src/components/index.tsx`, `src/components/components.css`, `src/tokens.css`,
`docs/components.md`, `docs/rules.md`.

## Principles

- Build product UI from the design-system components. Import them from `@ds`.
- Do not recreate a component that already exists, and do not restyle one with
  ad-hoc CSS.
- All colors, spacing, radius and typography come from the tokens in
  `src/tokens.css` (CSS custom properties). No raw hex/rgb colors, no raw px
  spacing in product UI.
- The theme is dark: a near-black background, slightly lighter surfaces, a teal
  primary, a soft red for danger.

## Components (`import { … } from "@ds"`)

- **Button**: variants `primary`, `secondary`, `danger`, `ghost`. One primary
  action per area. Destructive actions use `danger`.
- **Input**, **Textarea**: text entry. Support an invalid state. Always pair with
  a visible **Label**, plus **HelperText** for hints or errors.
- **Label**, **HelperText** (has an error style), **Field**: a wrapper that renders
  label + control + helper/error.
- **Select**: a labeled select with built-in label, helper text and error message.
- **Checkbox**, **Radio**, **Switch**: choice controls with a built-in label.
  Use Switch for instant on/off settings.
- **Tabs**: tab strip for switching between sections of one page.
- **Dialog**: modal with a title. Use it for confirmations and short forms.
- **Badge**: small status/metadata pill.
- **Card**: surface container for grouped content.
- **PageHeader**: page title, optional description and actions area.
- **useDialog**: hook for dialog open/close state.

Native `<button>` and `<select>` must not appear in product UI. Use `Button`
and `Select`.

## Layout helpers (global classes)

- `.ds-stack`: vertical grid with `--space-4` gap.
- `.ds-row`: horizontal flex row, `--space-3` gap, right-aligned (good for
  action rows).

## Tokens

- Color: `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-text`,
  `--color-text-muted`, `--color-primary`, `--color-primary-text`,
  `--color-danger`, `--color-border`, `--color-focus`
- Spacing: `--space-1` (4px) … `--space-6` (32px)
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Type: `--font-sans`, `--font-size-sm`, `--font-size-md`, `--font-size-lg`,
  `--font-size-xl`
- Other: `--shadow-md`, `--control-height`

## Rules

- Tokens only: colors, spacing, radius, typography come from `src/tokens.css`.
- No raw hex or rgb in product UI.
- Dialog footer: one primary and one secondary action only. Never six actions.
- Destructive actions use `Button variant="danger"` and a confirmation `Dialog`.
- Every input has a visible `Label`. A placeholder is not a label.
</design_md>

## Task

An "Invite member" button opens a modal with an email field and a role picker
(Admin, Editor, Viewer). The modal footer has "Send invite" and "Cancel".

## Output

Return exactly one file: `src/task/Task.tsx`. It must export a React function component named `Task`, which the app renders as the page root. Return only the file contents, with no explanation.
