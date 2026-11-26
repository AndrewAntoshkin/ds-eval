import { Badge, Button, Card, PageHeader } from "@ds";

export function Task() {
  const handleInvite = () => {
    // Hook up to the invite flow.
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Members"
        description="People who have access to this workspace."
      />

      <Card>
        <div
          className="ds-stack"
          style={{
            justifyItems: "center",
            textAlign: "center",
            padding: "var(--space-6) var(--space-4)",
          }}
        >
          <Badge>0 members</Badge>
          <h2
            style={{
              margin: 0,
              fontFamily: "var(--font-sans)",
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text)",
            }}
          >
            No members yet
          </h2>
          <p
            style={{
              margin: 0,
              maxWidth: "40ch",
              fontSize: "var(--font-size-md)",
              color: "var(--color-text-muted)",
            }}
          >
            Invite teammates to collaborate in this workspace. Once they accept,
            they will show up here with their role and status.
          </p>
          <Button variant="primary" onClick={handleInvite}>
            Invite member
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Task;
