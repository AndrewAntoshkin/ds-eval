import { useId, useState, type CSSProperties, type FormEvent } from "react";

type Category = "bug" | "idea" | "question";

const CATEGORIES: { value: Category; label: string }[] = [
  { value: "bug", label: "Bug" },
  { value: "idea", label: "Idea" },
  { value: "question", label: "Question" },
];

const MESSAGE_LIMIT = 500;

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 16px",
    background: "#f6f7f9",
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#1f2328",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "#ffffff",
    border: "1px solid #e1e4e8",
    borderRadius: 12,
    padding: 28,
    boxShadow: "0 1px 3px rgba(16, 24, 40, 0.06)",
    boxSizing: "border-box",
  },
  title: { margin: "0 0 4px", fontSize: 22, fontWeight: 600 },
  subtitle: { margin: "0 0 24px", fontSize: 14, color: "#57606a" },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 600 },
  input: {
    font: "inherit",
    fontSize: 14,
    padding: "9px 12px",
    border: "1px solid #d0d7de",
    borderRadius: 8,
    background: "#ffffff",
    color: "inherit",
    boxSizing: "border-box",
    width: "100%",
  },
  textarea: { minHeight: 140, resize: "vertical", lineHeight: 1.5 },
  helperRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    fontSize: 12,
    color: "#57606a",
  },
  error: { fontSize: 12, color: "#cf222e" },
  actions: { display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 },
  buttonBase: {
    font: "inherit",
    fontSize: 14,
    fontWeight: 600,
    padding: "9px 16px",
    borderRadius: 8,
    cursor: "pointer",
  },
  secondary: {
    background: "#ffffff",
    color: "#1f2328",
    border: "1px solid #d0d7de",
  },
  primary: {
    background: "#1f6feb",
    color: "#ffffff",
    border: "1px solid #1f6feb",
  },
  status: {
    marginBottom: 20,
    padding: "10px 12px",
    borderRadius: 8,
    background: "#dafbe1",
    border: "1px solid #aceebb",
    color: "#116329",
    fontSize: 14,
  },
};

type Errors = Partial<Record<"subject" | "category" | "message", string>>;

export function Task() {
  const id = useId();
  const subjectId = `${id}-subject`;
  const categoryId = `${id}-category`;
  const messageId = `${id}-message`;
  const messageHelpId = `${id}-message-help`;

  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string | null>(null);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!subject.trim()) next.subject = "Enter a subject.";
    if (!category) next.category = "Choose a category.";
    if (!message.trim()) next.message = "Enter a message.";
    else if (message.length > MESSAGE_LIMIT)
      next.message = `Message must be ${MESSAGE_LIMIT} characters or fewer.`;
    return next;
  };

  const reset = () => {
    setSubject("");
    setCategory("");
    setMessage("");
    setErrors({});
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0) {
      setStatus(null);
      return;
    }
    reset();
    setStatus("Thanks! Your feedback has been sent.");
  };

  const handleCancel = () => {
    reset();
    setStatus(null);
  };

  const describedBy = (fieldErrorId: string, hasError: boolean, extra?: string) =>
    [extra, hasError ? fieldErrorId : undefined].filter(Boolean).join(" ") || undefined;

  return (
    <main style={styles.page}>
      <form style={styles.card} onSubmit={handleSubmit} noValidate aria-labelledby={`${id}-title`}>
        <h1 id={`${id}-title`} style={styles.title}>
          Send feedback
        </h1>
        <p style={styles.subtitle}>Tell us what's working, what isn't, or what you'd like to see.</p>

        {status && (
          <div role="status" style={styles.status}>
            {status}
          </div>
        )}

        <div style={styles.field}>
          <label htmlFor={subjectId} style={styles.label}>
            Subject
          </label>
          <input
            id={subjectId}
            name="subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            aria-invalid={errors.subject ? true : undefined}
            aria-describedby={describedBy(`${subjectId}-error`, !!errors.subject)}
            required
            style={{ ...styles.input, borderColor: errors.subject ? "#cf222e" : "#d0d7de" }}
          />
          {errors.subject && (
            <span id={`${subjectId}-error`} style={styles.error}>
              {errors.subject}
            </span>
          )}
        </div>

        <div style={styles.field}>
          <label htmlFor={categoryId} style={styles.label}>
            Category
          </label>
          <select
            id={categoryId}
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "")}
            aria-invalid={errors.category ? true : undefined}
            aria-describedby={describedBy(`${categoryId}-error`, !!errors.category)}
            required
            style={{ ...styles.input, borderColor: errors.category ? "#cf222e" : "#d0d7de" }}
          >
            <option value="" disabled>
              Select a category
            </option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <span id={`${categoryId}-error`} style={styles.error}>
              {errors.category}
            </span>
          )}
        </div>

        <div style={styles.field}>
          <label htmlFor={messageId} style={styles.label}>
            Message
          </label>
          <textarea
            id={messageId}
            name="message"
            value={message}
            maxLength={MESSAGE_LIMIT}
            onChange={(e) => setMessage(e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy(`${messageId}-error`, !!errors.message, messageHelpId)}
            required
            style={{
              ...styles.input,
              ...styles.textarea,
              borderColor: errors.message ? "#cf222e" : "#d0d7de",
            }}
          />
          <div style={styles.helperRow}>
            <span id={messageHelpId}>Limited to {MESSAGE_LIMIT} characters.</span>
            <span aria-hidden="true">
              {message.length}/{MESSAGE_LIMIT}
            </span>
          </div>
          {errors.message && (
            <span id={`${messageId}-error`} style={styles.error}>
              {errors.message}
            </span>
          )}
        </div>

        <div style={styles.actions}>
          <button
            type="button"
            onClick={handleCancel}
            style={{ ...styles.buttonBase, ...styles.secondary }}
          >
            Cancel
          </button>
          <button type="submit" style={{ ...styles.buttonBase, ...styles.primary }}>
            Send feedback
          </button>
        </div>
      </form>
    </main>
  );
}

export default Task;
