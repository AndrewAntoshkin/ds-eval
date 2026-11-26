You are writing UI code for an existing React 18 + TypeScript app (Vite).

This project has a design system. Build the UI with it. Its machine-readable design-system artifact (component API, tokens, anti-patterns) follows.

```json
{
  "schema": "ds-eval/design-system-artifact@1",
  "name": "Demo DS",
  "version": "1.0",
  "derived_from": [
    "src/components/index.tsx",
    "src/components/components.css",
    "src/tokens.css",
    "docs/components.md",
    "docs/rules.md"
  ],
  "import": {
    "module": "@ds",
    "example": "import { Button, Card } from \"@ds\";"
  },
  "host": {
    "framework": "React 18 + TypeScript (Vite)",
    "page_root": "src/task/Task.tsx must export function Task(); it is rendered inside <div className=\"app-shell\">",
    "global_css": ["src/tokens.css", "src/components/components.css"]
  },
  "components": [
    {
      "name": "Button",
      "kind": "component",
      "renders": "<button class=\"ds-btn ds-btn-{variant}\">",
      "props": {
        "variant": { "type": "\"primary\" | \"secondary\" | \"danger\" | \"ghost\"", "required": false, "default": "primary" },
        "children": { "type": "ReactNode", "required": false },
        "...rest": { "type": "ButtonHTMLAttributes<HTMLButtonElement>", "notes": "onClick, type, disabled, aria-* are forwarded" }
      },
      "usage": "All clickable actions. One primary per area; secondary for cancel/alternate; danger for destructive; ghost for low emphasis.",
      "notes": ["No default type attribute is set; pass type=\"button\" inside a <form> unless it should submit."]
    },
    {
      "name": "Label",
      "kind": "component",
      "renders": "<label class=\"ds-label\" for={htmlFor}>",
      "props": {
        "htmlFor": { "type": "string", "required": false },
        "children": { "type": "ReactNode", "required": true }
      },
      "usage": "Visible label for Input/Textarea. Set htmlFor to the control id."
    },
    {
      "name": "HelperText",
      "kind": "component",
      "renders": "<p class=\"ds-help\"> or <p class=\"ds-help ds-help-error\">",
      "props": {
        "error": { "type": "boolean", "required": false },
        "children": { "type": "ReactNode", "required": true }
      },
      "usage": "Hint below a control; error=true for validation messages."
    },
    {
      "name": "Input",
      "kind": "component",
      "renders": "<input class=\"ds-input [is-invalid]\" aria-invalid={invalid}>",
      "props": {
        "invalid": { "type": "boolean", "required": false },
        "id": { "type": "string", "required": false },
        "...rest": { "type": "InputHTMLAttributes<HTMLInputElement>", "notes": "type, value, onChange, placeholder, aria-describedby, etc." }
      },
      "usage": "Single-line text entry. Pair with <Label htmlFor={id}> and optional <HelperText>."
    },
    {
      "name": "Textarea",
      "kind": "component",
      "renders": "<textarea class=\"ds-input [is-invalid]\" aria-invalid={invalid}>",
      "props": {
        "invalid": { "type": "boolean", "required": false },
        "...rest": { "type": "TextareaHTMLAttributes<HTMLTextAreaElement>", "notes": "id, rows, maxLength, value, onChange, etc." }
      },
      "usage": "Multi-line text entry. Pair with <Label htmlFor={id}> and optional <HelperText>."
    },
    {
      "name": "Select",
      "kind": "component",
      "renders": "<div class=\"ds-field\"><Label/><select class=\"ds-input\"/><HelperText/></div>",
      "props": {
        "label": { "type": "string", "required": true },
        "helper": { "type": "string", "required": false },
        "error": { "type": "string", "required": false, "notes": "When set, shown instead of helper and marks the select invalid" },
        "children": { "type": "ReactNode", "required": false, "notes": "<option> elements" },
        "id": { "type": "string", "required": false, "notes": "Auto-generated with useId when omitted; label is associated automatically" },
        "...rest": { "type": "SelectHTMLAttributes<HTMLSelectElement>", "notes": "value, onChange, defaultValue, etc." }
      },
      "usage": "Any pick-one-from-a-list control. Includes its own label/helper/error; do not wrap it in another Label."
    },
    {
      "name": "Checkbox",
      "kind": "component",
      "renders": "<label class=\"ds-choice\"><input type=\"checkbox\"/><span>{label}</span></label>",
      "props": {
        "label": { "type": "string", "required": true },
        "...rest": { "type": "InputHTMLAttributes<HTMLInputElement>", "notes": "checked, defaultChecked, onChange, name" }
      },
      "usage": "Independent opt-in choices."
    },
    {
      "name": "Radio",
      "kind": "component",
      "renders": "<label class=\"ds-choice\"><input type=\"radio\"/><span>{label}</span></label>",
      "props": {
        "label": { "type": "string", "required": true },
        "...rest": { "type": "InputHTMLAttributes<HTMLInputElement>", "notes": "name, value, checked, onChange" }
      },
      "usage": "One choice from a small set. Give all radios in a group the same name."
    },
    {
      "name": "Switch",
      "kind": "component",
      "renders": "<label class=\"ds-choice\"><input type=\"checkbox\" role=\"switch\"/><span>{label}</span></label>",
      "props": {
        "label": { "type": "string", "required": true },
        "checked": { "type": "boolean", "required": true },
        "onChange": { "type": "(value: boolean) => void", "required": true, "notes": "Receives the new boolean, not an event" }
      },
      "usage": "Instant on/off settings."
    },
    {
      "name": "Tabs",
      "kind": "component",
      "renders": "<div class=\"ds-tabs\" role=\"tablist\"> with one <button role=\"tab\" aria-selected> per tab",
      "props": {
        "tabs": { "type": "string[]", "required": true, "notes": "Tab labels; also used as values" },
        "value": { "type": "string", "required": true },
        "onChange": { "type": "(value: string) => void", "required": true }
      },
      "usage": "Switch between sections of one page. Renders only the tab strip; render the active panel yourself based on value."
    },
    {
      "name": "Dialog",
      "kind": "component",
      "renders": "null when closed; otherwise backdrop <button aria-label=\"Close\"> + <div role=\"dialog\" aria-modal=\"true\"> with an <h2> title",
      "props": {
        "open": { "type": "boolean", "required": true },
        "title": { "type": "string", "required": true },
        "children": { "type": "ReactNode", "required": true },
        "onClose": { "type": "() => void", "required": true, "notes": "Called when the backdrop is clicked" }
      },
      "usage": "Modal confirmations and short forms. No built-in footer: render actions in children, e.g. <div className=\"ds-row\">. Footer allows one primary + one secondary action."
    },
    {
      "name": "Badge",
      "kind": "component",
      "renders": "<span class=\"ds-badge\">",
      "props": { "children": { "type": "ReactNode", "required": true } },
      "usage": "Small status or metadata pill. No color variants."
    },
    {
      "name": "Card",
      "kind": "component",
      "renders": "<section class=\"ds-card\">",
      "props": { "children": { "type": "ReactNode", "required": true } },
      "usage": "Surface container for grouped content."
    },
    {
      "name": "PageHeader",
      "kind": "component",
      "renders": "<header class=\"ds-page-header\"><h1>{title}</h1><p>{description}</p><div class=\"ds-page-actions\">{actions}</div></header>",
      "props": {
        "title": { "type": "string", "required": true },
        "description": { "type": "string", "required": false },
        "actions": { "type": "ReactNode", "required": false }
      },
      "usage": "Top of a page: title, optional description and page-level actions."
    },
    {
      "name": "Field",
      "kind": "component",
      "renders": "<div class=\"ds-field\"><Label>{label}</Label>{children}<HelperText/></div>",
      "props": {
        "label": { "type": "string", "required": true },
        "helper": { "type": "string", "required": false },
        "error": { "type": "string", "required": false, "notes": "When set, shown instead of helper" },
        "children": { "type": "ReactNode", "required": true }
      },
      "usage": "Layout wrapper for label + control + helper/error.",
      "notes": ["The rendered Label has no htmlFor, so it is not programmatically associated with the child control."]
    },
    {
      "name": "useDialog",
      "kind": "hook",
      "signature": "useDialog(): { open: boolean; openDialog: () => void; close: () => void }",
      "usage": "Open/close state for Dialog."
    }
  ],
  "layout_classes": {
    "ds-stack": "display: grid; gap: var(--space-4)",
    "ds-row": "display: flex; gap: var(--space-3); justify-content: flex-end",
    "app-shell": "page container provided by the host (min-height: 100%; padding: var(--space-6))"
  },
  "tokens": {
    "color": {
      "--color-bg": "#0f1115",
      "--color-surface": "#171a21",
      "--color-surface-2": "#1e2330",
      "--color-text": "#e8eaed",
      "--color-text-muted": "#9aa3b2",
      "--color-primary": "#2dd4bf",
      "--color-primary-text": "#042f2e",
      "--color-danger": "#f87171",
      "--color-border": "#2a3140",
      "--color-focus": "#5eead4"
    },
    "space": {
      "--space-1": "4px",
      "--space-2": "8px",
      "--space-3": "12px",
      "--space-4": "16px",
      "--space-5": "24px",
      "--space-6": "32px"
    },
    "radius": {
      "--radius-sm": "6px",
      "--radius-md": "10px",
      "--radius-lg": "14px"
    },
    "typography": {
      "--font-sans": "Inter, system-ui, sans-serif",
      "--font-size-sm": "13px",
      "--font-size-md": "14px",
      "--font-size-lg": "18px",
      "--font-size-xl": "28px"
    },
    "other": {
      "--shadow-md": "0 12px 32px -16px rgba(0, 0, 0, 0.5)",
      "--control-height": "40px"
    },
    "usage": "Reference tokens as CSS variables, e.g. var(--space-4). Token values are listed for reference only; never copy them into product UI."
  },
  "anti_patterns": [
    { "id": "native-button", "detect": "<button> in product UI", "instead": "Button" },
    { "id": "native-select", "detect": "<select> in product UI", "instead": "Select" },
    { "id": "recreated-component", "detect": "Hand-rolled control or local component that duplicates a @ds export (e.g. a local Card, or a raw <input type=\"checkbox\">)", "instead": "Import the existing component from @ds" },
    { "id": "raw-color", "detect": "Hex, rgb() or hsl() color literals in product UI", "instead": "var(--color-*) tokens" },
    { "id": "raw-spacing", "detect": "Raw px values for spacing, radius or font size", "instead": "var(--space-*), var(--radius-*), var(--font-size-*)" },
    { "id": "placeholder-as-label", "detect": "Input whose only label is its placeholder", "instead": "Visible Label (htmlFor) or Select's label prop" },
    { "id": "dialog-footer-overflow", "detect": "More than one primary and one secondary action in a Dialog footer", "instead": "Keep primary + secondary only" },
    { "id": "unconfirmed-destructive", "detect": "Destructive action that runs immediately", "instead": "Button variant=\"danger\" that opens a confirmation Dialog" }
  ],
  "rules": [
    "Tokens only: colors, spacing, radius, typography come from src/tokens.css.",
    "No raw hex or rgb in product UI.",
    "Do not use native <button> or <select> in product UI.",
    "Do not recreate components that already exist.",
    "Dialog footer: primary + secondary only. Never 6 actions.",
    "Destructive actions use Button variant=\"danger\" and a confirmation Dialog.",
    "Every input has a visible Label. Placeholder is not a label."
  ]
}
```

## Task

Build a settings page with a page header, tabs (Profile / Notifications),
form controls, and save/cancel actions.

## Output

Return exactly one file: `src/task/Task.tsx`. It must export a React function component named `Task`, which the app renders as the page root. Return only the file contents, with no explanation.
