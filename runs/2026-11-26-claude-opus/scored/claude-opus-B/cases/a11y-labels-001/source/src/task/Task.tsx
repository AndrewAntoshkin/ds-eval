import { useState, type FormEvent } from "react";
import { Button, Card, Checkbox, HelperText, Input, Label, PageHeader } from "@ds";

type Errors = {
  email?: string;
  password?: string;
};

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "Enter a valid email address, like name@example.com.";
  }
  if (!password) {
    errors.password = "Enter your password.";
  } else if (password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }
  return errors;
}

export function Task() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    setSubmitted(true);

    if (nextErrors.email) {
      document.getElementById("login-email")?.focus();
      setStatus(null);
      return;
    }
    if (nextErrors.password) {
      document.getElementById("login-password")?.focus();
      setStatus(null);
      return;
    }
    setStatus(`Signed in as ${email.trim()}.`);
  };

  const revalidate = (nextEmail: string, nextPassword: string) => {
    if (submitted) setErrors(validate(nextEmail, nextPassword));
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-sans)",
        padding: "var(--space-6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }} className="ds-stack">
        <PageHeader title="Sign in" description="Use your work email and password to continue." />

        <Card>
          <form className="ds-stack" onSubmit={handleSubmit} noValidate aria-label="Sign in">
            <div className="ds-stack" style={{ gap: "var(--space-2)" }}>
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                invalid={Boolean(errors.email)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "login-email-error" : "login-email-hint"}
                aria-required="true"
                onChange={(e) => {
                  setEmail(e.target.value);
                  revalidate(e.target.value, password);
                }}
              />
              {errors.email ? (
                <HelperText id="login-email-error" error>
                  {errors.email}
                </HelperText>
              ) : (
                <HelperText id="login-email-hint">The address you registered with.</HelperText>
              )}
            </div>

            <div className="ds-stack" style={{ gap: "var(--space-2)" }}>
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                invalid={Boolean(errors.password)}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "login-password-error" : "login-password-hint"}
                aria-required="true"
                onChange={(e) => {
                  setPassword(e.target.value);
                  revalidate(email, e.target.value);
                }}
              />
              {errors.password ? (
                <HelperText id="login-password-error" error>
                  {errors.password}
                </HelperText>
              ) : (
                <HelperText id="login-password-hint">At least 8 characters.</HelperText>
              )}
            </div>

            <Checkbox
              label="Keep me signed in"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />

            <div className="ds-row">
              <Button type="submit" variant="primary">
                Sign in
              </Button>
            </div>

            <p
              role="status"
              aria-live="polite"
              style={{
                margin: 0,
                color: "var(--color-text-muted)",
                fontSize: "var(--font-size-sm)",
              }}
            >
              {status}
            </p>
          </form>
        </Card>
      </div>
    </main>
  );
}

export default Task;
