import { useId, useState, type ChangeEvent, type FormEvent } from "react";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const styles = `
.email-field-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  box-sizing: border-box;
  background: #f6f7f9;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1a1d23;
}
.email-field-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  border: 1px solid #e3e6ea;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.05);
}
.email-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.email-field__label {
  font-size: 14px;
  font-weight: 600;
  line-height: 20px;
}
.email-field__input {
  font: inherit;
  font-size: 16px;
  line-height: 24px;
  padding: 10px 12px;
  border: 1px solid #c4c9d1;
  border-radius: 8px;
  background: #ffffff;
  color: inherit;
  transition: border-color 120ms ease, box-shadow 120ms ease;
}
.email-field__input::placeholder {
  color: #8a919c;
}
.email-field__input:hover {
  border-color: #9aa1ab;
}
.email-field__input:focus-visible {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}
.email-field__input[aria-invalid="true"] {
  border-color: #d92d20;
}
.email-field__input[aria-invalid="true"]:focus-visible {
  box-shadow: 0 0 0 3px rgba(217, 45, 32, 0.25);
}
.email-field__helper {
  margin: 0;
  font-size: 13px;
  line-height: 18px;
  color: #5b6370;
}
.email-field__error {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  line-height: 18px;
  color: #b42318;
}
.email-field__submit {
  margin-top: 20px;
  width: 100%;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background: #2563eb;
  color: #ffffff;
  cursor: pointer;
}
.email-field__submit:hover {
  background: #1d4ed8;
}
.email-field__submit:focus-visible {
  outline: 2px solid #1d4ed8;
  outline-offset: 2px;
}
.email-field__success {
  margin: 12px 0 0;
  font-size: 13px;
  color: #067647;
}
`;

function validate(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return "Enter your email address.";
  if (!EMAIL_PATTERN.test(trimmed)) {
    return "This email address is invalid. Use a format like name@example.com.";
  }
  return null;
}

export function Task() {
  const id = useId();
  const inputId = `${id}-email`;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;

  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const error = touched ? validate(value) : null;
  const hasError = error !== null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    const result = validate(value);
    if (result) {
      document.getElementById(inputId)?.focus();
      setSubmitted(false);
      return;
    }
    setSubmitted(true);
  };

  return (
    <main className="email-field-page">
      <style>{styles}</style>
      <form className="email-field-card" noValidate onSubmit={handleSubmit}>
        <div className="email-field">
          <label className="email-field__label" htmlFor={inputId}>
            Email address
          </label>
          <input
            id={inputId}
            className="email-field__input"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder="name@example.com"
            value={value}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${errorId} ${helperId}` : helperId}
          />
          {hasError && (
            <p id={errorId} className="email-field__error" role="alert">
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
                focusable="false"
              >
                <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
                <path d="M8 4.5v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="8" cy="11.25" r="0.9" fill="currentColor" />
              </svg>
              {error}
            </p>
          )}
          <p id={helperId} className="email-field__helper">
            We'll only use this to send you account updates.
          </p>
        </div>
        <button type="submit" className="email-field__submit">
          Continue
        </button>
        {submitted && (
          <p className="email-field__success" role="status">
            Thanks! Your email address looks good.
          </p>
        )}
      </form>
    </main>
  );
}

export default Task;
