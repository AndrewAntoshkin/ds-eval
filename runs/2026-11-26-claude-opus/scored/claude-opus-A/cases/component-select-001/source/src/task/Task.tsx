import { useId, useState, type ChangeEvent, type FormEvent } from "react";

type Country = {
  code: string;
  name: string;
  flag: string;
};

const COUNTRIES: Country[] = [
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "US", name: "United States", flag: "🇺🇸" },
];

type CountrySelectProps = {
  label: string;
  helperText?: string;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

function CountrySelect({
  label,
  helperText,
  error,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  placeholder = "Select a country",
}: CountrySelectProps) {
  const id = useId();
  const selectId = `${id}-select`;
  const helperId = `${id}-helper`;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  const describedBy = [helperText ? helperId : null, hasError ? errorId : null]
    .filter(Boolean)
    .join(" ");

  const selected = COUNTRIES.find((c) => c.code === value);

  return (
    <div className={`cs-field${hasError ? " cs-field--error" : ""}${disabled ? " cs-field--disabled" : ""}`}>
      <label htmlFor={selectId} className="cs-label">
        {label}
        {required && (
          <span className="cs-required" aria-hidden="true">
            *
          </span>
        )}
      </label>

      <div className="cs-control">
        <span className="cs-flag" aria-hidden="true">
          {selected ? selected.flag : "🌐"}
        </span>
        <select
          id={selectId}
          className="cs-select"
          value={value}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={describedBy || undefined}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {COUNTRIES.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
        <svg className="cs-chevron" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {helperText && (
        <p id={helperId} className="cs-helper">
          {helperText}
        </p>
      )}
      {hasError && (
        <p id={errorId} className="cs-error" role="alert">
          <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
            <circle cx="8" cy="8" r="7" fill="currentColor" />
            <path d="M8 4.5v4" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" />
            <circle cx="8" cy="11.25" r="1" fill="#fff" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

const styles = `
.cs-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #f5f6f8;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1f2430;
  box-sizing: border-box;
}
.cs-card {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06), 0 8px 24px rgba(16, 24, 40, 0.08);
}
.cs-title {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 600;
}
.cs-subtitle {
  margin: 0 0 24px;
  font-size: 14px;
  color: #5b6474;
}
.cs-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.cs-label {
  font-size: 14px;
  font-weight: 500;
  color: #1f2430;
}
.cs-required {
  color: #c62828;
  margin-left: 2px;
}
.cs-control {
  position: relative;
  display: flex;
  align-items: center;
}
.cs-flag {
  position: absolute;
  left: 12px;
  font-size: 18px;
  line-height: 1;
  pointer-events: none;
}
.cs-chevron {
  position: absolute;
  right: 12px;
  color: #5b6474;
  pointer-events: none;
}
.cs-select {
  appearance: none;
  -webkit-appearance: none;
  width: 100%;
  height: 44px;
  padding: 0 40px 0 42px;
  font: inherit;
  font-size: 15px;
  color: #1f2430;
  background: #fff;
  border: 1px solid #c9ced8;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
.cs-select:hover {
  border-color: #9aa3b2;
}
.cs-select:focus-visible {
  outline: none;
  border-color: #2f6fed;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.25);
}
.cs-select:invalid,
.cs-select option[value=""] {
  color: #7a8394;
}
.cs-select option {
  color: #1f2430;
}
.cs-field--error .cs-select {
  border-color: #c62828;
}
.cs-field--error .cs-select:focus-visible {
  border-color: #c62828;
  box-shadow: 0 0 0 3px rgba(198, 40, 40, 0.2);
}
.cs-field--error .cs-label {
  color: #b71c1c;
}
.cs-field--disabled .cs-select {
  background: #f0f2f5;
  color: #9aa3b2;
  cursor: not-allowed;
}
.cs-helper {
  margin: 0;
  font-size: 13px;
  color: #5b6474;
}
.cs-error {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #c62828;
}
.cs-actions {
  margin-top: 24px;
  display: flex;
  gap: 12px;
}
.cs-button {
  height: 40px;
  padding: 0 18px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid transparent;
}
.cs-button--primary {
  background: #2f6fed;
  color: #fff;
}
.cs-button--primary:hover {
  background: #255ed0;
}
.cs-button--secondary {
  background: #fff;
  color: #1f2430;
  border-color: #c9ced8;
}
.cs-button--secondary:hover {
  background: #f5f6f8;
}
.cs-button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.35);
}
.cs-success {
  margin: 16px 0 0;
  font-size: 14px;
  color: #1b7f3b;
}
`;

export function Task() {
  const [country, setCountry] = useState("");
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);

  const error = touched && !country ? "Please select a country to continue." : undefined;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched(true);
    if (!country) {
      setSubmitted(null);
      return;
    }
    setSubmitted(COUNTRIES.find((c) => c.code === country)?.name ?? null);
  };

  const handleReset = () => {
    setCountry("");
    setTouched(false);
    setSubmitted(null);
  };

  return (
    <main className="cs-page">
      <style>{styles}</style>
      <form className="cs-card" onSubmit={handleSubmit} noValidate>
        <h1 className="cs-title">Shipping details</h1>
        <p className="cs-subtitle">Tell us where your order should be delivered.</p>

        <CountrySelect
          label="Country"
          helperText="We currently ship to the countries listed."
          error={error}
          value={country}
          onChange={(value) => {
            setCountry(value);
            setSubmitted(null);
          }}
          onBlur={() => setTouched(true)}
          required
        />

        <div className="cs-actions">
          <button type="submit" className="cs-button cs-button--primary">
            Continue
          </button>
          <button type="button" className="cs-button cs-button--secondary" onClick={handleReset}>
            Reset
          </button>
        </div>

        {submitted && (
          <p className="cs-success" role="status">
            Shipping to {submitted}.
          </p>
        )}
      </form>
    </main>
  );
}

export default Task;
