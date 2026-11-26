import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button, Card, HelperText, Input, Label, PageHeader } from "@ds";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Task() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const isValid = EMAIL_PATTERN.test(email.trim());
  const showError = touched && !isValid;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Contact details"
        description="We use this address for account notifications."
      />
      <Card>
        <form className="ds-stack" onSubmit={handleSubmit} noValidate>
          <div className="ds-stack" style={{ gap: "var(--space-1)" }}>
            <Label htmlFor="task-email">Email address</Label>
            <Input
              id="task-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={handleChange}
              onBlur={() => setTouched(true)}
              invalid={showError}
              aria-invalid={showError}
              aria-describedby="task-email-helper"
            />
            <HelperText id="task-email-helper" error={showError}>
              {showError
                ? "This email address is invalid. Use a format like name@example.com."
                : "We'll never share your email with anyone."}
            </HelperText>
          </div>
          <div className="ds-row">
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default Task;
