import { useState } from "react";
import {
  Badge,
  Button,
  Card,
  Dialog,
  HelperText,
  Input,
  Label,
  PageHeader,
} from "@ds";

type Status = "Published" | "Draft saved" | "Duplicated" | "Archived" | "Unsaved";

export function Task() {
  const [editOpen, setEditOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
  const [title, setTitle] = useState("Quarterly report");
  const [status, setStatus] = useState<Status>("Unsaved");
  const [previewing, setPreviewing] = useState(false);

  const titleInvalid = title.trim().length === 0;

  const closeEdit = () => {
    setEditOpen(false);
    setPreviewing(false);
  };

  const handleSave = () => {
    if (titleInvalid) return;
    setStatus("Published");
    closeEdit();
  };

  const handleSaveDraft = () => {
    setStatus("Draft saved");
  };

  const handleDuplicate = () => {
    setTitle((t) => `${t} (copy)`);
    setStatus("Duplicated");
  };

  const handleArchive = () => {
    setStatus("Archived");
    setArchiveOpen(false);
    closeEdit();
  };

  return (
    <div className="ds-stack" style={{ padding: "var(--space-6)" }}>
      <PageHeader
        title="Documents"
        description="Edit a document and choose what to do with it."
        actions={
          <Button variant="primary" onClick={() => setEditOpen(true)}>
            Edit document
          </Button>
        }
      />

      <Card>
        <div className="ds-stack">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-3)",
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text)",
            }}
          >
            <span>{title}</span>
            <Badge>{status}</Badge>
          </div>
        </div>
      </Card>

      <Dialog
        open={editOpen}
        onClose={closeEdit}
        title="Edit document"
        footer={
          <div className="ds-row">
            <Button variant="secondary" onClick={closeEdit}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSave} disabled={titleInvalid}>
              Save
            </Button>
          </div>
        }
      >
        <div className="ds-stack">
          <div>
            <Label htmlFor="doc-title">Title</Label>
            <Input
              id="doc-title"
              value={title}
              invalid={titleInvalid}
              aria-invalid={titleInvalid}
              aria-describedby="doc-title-help"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTitle(e.target.value)
              }
            />
            <HelperText id="doc-title-help" error={titleInvalid}>
              {titleInvalid ? "A title is required." : "Shown in the document list."}
            </HelperText>
          </div>

          {previewing && (
            <Card>
              <div
                style={{
                  color: "var(--color-text-muted)",
                  fontSize: "var(--font-size-sm)",
                }}
              >
                Preview: {title || "Untitled"}
              </div>
            </Card>
          )}

          <div className="ds-stack">
            <Label>More actions</Label>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              <Button variant="ghost" onClick={handleSaveDraft}>
                Save draft
              </Button>
              <Button variant="ghost" onClick={() => setPreviewing((p) => !p)}>
                {previewing ? "Hide preview" : "Preview"}
              </Button>
              <Button variant="ghost" onClick={handleDuplicate}>
                Duplicate
              </Button>
              <Button variant="danger" onClick={() => setArchiveOpen(true)}>
                Archive
              </Button>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title="Archive this document?"
        footer={
          <div className="ds-row">
            <Button variant="secondary" onClick={() => setArchiveOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleArchive}>
              Archive
            </Button>
          </div>
        }
      >
        <p style={{ margin: 0, color: "var(--color-text-muted)" }}>
          “{title}” will be removed from the document list. You can restore it
          later from the archive.
        </p>
      </Dialog>
    </div>
  );
}

export default Task;
