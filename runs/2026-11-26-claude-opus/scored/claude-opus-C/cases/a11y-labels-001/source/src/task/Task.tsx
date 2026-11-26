import { useId, useState, type FormEvent } from "react";
import { Button, Card, Checkbox, HelperText, Input, Label, PageHeader } from "@ds";

type Errors = {
  email?: string;
  password?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
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
  const baseId = useId();
  const emailId = `${baseId}-email`;
  const emailMessageId = `${baseId}-email-message`;
  const passwordId = `${baseId}-password`;
  const passwordMessageId = `${baseId}-password-message`;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    setSubmitted(true);

    if (nextErrors.email) {
      document.getElementById(emailId)?.focus();
      setSignedIn(false);
      return;
    }
    if (nextErrors.password) {
      document.getElementById(passwordId)?.focus();
      setSignedIn(false);
      return;
    }
    setSignedIn(true);
  };

  const revalidate = (nextEmail: string, nextPassword: string) => {
    if (submitted) {
      setErrors(validate(nextEmail, nextPassword));
    }
  };

  return (
    <div className="ds-stack" style={{ maxWidth: "28rem", margin: "0 auto" }}>
      <PageHeader title="Sign in" description="Use your work email and password to continue." />

      <Card>
        <form className="ds-stack" noValidate onSubmit={handleSubmit} aria-label="Sign in">
          <div className="ds-field">
            <Label htmlFor={emailId}>Email</Label>
            <Input
              id={emailId}
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              invalid={Boolean(errors.email)}
              aria-describedby={emailMessageId}
              aria-errormessage={errors.email ? emailMessageId : undefined}
              onChange={(event) => {
                setEmail(event.target.value);
                revalidate(event.target.value, password);
              }}
            />
            <div id={emailMessageId} aria-live="polite">
              {errors.email ? (
                <HelperText error>{errors.email}</HelperText>
              ) : (
                <HelperText>We'll never share your email.</HelperText>
              )}
            </div>
          </div>

          <div className="ds-field">
            <Label htmlFor={passwordId}>Password</Label>
            <Input
              id={passwordId}
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              invalid={Boolean(errors.password)}
              aria-describedby={passwordMessageId}
              aria-errormessage={errors.password ? passwordMessageId : undefined}
              onChange={(event) => {
                setPassword(event.target.value);
                revalidate(email, event.target.value);
              }}
            />
            <div id={passwordMessageId} aria-live="polite">
              {errors.password ? (
                <HelperText error>{errors.password}</HelperText>
              ) : (
                <HelperText>At least 8 characters.</HelperText>
              )}
            </div>
          </div>

          <Checkbox
            label="Remember me"
            name="remember"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />

          <div className="ds-row">
            <Button type="submit" variant="primary">
              Sign in
            </Button>
          </div>

          <div role="status" aria-live="polite">
            {signedIn && <HelperText>Signed in as {email.trim()}.</HelperText>}
          </div>
        </form>
      </Card>
    </div>
  );
}
