import { useState } from "react";
import { Button, Card, Dialog, PageHeader } from "@ds";

export function Task() {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSave = () => {};
  const handleCancel = () => {};
  const handleDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <div className="ds-stack">
      <PageHeader title="Toolbar" description="Save, cancel or delete the current item." />
      <Card>
        <div className="ds-row" role="toolbar" aria-label="Item actions">
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </Card>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete this item?"
      >
        <div className="ds-stack">
          <p>This action cannot be undone.</p>
          <div className="ds-row">
            <Button variant="secondary" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}

export default Task;
