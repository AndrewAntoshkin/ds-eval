import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from "react";

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#111827",
    background: "#f9fafb",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    padding: 24,
    borderRadius: 12,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  heading: { margin: 0, fontSize: 18, fontWeight: 600 },
  text: { margin: "8px 0 20px", fontSize: 14, lineHeight: 1.5, color: "#4b5563" },
  status: { marginTop: 16, fontSize: 14, color: "#065f46" },
  backdrop: {
    position: "fixed",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    background: "rgba(17, 24, 39, 0.5)",
    zIndex: 1000,
  },
  dialog: {
    width: "100%",
    maxWidth: 420,
    padding: 24,
    borderRadius: 12,
    background: "#ffffff",
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
  },
  dialogTitle: { margin: 0, fontSize: 18, fontWeight: 600 },
  dialogBody: { margin: "8px 0 24px", fontSize: 14, lineHeight: 1.5, color: "#4b5563" },
  footer: { display: "flex", justifyContent: "flex-end", gap: 12 },
};

const baseButton: CSSProperties = {
  appearance: "none",
  padding: "8px 16px",
  fontSize: 14,
  fontWeight: 500,
  lineHeight: "20px",
  borderRadius: 8,
  cursor: "pointer",
  font: "inherit",
};

const secondaryButton: CSSProperties = {
  ...baseButton,
  background: "#ffffff",
  color: "#111827",
  border: "1px solid #d1d5db",
};

const destructiveButton: CSSProperties = {
  ...baseButton,
  background: "#dc2626",
  color: "#ffffff",
  border: "1px solid #dc2626",
};

const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmDialog({
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onCancel();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
    );
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      style={styles.backdrop}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        style={styles.dialog}
        onKeyDown={handleKeyDown}
      >
        <h2 id={titleId} style={styles.dialogTitle}>
          {title}
        </h2>
        <p id={descriptionId} style={styles.dialogBody}>
          {description}
        </p>
        <div style={styles.footer}>
          <button
            ref={cancelRef}
            type="button"
            style={secondaryButton}
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button type="button" style={destructiveButton} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Task() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    setIsOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  const handleConfirm = useCallback(() => {
    setIsDeleted(true);
    close();
  }, [close]);

  return (
    <main style={styles.page}>
      <section style={styles.card} aria-labelledby="danger-zone-heading">
        <h1 id="danger-zone-heading" style={styles.heading}>
          Delete project
        </h1>
        <p style={styles.text}>
          Permanently remove this project and all of its data. This action
          cannot be undone.
        </p>
        <button
          ref={triggerRef}
          type="button"
          style={destructiveButton}
          aria-haspopup="dialog"
          onClick={() => setIsOpen(true)}
          disabled={isDeleted}
        >
          Delete project
        </button>
        <p role="status" aria-live="polite" style={styles.status}>
          {isDeleted ? "Project deleted." : ""}
        </p>
      </section>

      {isOpen && (
        <ConfirmDialog
          title="Delete project?"
          description="This will permanently delete the project and all of its data. This action cannot be undone."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleConfirm}
          onCancel={close}
        />
      )}
    </main>
  );
}

export default Task;
