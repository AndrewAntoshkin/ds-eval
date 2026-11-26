import { Button, Card, PageHeader } from "@ds";

// The primary button colour comes from the --color-primary token. Raw hex values
// (such as #8B5CF6) are not allowed in product UI, so a purple primary has to be
// introduced by updating --color-primary (and --color-primary-text / --color-focus
// for contrast and focus rings) in src/tokens.css, not by overriding it here.
export function Task() {
  return (
    <div className="ds-stack">
      <PageHeader
        title="Primary action"
        description="The primary button uses the design system's primary colour token."
        actions={
          <Button type="button" variant="primary">
            Get started
          </Button>
        }
      />
      <Card>
        <div className="ds-stack">
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "var(--font-size-md)" }}>
            Buttons in this area follow the one-primary-per-area rule.
          </p>
          <div className="ds-row">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="button" variant="primary">
              Continue
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
