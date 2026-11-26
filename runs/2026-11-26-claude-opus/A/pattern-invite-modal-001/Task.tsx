import { useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, FormEvent, KeyboardEvent as ReactKeyboardEvent } from "react";

type Role = "admin" | "editor" | "viewer";

const ROLES: { value: Role; label: string; description: string }[] = [
  { value: "admin", label: "Admin", description: "Full access, including billing and member management." },
  { value: "editor", label: "Editor", description: "Can create and edit content, but not manage members." },
  { value: "viewer", label: "Viewer", description: "Read-only access to content." },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 24px",
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#111827",
    background: "#f9fafb",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 640,
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 24,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  title: { margin: 0, fontSize: 20, fontWeight: 600 },
  subtitle: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  primaryButton: {
    appearance: "none",
    border: "1px solid #4f46e5",
    background: "#4f46e5",
    color: "#ffffff",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  secondaryButton: {
    appearance: "none",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#111827",
    borderRadius: 8,
    padding: "8px 16px",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
  },
  status: {
    marginTop: 16,
    padding: "10px 12px",
    borderRadius: 8,
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
    color: "#065f46",
    fontSize: 14,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(17, 24, 39, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 1000,
  },
  dialog: {
    width: "100%",
    maxWidth: 480,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100vh - 32px)",
    overflow: "hidden",
  },
  dialogHeader: { padding: "20px 24px 0" },
  dialogTitle: { margin: 0, fontSize: 18, fontWeight: 600 },
  dialogDescription: { margin: "4px 0 0", fontSize: 14, color: "#6b7280" },
  dialogBody: {
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: 20,
    overflowY: "auto",
  },
  field: { display: "flex", flexDirection: "column", gap: 6, border: "none", margin: 0, padding: 0 },
  label: { fontSize: 14, fontWeight: 500, padding: 0 },
  input: {
    fontSize: 14,
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #d1d5db",
    outlineOffset: 1,
    fontFamily: "inherit",
  },
  inputError: { borderColor: "#dc2626" },
  errorText: { margin: 0, fontSize: 13, color: "#dc2626" },
  roleOption: {
    display: "flex",
    alignItems: "flex-start",
    gap: 10,
    padding: "10px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    cursor: "pointer",
  },
  roleOptionSelected: { borderColor: "#4f46e5", background: "#eef2ff" },
  roleLabel: { fontSize: 14, fontWeight: 500, display: "block" },
  roleDescription: { fontSize: 13, color: "#6b7280", display: "block", marginTop: 2 },
  dialogFooter: {
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
    background: "#f9fafb",
  },
};

interface InviteMemberModalProps {
  onClose: () => void;
  onSubmit: (invite: { email: string; role: Role }) => void;
}

function InviteMemberModal({ onClose, onSubmit }: InviteMemberModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const emailId = useId();
  const emailErrorId = useId();
  const roleName = useId();

  const dialogRef = useRef<HTMLDivElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("viewer");
  const [touched, setTouched] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const trimmedEmail = email.trim();
  const emailError =
    trimmedEmail === ""
      ? "Email is required."
      : !EMAIL_PATTERN.test(trimmedEmail)
        ? "Enter a valid email address."
        : null;
  const showEmailError = touched && emailError !== null;

  useEffect(() => {
    emailRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;

    const focusable = Array.from(
      dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (emailError) {
      emailRef.current?.focus();
      return;
    }
    setSubmitting(true);
    onSubmit({ email: trimmedEmail, role });
  };

  return (
    <div
      style={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        style={styles.dialog}
        onKeyDown={handleKeyDown}
      >
        <form
          noValidate
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
        >
          <div style={styles.dialogHeader}>
            <h2 id={titleId} style={styles.dialogTitle}>
              Invite member
            </h2>
            <p id={descriptionId} style={styles.dialogDescription}>
              Send an invitation by email and choose what they can access.
            </p>
          </div>

          <div style={styles.dialogBody}>
            <div style={styles.field}>
              <label htmlFor={emailId} style={styles.label}>
                Email address
              </label>
              <input
                ref={emailRef}
                id={emailId}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="name@company.com"
                value={email}
                required
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? emailErrorId : undefined}
                onChange={(event) => setEmail(event.target.value)}
                onBlur={() => setTouched(true)}
                style={{ ...styles.input, ...(showEmailError ? styles.inputError : null) }}
              />
              {showEmailError && (
                <p id={emailErrorId} role="alert" style={styles.errorText}>
                  {emailError}
                </p>
              )}
            </div>

            <fieldset style={styles.field}>
              <legend style={{ ...styles.label, marginBottom: 6 }}>Role</legend>
              {ROLES.map((option) => {
                const selected = role === option.value;
                return (
                  <label
                    key={option.value}
                    style={{ ...styles.roleOption, ...(selected ? styles.roleOptionSelected : null) }}
                  >
                    <input
                      type="radio"
                      name={roleName}
                      value={option.value}
                      checked={selected}
                      onChange={() => setRole(option.value)}
                      style={{ marginTop: 3 }}
                    />
                    <span>
                      <span style={styles.roleLabel}>{option.label}</span>
                      <span style={styles.roleDescription}>{option.description}</span>
                    </span>
                  </label>
                );
              })}
            </fieldset>
          </div>

          <div style={styles.dialogFooter}>
            <button type="button" onClick={onClose} style={styles.secondaryButton}>
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={{ ...styles.primaryButton, opacity: submitting ? 0.7 : 1 }}
            >
              Send invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Task() {
  const [open, setOpen] = useState(false);
  const [lastInvite, setLastInvite] = useState<{ email: string; role: Role } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const close = () => {
    setOpen(false);
    requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const roleLabel = (value: Role) => ROLES.find((r) => r.value === value)?.label ?? value;

  return (
    <main style={styles.page}>
      <section style={styles.card}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Team members</h1>
            <p style={styles.subtitle}>Manage who has access to this workspace.</p>
          </div>
          <button
            ref={triggerRef}
            type="button"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
            style={styles.primaryButton}
          >
            Invite member
          </button>
        </div>

        <div aria-live="polite">
          {lastInvite && (
            <p style={styles.status}>
              Invitation sent to <strong>{lastInvite.email}</strong> as{" "}
              {roleLabel(lastInvite.role)}.
            </p>
          )}
        </div>
      </section>

      {open && (
        <InviteMemberModal
          onClose={close}
          onSubmit={(invite) => {
            setLastInvite(invite);
            close();
          }}
        />
      )}
    </main>
  );
}

export default Task;
