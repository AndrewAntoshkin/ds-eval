import { useId, useRef, useState, type CSSProperties, type FormEvent } from "react";

type Fields = { email: string; password: string };
type Errors = Partial<Record<keyof Fields, string>>;

function validate(values: Fields): Errors {
  const errors: Errors = {};
  const email = values.email.trim();
  if (!email) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter an email address in the format name@example.com.";
  }
  if (!values.password) {
    errors.password = "Enter your password.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    background: "#f4f5f7",
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#1a1d23",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    background: "#ffffff",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)",
    padding: "32px",
    boxSizing: "border-box",
  },
  title: { margin: "0 0 4px", fontSize: 24, fontWeight: 600 },
  subtitle: { margin: "0 0 24px", fontSize: 14, color: "#5a6170" },
  field: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 600 },
  input: {
    font: "inherit",
    fontSize: 16,
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #b8bec9",
    outlineOffset: 2,
    boxSizing: "border-box",
    width: "100%",
  },
  inputInvalid: { border: "2px solid #c62828", padding: "9px 11px" },
  error: {
    display: "flex",
    gap: 6,
    margin: 0,
    fontSize: 14,
    color: "#b71c1c",
  },
  summary: {
    margin: "0 0 20px",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #e0a8a8",
    background: "#fdecec",
    color: "#7f1414",
    fontSize: 14,
  },
  success: {
    margin: "0 0 20px",
    padding: "12px 14px",
    borderRadius: 8,
    border: "1px solid #a5d6a7",
    background: "#edf7ee",
    color: "#1b5e20",
    fontSize: 14,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    fontSize: 14,
  },
  button: {
    width: "100%",
    font: "inherit",
    fontSize: 16,
    fontWeight: 600,
    padding: "12px 16px",
    border: "none",
    borderRadius: 8,
    background: "#1f5fd1",
    color: "#ffffff",
    cursor: "pointer",
  },
  hint: { margin: 0, fontSize: 13, color: "#5a6170" },
};

export function Task() {
  const id = useId();
  const emailId = `${id}-email`;
  const passwordId = `${id}-password`;
  const rememberId = `${id}-remember`;
  const emailErrorId = `${emailId}-error`;
  const passwordErrorId = `${passwordId}-error`;
  const passwordHintId = `${passwordId}-hint`;

  const [values, setValues] = useState<Fields>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [remember, setRemember] = useState(false);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const update = (name: keyof Fields, value: string) => {
    const next = { ...values, [name]: value };
    setValues(next);
    setSuccess(false);
    if (submitted) setErrors(validate(next));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (nextErrors.email) {
      emailRef.current?.focus();
      setSuccess(false);
      return;
    }
    if (nextErrors.password) {
      passwordRef.current?.focus();
      setSuccess(false);
      return;
    }
    setSuccess(true);
  };

  const errorCount = Object.values(errors).filter(Boolean).length;

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Sign in</h1>
        <p style={styles.subtitle}>Welcome back. Enter your details to continue.</p>

        <div aria-live="polite">
          {submitted && errorCount > 0 && (
            <p style={styles.summary}>
              {errorCount === 1
                ? "There is 1 problem with the form."
                : `There are ${errorCount} problems with the form.`}
            </p>
          )}
          {success && <p style={styles.success}>Signed in successfully.</p>}
        </div>

        <form noValidate onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label htmlFor={emailId} style={styles.label}>
              Email address
            </label>
            <input
              ref={emailRef}
              id={emailId}
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={values.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? emailErrorId : undefined}
              style={{ ...styles.input, ...(errors.email ? styles.inputInvalid : null) }}
            />
            {errors.email && (
              <p id={emailErrorId} style={styles.error}>
                <span aria-hidden="true">⚠</span>
                <span>{errors.email}</span>
              </p>
            )}
          </div>

          <div style={styles.field}>
            <label htmlFor={passwordId} style={styles.label}>
              Password
            </label>
            <p id={passwordHintId} style={styles.hint}>
              At least 8 characters.
            </p>
            <input
              ref={passwordRef}
              id={passwordId}
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
              value={values.password}
              onChange={(e) => update("password", e.target.value)}
              aria-invalid={errors.password ? true : undefined}
              aria-describedby={
                errors.password ? `${passwordErrorId} ${passwordHintId}` : passwordHintId
              }
              style={{ ...styles.input, ...(errors.password ? styles.inputInvalid : null) }}
            />
            {errors.password && (
              <p id={passwordErrorId} style={styles.error}>
                <span aria-hidden="true">⚠</span>
                <span>{errors.password}</span>
              </p>
            )}
          </div>

          <div style={styles.checkboxRow}>
            <input
              id={rememberId}
              name="remember"
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <label htmlFor={rememberId}>Keep me signed in</label>
          </div>

          <button type="submit" style={styles.button}>
            Sign in
          </button>
        </form>
      </div>
    </main>
  );
}

export default Task;
