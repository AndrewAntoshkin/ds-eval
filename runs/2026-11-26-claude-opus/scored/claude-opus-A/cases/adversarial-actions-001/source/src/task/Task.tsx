import { useEffect, useId, useRef, useState } from "react";

type ActionId = "save" | "save-draft" | "preview" | "duplicate" | "archive" | "cancel";

const css = `
.task-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f4f5f7;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1f2328;
  padding: 24px;
  box-sizing: border-box;
}
.task-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: grid;
  place-items: center;
  padding: 16px;
}
.task-dialog {
  width: min(720px, 100%);
  max-height: calc(100vh - 32px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
  overflow: hidden;
}
.task-dialog-header {
  padding: 20px 24px 8px;
}
.task-dialog-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}
.task-dialog-header p {
  margin: 4px 0 0;
  font-size: 14px;
  color: #59636e;
}
.task-dialog-body {
  padding: 12px 24px 20px;
  overflow: auto;
  display: grid;
  gap: 14px;
}
.task-field {
  display: grid;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}
.task-field input,
.task-field textarea {
  font: inherit;
  font-weight: 400;
  padding: 8px 10px;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  resize: vertical;
}
.task-field input:focus-visible,
.task-field textarea:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  border-color: #2563eb;
}
.task-dialog-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  background: #fafbfc;
}
.task-footer-group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.task-btn {
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  padding: 7px 14px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 120ms, border-color 120ms, color 120ms;
}
.task-btn:focus-visible {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
}
.task-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}
.task-btn--primary {
  background: #2563eb;
  color: #fff;
}
.task-btn--primary:hover:not(:disabled) {
  background: #1d4ed8;
}
.task-btn--secondary {
  background: #fff;
  color: #1f2328;
  border-color: #d0d7de;
}
.task-btn--secondary:hover:not(:disabled) {
  background: #f3f4f6;
}
.task-btn--ghost {
  background: transparent;
  color: #1f2328;
}
.task-btn--ghost:hover:not(:disabled) {
  background: #eef0f3;
}
.task-btn--danger {
  background: transparent;
  color: #b42318;
}
.task-btn--danger:hover:not(:disabled) {
  background: #fef3f2;
}
.task-status {
  font-size: 13px;
  color: #59636e;
  min-height: 18px;
  margin: 0;
}
@media (max-width: 560px) {
  .task-dialog-footer {
    flex-direction: column-reverse;
    align-items: stretch;
  }
  .task-footer-group {
    flex-direction: column-reverse;
  }
  .task-btn {
    width: 100%;
  }
}
`;

const statusText: Record<Exclude<ActionId, "cancel">, string> = {
  save: "Saved.",
  "save-draft": "Draft saved.",
  preview: "Opening preview…",
  duplicate: "Duplicated as a new copy.",
  archive: "Archived.",
};

export function Task() {
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("Quarterly update");
  const [summary, setSummary] = useState("Highlights and next steps for Q3.");
  const [status, setStatus] = useState("");

  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => openerRef.current?.focus());
  };

  const handle = (action: ActionId) => {
    if (action === "cancel") {
      setStatus("");
      close();
      return;
    }
    setStatus(statusText[action]);
    if (action === "save" || action === "archive") close();
  };

  useEffect(() => {
    if (!open) return;
    firstFieldRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const canSave = title.trim().length > 0;

  return (
    <div className="task-page">
      <style>{css}</style>

      <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
        <button
          ref={openerRef}
          type="button"
          className="task-btn task-btn--primary"
          onClick={() => {
            setStatus("");
            setOpen(true);
          }}
        >
          Edit document
        </button>
        <p className="task-status" role="status" aria-live="polite">
          {!open ? status : ""}
        </p>
      </div>

      {open && (
        <div
          className="task-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            ref={dialogRef}
            className="task-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <header className="task-dialog-header">
              <h2 id={titleId}>Edit document</h2>
              <p id={descId}>Update the details below, then save or keep it as a draft.</p>
            </header>

            <form
              className="task-dialog-body"
              id="task-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (canSave) handle("save");
              }}
            >
              <label className="task-field">
                Title
                <input
                  ref={firstFieldRef}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              <label className="task-field">
                Summary
                <textarea rows={4} value={summary} onChange={(e) => setSummary(e.target.value)} />
              </label>
              <p className="task-status" role="status" aria-live="polite">
                {status}
              </p>
            </form>

            <footer className="task-dialog-footer">
              <div className="task-footer-group" role="group" aria-label="More actions">
                <button
                  type="button"
                  className="task-btn task-btn--danger"
                  onClick={() => handle("archive")}
                >
                  Archive
                </button>
                <button
                  type="button"
                  className="task-btn task-btn--ghost"
                  onClick={() => handle("duplicate")}
                >
                  Duplicate
                </button>
                <button
                  type="button"
                  className="task-btn task-btn--ghost"
                  onClick={() => handle("preview")}
                >
                  Preview
                </button>
              </div>

              <div className="task-footer-group" role="group" aria-label="Save actions">
                <button
                  type="button"
                  className="task-btn task-btn--secondary"
                  onClick={() => handle("cancel")}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="task-btn task-btn--secondary"
                  onClick={() => handle("save-draft")}
                >
                  Save draft
                </button>
                <button
                  type="submit"
                  form="task-form"
                  className="task-btn task-btn--primary"
                  disabled={!canSave}
                >
                  Save
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}

export default Task;
