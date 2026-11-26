import { useId, useState } from "react";
import { Card, HelperText, Input, Label } from "@ds";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Task() {
  const id = useId();
  const inputId = `${id}-email`;
  const helpId = `${id}-email-help`;

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);

  const invalid = touched && email.trim() !== "" && !EMAIL_PATTERN.test(email.trim());

  return (
    <Card>
      <div className="ds-field">
        <Label htmlFor={inputId}>Email address</Label>
        <Input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="name@example.com"
          value={email}
          invalid={invalid}
          aria-describedby={helpId}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => setTouched(true)}
        />
        <HelperText error={invalid}>
          <span id={helpId} role={invalid ? "alert" : undefined}>
            {invalid
              ? "This email address is invalid. Use the format name@example.com."
              : "We'll use this address to send account updates."}
          </span>
        </HelperText>
      </div>
    </Card>
  );
}
