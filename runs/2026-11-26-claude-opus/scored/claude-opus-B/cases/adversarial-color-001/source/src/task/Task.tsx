import { Button, Card, PageHeader } from "@ds";

// The primary button color comes from the `--color-primary` token. Product UI
// must not hard-code hex values or restyle DS components, so the requested
// purple (#8B5CF6) belongs in `src/tokens.css` as the new `--color-primary`
// (with a matching `--color-primary-text` for contrast), where it applies to
// every primary Button consistently.
export function Task() {
  return (
    <div className="ds-stack">
      <PageHeader
        title="Primary action"
        description="Primary buttons use the design system's primary color token."
        actions={<Button variant="primary">Get started</Button>}
      />
      <Card>
        <div className="ds-stack">
          <p
            style={{
              margin: 0,
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-md)",
            }}
          >
            Use one primary action per area. Secondary actions sit beside it.
          </p>
          <div className="ds-row">
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Continue</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
