import { useId, useState } from "react";
import {
  Badge,
  Button,
  Card,
  Dialog,
  HelperText,
  Input,
  Label,
  PageHeader,
  Textarea,
  useDialog,
} from "@ds";

type Status = "Unsaved" | "Saved" | "Draft saved" | "Previewing" | "Duplicated" | "Archived";

export function Task() {
  const editor = useDialog();
  const archiveConfirm = useDialog();
  const titleId = useId();
  const titleHelpId = useId();
  const notesId = useId();

  const [title, setTitle] = useState("Quarterly report");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<Status>("Unsaved");
  const [touched, setTouched] = useState(false);

  const titleInvalid = touched && title.trim() === "";

  const handleSave = () => {
    setTouched(true);
    if (title.trim() === "") return;
    setStatus("Saved");
    editor.close();
  };

  const handleSaveDraft = () => {
    setStatus("Draft saved");
    editor.close();
  };

  const handlePreview = () => {
    setStatus("Previewing");
  };

  const handleDuplicate = () => {
    setTitle((t) => `${t} (copy)`);
    setStatus("Duplicated");
  };

  const requestArchive = () => {
    editor.close();
    archiveConfirm.openDialog();
  };

  const confirmArchive = () => {
    setStatus("Archived");
    archiveConfirm.close();
  };

  const cancelArchive = () => {
    archiveConfirm.close();
    editor.openDialog();
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Documents"
        description="Edit a document and choose what to do with it."
        actions={
          <Button type="button" onClick={editor.openDialog}>
            Edit document
          </Button>
        }
      />

      <Card>
        <div className="ds-stack">
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <h2 style={{ margin: 0, fontSize: "var(--font-size-lg)" }}>{title || "Untitled"}</h2>
            <Badge>{status}</Badge>
          </div>
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "var(--font-size-md)" }}>
            {notes || "No notes yet."}
          </p>
        </div>
      </Card>

      <Dialog open={editor.open} title="Edit document" onClose={editor.close}>
        <form
          className="ds-stack"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
          <div className="ds-field">
            <Label htmlFor={titleId}>Title</Label>
            <Input
              id={titleId}
              value={title}
              invalid={titleInvalid}
              aria-describedby={titleHelpId}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => setTouched(true)}
            />
            <HelperText error={titleInvalid}>
              <span id={titleHelpId}>
                {titleInvalid ? "Title is required." : "Shown in the document list."}
              </span>
            </HelperText>
          </div>

          <div className="ds-field">
            <Label htmlFor={notesId}>Notes</Label>
            <Textarea
              id={notesId}
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {/* Footer is limited to one primary + one secondary action; the rest live here. */}
          <div className="ds-stack" style={{ gap: "var(--space-2)" }}>
            <span style={{ fontSize: "var(--font-size-sm)", color: "var(--color-text-muted)" }}>
              More actions
            </span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "var(--space-2)",
              }}
            >
              <Button type="button" variant="ghost" onClick={handleSaveDraft}>
                Save draft
              </Button>
              <Button type="button" variant="ghost" onClick={handlePreview}>
                Preview
              </Button>
              <Button type="button" variant="ghost" onClick={handleDuplicate}>
                Duplicate
              </Button>
              <Button type="button" variant="danger" onClick={requestArchive}>
                Archive
              </Button>
            </div>
          </div>

          <div className="ds-row">
            <Button type="button" variant="secondary" onClick={editor.close}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </Dialog>

      <Dialog open={archiveConfirm.open} title="Archive this document?" onClose={cancelArchive}>
        <div className="ds-stack">
          <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "var(--font-size-md)" }}>
            “{title || "Untitled"}” will be moved to the archive and hidden from the document list.
          </p>
          <div className="ds-row">
            <Button type="button" variant="secondary" onClick={cancelArchive}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={confirmArchive}>
              Archive
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
