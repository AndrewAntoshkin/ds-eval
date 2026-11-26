import { useState, type CSSProperties, type FormEvent } from "react";

type DigestFrequency = "daily" | "weekly" | "never";

interface Preferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  digest: DigestFrequency;
  productUpdates: boolean;
}

const DEFAULT_PREFERENCES: Preferences = {
  emailEnabled: true,
  pushEnabled: false,
  digest: "weekly",
  productUpdates: false,
};

const DIGEST_OPTIONS: { value: DigestFrequency; label: string; description: string }[] = [
  { value: "daily", label: "Daily", description: "One summary every morning" },
  { value: "weekly", label: "Weekly", description: "One summary every Monday" },
  { value: "never", label: "Never", description: "Don't send digests" },
];

const css = `
.np-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 48px 16px;
  background: #f5f6f8;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  color: #1c1f24;
  box-sizing: border-box;
}
.np-card {
  width: 100%;
  max-width: 520px;
  background: #fff;
  border: 1px solid #e3e5e9;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(16, 24, 40, 0.06);
  padding: 28px;
  box-sizing: border-box;
}
.np-card h1 { margin: 0 0 4px; font-size: 1.375rem; font-weight: 600; }
.np-subtitle { margin: 0 0 24px; color: #5b6270; font-size: 0.9375rem; }
.np-section { border: 0; margin: 0 0 24px; padding: 0; min-width: 0; }
.np-section legend, .np-section-title {
  padding: 0; margin-bottom: 12px; font-size: 0.8125rem; font-weight: 600;
  text-transform: uppercase; letter-spacing: 0.04em; color: #5b6270;
}
.np-row {
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 12px 0; border-top: 1px solid #eef0f3;
}
.np-row:first-of-type { border-top: 0; }
.np-row-text { display: flex; flex-direction: column; gap: 2px; }
.np-label { font-weight: 500; font-size: 0.9375rem; cursor: pointer; }
.np-hint { color: #6b7280; font-size: 0.8125rem; }
.np-switch {
  position: relative; flex-shrink: 0; width: 44px; height: 24px; padding: 0;
  border: 0; border-radius: 999px; background: #c9ced6; cursor: pointer;
  transition: background-color 150ms ease;
}
.np-switch[aria-checked="true"] { background: #2563eb; }
.np-switch::after {
  content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px;
  border-radius: 50%; background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.2);
  transition: transform 150ms ease;
}
.np-switch[aria-checked="true"]::after { transform: translateX(20px); }
.np-switch:focus-visible, .np-radio input:focus-visible + .np-radio-body,
.np-checkbox input:focus-visible, .np-button:focus-visible {
  outline: 2px solid #2563eb; outline-offset: 2px;
}
.np-radios { display: grid; gap: 8px; }
.np-radio { display: block; cursor: pointer; }
.np-radio input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.np-radio-body {
  display: flex; align-items: center; gap: 12px; padding: 12px 14px;
  border: 1px solid #dfe2e7; border-radius: 8px; transition: border-color 120ms, background 120ms;
}
.np-radio-dot {
  flex-shrink: 0; width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid #9aa1ad; box-sizing: border-box;
}
.np-radio input:checked + .np-radio-body { border-color: #2563eb; background: #f0f5ff; }
.np-radio input:checked + .np-radio-body .np-radio-dot {
  border-color: #2563eb; background: radial-gradient(circle, #2563eb 0 3.5px, transparent 4px);
}
.np-checkbox { display: flex; align-items: flex-start; gap: 10px; cursor: pointer; }
.np-checkbox input { margin: 3px 0 0; width: 16px; height: 16px; accent-color: #2563eb; cursor: pointer; }
.np-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 12px;
  padding-top: 20px; border-top: 1px solid #eef0f3;
}
.np-status { color: #15803d; font-size: 0.875rem; margin-right: auto; }
.np-button {
  padding: 10px 18px; border: 0; border-radius: 8px; background: #2563eb; color: #fff;
  font: inherit; font-weight: 600; font-size: 0.9375rem; cursor: pointer;
  transition: background-color 120ms ease;
}
.np-button:hover:not(:disabled) { background: #1d4ed8; }
.np-button:disabled { background: #93b0ef; cursor: not-allowed; }
.np-disabled { opacity: 0.55; }
`;

