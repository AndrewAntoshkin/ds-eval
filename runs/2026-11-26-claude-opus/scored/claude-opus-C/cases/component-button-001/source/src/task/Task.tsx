import { useState } from "react";
import { Button, Dialog, useDialog } from "@ds";

export function Task() {
  const deleteDialog = useDialog();
  const [status, setStatus] = useState<string | null>(null);

  const handleSave = () => setStatus("Changes saved.");
  const handleCancel = () => setStatus("Changes discarded.");
  const handleConfirmDelete = () => {
    deleteDialog.close();
    setStatus("Item deleted.");
  };

  return (
    <div className="ds-stack">
      <div className="ds-row" role="toolbar" aria-label="Item actions">
        <Button type="button" variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button type="button" variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="button" variant="danger" onClick={deleteDialog.openDialog}>
          Delete
        </Button>
      </div>

      {status && (
        <p role="status" style={{ color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)", margin: 0 }}>
          {status}
        </p>
      )}

      <Dialog open={deleteDialog.open} title="Delete this item?" onClose={deleteDialog.close}>
        <div className="ds-stack">
          <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
            This action cannot be undone.
          </p>
          <div className="ds-row">
            <Button type="button" variant="secondary" onClick={deleteDialog.close}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
