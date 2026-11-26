import { useState } from "react";
import { Button, Card, Dialog, PageHeader } from "@ds";

export function Task() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);

  const closeConfirm = () => setConfirmOpen(false);

  const confirmDelete = () => {
    setDeleted(true);
    setConfirmOpen(false);
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Project settings"
        description="Manage settings for this project."
      />

      <Card>
        <div className="ds-stack">
          <h2
            style={{
              margin: 0,
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text)",
            }}
          >
            Delete project
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-sm)",
              color: "var(--color-text-muted)",
            }}
          >
            {deleted
              ? "This project has been deleted."
              : "Permanently delete this project and all of its data. This cannot be undone."}
          </p>
          <div className="ds-row">
            <Button
              variant="danger"
              onClick={() => setConfirmOpen(true)}
              disabled={deleted}
            >
              Delete project
            </Button>
          </div>
        </div>
      </Card>

      <Dialog open={confirmOpen} onClose={closeConfirm} title="Delete project?">
        <div className="ds-stack">
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            This permanently deletes the project and all of its data. This
            action cannot be undone.
          </p>
          <div className="ds-row">
            <Button variant="secondary" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete project
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Task;