const visuallyHidden: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
};

interface ToggleRowProps {
  id: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function ToggleRow({ id, label, hint, checked, onChange }: ToggleRowProps) {
  return (
    <div className="np-row">
      <div className="np-row-text">
        <label id={`${id}-label`} htmlFor={id} className="np-label">
          {label}
        </label>
        <span id={`${id}-hint`} className="np-hint">
          {hint}
        </span>
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-hint`}
        className="np-switch"
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

export function Task() {
  const [prefs, setPrefs] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [saved, setSaved] = useState<Preferences>(DEFAULT_PREFERENCES);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");

  const isDirty =
    prefs.emailEnabled !== saved.emailEnabled ||
    prefs.pushEnabled !== saved.pushEnabled ||
    prefs.digest !== saved.digest ||
    prefs.productUpdates !== saved.productUpdates;

  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    setStatus("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setStatus("");
    await new Promise((resolve) => setTimeout(resolve, 600));
    setSaved(prefs);
    setSaving(false);
    setStatus("Preferences saved.");
  };

  const emailOff = !prefs.emailEnabled;

  return (
    <main className="np-page">
      <style>{css}</style>
      <form className="np-card" onSubmit={handleSubmit} noValidate>
        <h1>Notification preferences</h1>
        <p className="np-subtitle">Choose how and when we get in touch with you.</p>

        <section className="np-section" aria-labelledby="np-channels-title">
          <h2 id="np-channels-title" className="np-section-title" style={{ margin: "0 0 4px" }}>
            Channels
          </h2>
          <ToggleRow
            id="np-email"
            label="Email notifications"
            hint="Account activity and alerts sent to your inbox"
            checked={prefs.emailEnabled}
            onChange={(v) => update("emailEnabled", v)}
          />
          <ToggleRow
            id="np-push"
            label="Push notifications"
            hint="Real-time alerts on your devices"
            checked={prefs.pushEnabled}
            onChange={(v) => update("pushEnabled", v)}
          />
        </section>

        <fieldset className="np-section">
          <legend>Digest frequency</legend>
          <div className="np-radios">
            {DIGEST_OPTIONS.map((option) => (
              <label key={option.value} className="np-radio">
                <input
                  type="radio"
                  name="digest"
                  value={option.value}
                  checked={prefs.digest === option.value}
                  onChange={() => update("digest", option.value)}
                />
                <span className="np-radio-body">
                  <span className="np-radio-dot" aria-hidden="true" />
                  <span className="np-row-text">
                    <span className="np-label">{option.label}</span>
                    <span className="np-hint">{option.description}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="np-section">
          <legend>Marketing</legend>
          <label className={`np-checkbox${emailOff ? " np-disabled" : ""}`}>
            <input
              type="checkbox"
              checked={prefs.productUpdates}
              disabled={emailOff}
              aria-describedby="np-updates-hint"
              onChange={(e) => update("productUpdates", e.target.checked)}
            />
            <span className="np-row-text">
              <span className="np-label">Send me product update emails</span>
              <span id="np-updates-hint" className="np-hint">
                {emailOff
                  ? "Turn on email notifications to receive product updates."
                  : "New features, improvements and occasional announcements."}
              </span>
            </span>
          </label>
        </fieldset>

        <div className="np-footer">
          <span className="np-status" role="status" aria-live="polite">
            {status}
          </span>
          <span style={visuallyHidden} aria-live="polite">
            {saving ? "Saving preferences" : ""}
          </span>
          <button type="submit" className="np-button" disabled={saving || !isDirty}>
            {saving ? "Saving…" : "Save preferences"}
          </button>
        </div>
      </form>
    </main>
  );
}

export default Task;
