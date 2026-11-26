import { useState } from "react";
import { Badge, Button, Card, Dialog, PageHeader, useDialog } from "@ds";

export function Task() {
  const { open, openDialog, close } = useDialog();
  const [deleted, setDeleted] = useState(false);

  const confirmDelete = () => {
    setDeleted(true);
    close();
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Project settings"
        description="Manage the lifecycle of this project."
      />

      <Card>
        <div className="ds-stack">
          <div>
            <h2 style={{ margin: 0, fontSize: "var(--font-size-lg)" }}>Danger zone</h2>
            <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "var(--font-size-md)" }}>
              Deleting a project permanently removes its files, settings and history.
            </p>
          </div>

          {deleted ? (
            <p role="status" style={{ margin: 0 }}>
              <Badge>Deleted</Badge> This project has been deleted.
            </p>
          ) : (
            <div className="ds-row">
              <Button type="button" variant="danger" onClick={openDialog}>
                Delete project
              </Button>
            </div>
          )}
        </div>
      </Card>

      <Dialog open={open} title="Delete project?" onClose={close}>
        <div className="ds-stack">
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            This action cannot be undone. The project and all of its data will be permanently deleted.
          </p>
          <div className="ds-row">
            <Button type="button" variant="secondary" onClick={close}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={confirmDelete}>
              Delete project
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
