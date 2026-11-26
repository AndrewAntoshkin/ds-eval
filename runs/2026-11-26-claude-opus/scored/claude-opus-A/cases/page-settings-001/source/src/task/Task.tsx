import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { ChangeEvent, FormEvent, KeyboardEvent, ReactNode } from "react";

type TabId = "profile" | "notifications";

type Profile = {
  fullName: string;
  email: string;
  username: string;
  bio: string;
  timezone: string;
  language: string;
};

type Notifications = {
  emailProductUpdates: boolean;
  emailSecurityAlerts: boolean;
  emailWeeklySummary: boolean;
  pushMentions: boolean;
  pushComments: boolean;
  pushReminders: boolean;
  digest: "realtime" | "daily" | "weekly" | "never";
};

type Settings = {
  profile: Profile;
  notifications: Notifications;
};

type ProfileErrors = Partial<Record<keyof Profile, string>>;

const INITIAL_SETTINGS: Settings = {
  profile: {
    fullName: "Jordan Lee",
    email: "jordan.lee@example.com",
    username: "jordanlee",
    bio: "",
    timezone: "America/New_York",
    language: "en",
  },
  notifications: {
    emailProductUpdates: true,
    emailSecurityAlerts: true,
    emailWeeklySummary: false,
    pushMentions: true,
    pushComments: true,
    pushReminders: false,
    digest: "daily",
  },
};

const TABS: { id: TabId; label: string }[] = [
  { id: "profile", label: "Profile" },
  { id: "notifications", label: "Notifications" },
];

const TIMEZONES = [
  { value: "America/Los_Angeles", label: "Pacific Time (UTC−08:00)" },
  { value: "America/Denver", label: "Mountain Time (UTC−07:00)" },
  { value: "America/Chicago", label: "Central Time (UTC−06:00)" },
  { value: "America/New_York", label: "Eastern Time (UTC−05:00)" },
  { value: "Europe/London", label: "London (UTC+00:00)" },
  { value: "Europe/Berlin", label: "Berlin (UTC+01:00)" },
  { value: "Asia/Tokyo", label: "Tokyo (UTC+09:00)" },
  { value: "Australia/Sydney", label: "Sydney (UTC+10:00)" },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Español" },
  { value: "fr", label: "Français" },
  { value: "de", label: "Deutsch" },
  { value: "ja", label: "日本語" },
];

const DIGEST_OPTIONS: { value: Notifications["digest"]; label: string; hint: string }[] = [
  { value: "realtime", label: "Real time", hint: "Send each notification as it happens" },
  { value: "daily", label: "Daily digest", hint: "One summary every morning" },
  { value: "weekly", label: "Weekly digest", hint: "One summary every Monday" },
  { value: "never", label: "Never", hint: "Only show notifications in the app" },
];

const BIO_MAX = 160;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^[a-z0-9_-]{3,20}$/i;

function validateProfile(profile: Profile): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!profile.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!profile.email.trim()) errors.email = "Enter your email address.";
  else if (!EMAIL_PATTERN.test(profile.email.trim())) errors.email = "Enter a valid email address.";
  if (!USERNAME_PATTERN.test(profile.username))
    errors.username = "Use 3–20 letters, numbers, dashes or underscores.";
  if (profile.bio.length > BIO_MAX) errors.bio = `Keep your bio under ${BIO_MAX} characters.`;
  return errors;
}

function isEqual(a: Settings, b: Settings): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

const styles = `
.st-root {
  --st-bg: #f6f7f9;
  --st-surface: #ffffff;
  --st-border: #e3e6eb;
  --st-text: #1b1f24;
  --st-muted: #5f6b7a;
  --st-accent: #3b5bdb;
  --st-accent-hover: #2f4ac0;
  --st-accent-soft: #edf1ff;
  --st-danger: #c92a2a;
  --st-success: #2b8a3e;
  --st-radius: 10px;
  --st-focus: 0 0 0 3px rgba(59, 91, 219, 0.35);
  min-height: 100vh;
  background: var(--st-bg);
  color: var(--st-text);
  font-family: Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.5;
  padding: 32px 16px 96px;
  box-sizing: border-box;
}
.st-root *, .st-root *::before, .st-root *::after { box-sizing: border-box; }
.st-container { max-width: 760px; margin: 0 auto; }
.st-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 24px; }
.st-breadcrumb { margin: 0 0 4px; color: var(--st-muted); font-size: 13px; }
.st-title { margin: 0; font-size: 26px; font-weight: 650; letter-spacing: -0.01em; }
.st-subtitle { margin: 6px 0 0; color: var(--st-muted); }
.st-tablist { display: flex; gap: 4px; border-bottom: 1px solid var(--st-border); margin-bottom: 24px; }
.st-tab {
  appearance: none; background: none; border: 0; padding: 10px 14px; margin-bottom: -1px;
  font: inherit; font-weight: 550; color: var(--st-muted); cursor: pointer;
  border-bottom: 2px solid transparent; border-radius: 6px 6px 0 0;
  display: inline-flex; align-items: center; gap: 8px;
}
.st-tab:hover { color: var(--st-text); }
.st-tab:focus-visible { outline: none; box-shadow: var(--st-focus); }
.st-tab[aria-selected="true"] { color: var(--st-accent); border-bottom-color: var(--st-accent); }
.st-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--st-accent); }
.st-card { background: var(--st-surface); border: 1px solid var(--st-border); border-radius: var(--st-radius); margin-bottom: 20px; }
.st-card-header { padding: 18px 20px 0; }
.st-card-title { margin: 0; font-size: 16px; font-weight: 600; }
.st-card-desc { margin: 4px 0 0; color: var(--st-muted); }
.st-card-body { padding: 18px 20px 20px; display: grid; gap: 18px; }
.st-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
@media (max-width: 600px) { .st-grid-2 { grid-template-columns: 1fr; } .st-header { flex-direction: column; } }
.st-field { display: grid; gap: 6px; }
.st-label { font-weight: 550; }
.st-hint { color: var(--st-muted); font-size: 13px; margin: 0; }
.st-error { color: var(--st-danger); font-size: 13px; margin: 0; }
.st-hint-row { display: flex; justify-content: space-between; gap: 12px; }
.st-input, .st-select, .st-textarea {
  width: 100%; font: inherit; color: inherit; background: var(--st-surface);
  border: 1px solid #cfd4dc; border-radius: 8px; padding: 9px 12px;
  transition: border-color 120ms, box-shadow 120ms;
}
.st-textarea { resize: vertical; min-height: 88px; }
.st-input:hover, .st-select:hover, .st-textarea:hover { border-color: #aeb6c2; }
.st-input:focus, .st-select:focus, .st-textarea:focus { outline: none; border-color: var(--st-accent); box-shadow: var(--st-focus); }
.st-input[aria-invalid="true"], .st-textarea[aria-invalid="true"] { border-color: var(--st-danger); }
.st-prefix-wrap { display: flex; }
.st-prefix { display: inline-flex; align-items: center; padding: 0 10px; border: 1px solid #cfd4dc; border-right: 0; border-radius: 8px 0 0 8px; background: var(--st-bg); color: var(--st-muted); }
.st-prefix-wrap .st-input { border-radius: 0 8px 8px 0; }
.st-avatar-row { display: flex; align-items: center; gap: 16px; }
.st-avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--st-accent-soft); color: var(--st-accent); display: grid; place-items: center; font-weight: 650; font-size: 18px; flex-shrink: 0; }
.st-switch-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 12px 0; border-top: 1px solid var(--st-border); }
.st-switch-row:first-child { border-top: 0; padding-top: 0; }
.st-switch-row:last-child { padding-bottom: 0; }
.st-switch-text { display: grid; gap: 2px; }
.st-switch {
  position: relative; flex-shrink: 0; width: 40px; height: 22px; border-radius: 999px; border: 0;
  background: #c4cad3; cursor: pointer; transition: background 150ms; padding: 0;
}
.st-switch::after {
  content: ""; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%;
  background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.25); transition: transform 150ms;
}
.st-switch[aria-checked="true"] { background: var(--st-accent); }
.st-switch[aria-checked="true"]::after { transform: translateX(18px); }
.st-switch:focus-visible { outline: none; box-shadow: var(--st-focus); }
.st-switch:disabled { opacity: 0.55; cursor: not-allowed; }
.st-radio-group { display: grid; gap: 8px; border: 0; padding: 0; margin: 0; }
.st-radio {
  display: flex; align-items: flex-start; gap: 10px; padding: 10px 12px; border: 1px solid var(--st-border);
  border-radius: 8px; cursor: pointer; transition: border-color 120ms, background 120ms;
}
.st-radio:hover { border-color: #aeb6c2; }
.st-radio.is-checked { border-color: var(--st-accent); background: var(--st-accent-soft); }
.st-radio input { margin: 3px 0 0; accent-color: var(--st-accent); }
.st-radio input:focus-visible { outline: none; box-shadow: var(--st-focus); border-radius: 50%; }
.st-btn {
  appearance: none; font: inherit; font-weight: 550; border-radius: 8px; padding: 9px 16px; cursor: pointer;
  border: 1px solid transparent; transition: background 120ms, border-color 120ms, opacity 120ms;
  display: inline-flex; align-items: center; gap: 8px;
}
.st-btn:focus-visible { outline: none; box-shadow: var(--st-focus); }
.st-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.st-btn-primary { background: var(--st-accent); color: #fff; }
.st-btn-primary:hover:not(:disabled) { background: var(--st-accent-hover); }
.st-btn-secondary { background: var(--st-surface); color: var(--st-text); border-color: #cfd4dc; }
.st-btn-secondary:hover:not(:disabled) { background: var(--st-bg); }
.st-footer {
  position: sticky; bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  background: var(--st-surface); border: 1px solid var(--st-border); border-radius: var(--st-radius);
  padding: 12px 16px; box-shadow: 0 6px 20px rgba(16, 24, 40, 0.08);
}
.st-status { color: var(--st-muted); font-size: 13px; }
.st-status.is-success { color: var(--st-success); }
.st-status.is-error { color: var(--st-danger); }
.st-actions { display: flex; gap: 8px; margin-left: auto; }
.st-spinner { width: 14px; height: 14px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.45); border-top-color: #fff; animation: st-spin 700ms linear infinite; }
@keyframes st-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .st-switch, .st-switch::after, .st-spinner { transition: none; animation-duration: 2s; }
}
.st-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
`;

function Card({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  const titleId = useId();
  return (
    <section className="st-card" aria-labelledby={titleId}>
      <div className="st-card-header">
        <h2 id={titleId} className="st-card-title">
          {title}
        </h2>
        {description && <p className="st-card-desc">{description}</p>}
      </div>
      <div className="st-card-body">{children}</div>
    </section>
  );
}

type FieldProps = {
  label: string;
  hint?: ReactNode;
  error?: string;
  trailing?: ReactNode;
  children: (ids: { id: string; describedBy: string | undefined; invalid: boolean }) => ReactNode;
};

function Field({ label, hint, error, trailing, children }: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className="st-field">
      <label className="st-label" htmlFor={id}>
        {label}
      </label>
      {children({ id, describedBy, invalid: Boolean(error) })}
      {(hint || trailing || error) && (
        <div className="st-hint-row">
          <div>
            {error ? (
              <p id={errorId} className="st-error">
                {error}
              </p>
            ) : (
              hint && (
                <p id={hintId} className="st-hint">
                  {hint}
                </p>
              )
            )}
          </div>
          {trailing}
        </div>
      )}
    </div>
  );
}

function SwitchRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const id = useId();
  return (
    <div className="st-switch-row">
      <div className="st-switch-text">
        <span id={`${id}-label`} className="st-label">
          {label}
        </span>
        <span id={`${id}-desc`} className="st-hint">
          {description}
        </span>
      </div>
      <button
        type="button"
        role="switch"
        className="st-switch"
        aria-checked={checked}
        aria-labelledby={`${id}-label`}
        aria-describedby={`${id}-desc`}
        disabled={disabled}
        onClick={() => onChange(!checked)}
      />
    </div>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : "")).toUpperCase();
}

export function Task() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [saved, setSaved] = useState<Settings>(INITIAL_SETTINGS);
  const [draft, setDraft] = useState<Settings>(INITIAL_SETTINGS);
  const [showErrors, setShowErrors] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "success" | "error"; message: string } | null>(null);
  const tabRefs = useRef<Record<TabId, HTMLButtonElement | null>>({ profile: null, notifications: null });
  const baseId = useId();

  const errors = useMemo(() => validateProfile(draft.profile), [draft.profile]);
  const hasErrors = Object.keys(errors).length > 0;
  const visibleErrors = showErrors ? errors : {};
  const isDirty = !isEqual(draft, saved);
  const profileDirty = JSON.stringify(draft.profile) !== JSON.stringify(saved.profile);
  const notificationsDirty = JSON.stringify(draft.notifications) !== JSON.stringify(saved.notifications);

  useEffect(() => {
    if (status?.kind !== "success") return;
    const timer = window.setTimeout(() => setStatus(null), 3000);
    return () => window.clearTimeout(timer);
  }, [status]);

  useEffect(() => {
    if (!isDirty) return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const updateProfile =
    <K extends keyof Profile>(key: K) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value = event.target.value as Profile[K];
      setDraft((prev) => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
      setStatus(null);
    };

  const updateNotification = <K extends keyof Notifications>(key: K, value: Notifications[K]) => {
    setDraft((prev) => ({ ...prev, notifications: { ...prev.notifications, [key]: value } }));
    setStatus(null);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const index = TABS.findIndex((tab) => tab.id === activeTab);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % TABS.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = TABS.length - 1;
    else return;
    event.preventDefault();
    const nextId = TABS[next].id;
    setActiveTab(nextId);
    tabRefs.current[nextId]?.focus();
  };

  const handleCancel = () => {
    setDraft(saved);
    setShowErrors(false);
    setStatus(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isDirty || saving) return;
    if (hasErrors) {
      setShowErrors(true);
      setActiveTab("profile");
      setStatus({ kind: "error", message: "Fix the highlighted fields before saving." });
      return;
    }
    setSaving(true);
    setStatus(null);
    try {
      await new Promise((resolve) => window.setTimeout(resolve, 800));
      const normalized: Settings = {
        ...draft,
        profile: { ...draft.profile, fullName: draft.profile.fullName.trim(), email: draft.profile.email.trim() },
      };
      setSaved(normalized);
      setDraft(normalized);
      setShowErrors(false);
      setStatus({ kind: "success", message: "Your settings have been saved." });
    } catch {
      setStatus({ kind: "error", message: "Something went wrong. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  const emailDisabled = draft.notifications.digest === "never";

  return (
    <div className="st-root">
      <style>{styles}</style>
      <div className="st-container">
        <header className="st-header">
          <div>
            <p className="st-breadcrumb">Account</p>
            <h1 className="st-title">Settings</h1>
            <p className="st-subtitle">Manage your profile and choose how you hear from us.</p>
          </div>
        </header>

        <div role="tablist" aria-label="Settings sections" className="st-tablist">
          {TABS.map((tab) => {
            const selected = tab.id === activeTab;
            const dirty = tab.id === "profile" ? profileDirty : notificationsDirty;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-controls={`${baseId}-panel-${tab.id}`}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                className="st-tab"
                onClick={() => setActiveTab(tab.id)}
                onKeyDown={handleTabKeyDown}
              >
                {tab.label}
                {dirty && (
                  <>
                    <span className="st-dot" aria-hidden="true" />
                    <span className="st-sr-only">(unsaved changes)</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div
            role="tabpanel"
            id={`${baseId}-panel-profile`}
            aria-labelledby={`${baseId}-tab-profile`}
            hidden={activeTab !== "profile"}
            tabIndex={0}
          >
            <Card title="Personal information" description="This information appears on your public profile.">
              <div className="st-avatar-row">
                <div className="st-avatar" aria-hidden="true">
                  {initials(draft.profile.fullName)}
                </div>
                <div>
                  <div className="st-label">{draft.profile.fullName.trim() || "Your name"}</div>
                  <p className="st-hint">Your avatar is generated from your initials.</p>
                </div>
              </div>

              <div className="st-grid-2">
                <Field label="Full name" error={visibleErrors.fullName}>
                  {({ id, describedBy, invalid }) => (
                    <input
                      id={id}
                      className="st-input"
                      type="text"
                      autoComplete="name"
                      value={draft.profile.fullName}
                      onChange={updateProfile("fullName")}
                      aria-invalid={invalid}
                      aria-describedby={describedBy}
                      required
                    />
                  )}
                </Field>
                <Field label="Username" hint="Letters, numbers, dashes and underscores." error={visibleErrors.username}>
                  {({ id, describedBy, invalid }) => (
                    <div className="st-prefix-wrap">
                      <span className="st-prefix" aria-hidden="true">
                        @
                      </span>
                      <input
                        id={id}
                        className="st-input"
                        type="text"
                        autoComplete="username"
                        value={draft.profile.username}
                        onChange={updateProfile("username")}
                        aria-invalid={invalid}
                        aria-describedby={describedBy}
                        required
                      />
                    </div>
                  )}
                </Field>
              </div>

              <Field label="Email address" hint="We'll send account notices here." error={visibleErrors.email}>
                {({ id, describedBy, invalid }) => (
                  <input
                    id={id}
                    className="st-input"
                    type="email"
                    autoComplete="email"
                    value={draft.profile.email}
                    onChange={updateProfile("email")}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                    required
                  />
                )}
              </Field>

              <Field
                label="Bio"
                hint="A short introduction shown on your profile."
                error={visibleErrors.bio}
                trailing={
                  <span
                    className={draft.profile.bio.length > BIO_MAX ? "st-error" : "st-hint"}
                    aria-live="polite"
                  >
                    {draft.profile.bio.length}/{BIO_MAX}
                  </span>
                }
              >
                {({ id, describedBy, invalid }) => (
                  <textarea
                    id={id}
                    className="st-textarea"
                    rows={3}
                    placeholder="Tell people a little about yourself"
                    value={draft.profile.bio}
                    onChange={updateProfile("bio")}
                    aria-invalid={invalid}
                    aria-describedby={describedBy}
                  />
                )}
              </Field>
            </Card>

            <Card title="Preferences" description="Regional settings used across the app.">
              <div className="st-grid-2">
                <Field label="Time zone">
                  {({ id }) => (
                    <select
                      id={id}
                      className="st-select"
                      value={draft.profile.timezone}
                      onChange={updateProfile("timezone")}
                    >
                      {TIMEZONES.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
                <Field label="Language">
                  {({ id }) => (
                    <select
                      id={id}
                      className="st-select"
                      value={draft.profile.language}
                      onChange={updateProfile("language")}
                    >
                      {LANGUAGES.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  )}
                </Field>
              </div>
            </Card>
          </div>

          <div
            role="tabpanel"
            id={`${baseId}-panel-notifications`}
            aria-labelledby={`${baseId}-tab-notifications`}
            hidden={activeTab !== "notifications"}
            tabIndex={0}
          >
            <Card title="Email" description="Choose which emails you'd like to receive.">
              <div>
                <SwitchRow
                  label="Product updates"
                  description="New features, improvements and announcements."
                  checked={draft.notifications.emailProductUpdates}
                  disabled={emailDisabled}
                  onChange={(v) => updateNotification("emailProductUpdates", v)}
                />
                <SwitchRow
                  label="Security alerts"
                  description="Sign-ins from new devices and password changes."
                  checked={draft.notifications.emailSecurityAlerts}
                  disabled={emailDisabled}
                  onChange={(v) => updateNotification("emailSecurityAlerts", v)}
                />
                <SwitchRow
                  label="Weekly summary"
                  description="A recap of activity in your workspace."
                  checked={draft.notifications.emailWeeklySummary}
                  disabled={emailDisabled}
                  onChange={(v) => updateNotification("emailWeeklySummary", v)}
                />
              </div>
            </Card>

            <Card title="Push notifications" description="Alerts delivered to your browser and mobile devices.">
              <div>
                <SwitchRow
                  label="Mentions"
                  description="When someone @mentions you."
                  checked={draft.notifications.pushMentions}
                  onChange={(v) => updateNotification("pushMentions", v)}
                />
                <SwitchRow
                  label="Comments"
                  description="Replies to threads you're following."
                  checked={draft.notifications.pushComments}
                  onChange={(v) => updateNotification("pushComments", v)}
                />
                <SwitchRow
                  label="Reminders"
                  description="Upcoming due dates and scheduled tasks."
                  checked={draft.notifications.pushReminders}
                  onChange={(v) => updateNotification("pushReminders", v)}
                />
              </div>
            </Card>

            <Card title="Email frequency" description="How often we bundle email notifications.">
              <fieldset className="st-radio-group">
                <legend className="st-sr-only">Email frequency</legend>
                {DIGEST_OPTIONS.map((option) => {
                  const checked = draft.notifications.digest === option.value;
                  return (
                    <label key={option.value} className={`st-radio${checked ? " is-checked" : ""}`}>
                      <input
                        type="radio"
                        name={`${baseId}-digest`}
                        value={option.value}
                        checked={checked}
                        onChange={() => updateNotification("digest", option.value)}
                      />
                      <span className="st-switch-text">
                        <span className="st-label">{option.label}</span>
                        <span className="st-hint">{option.hint}</span>
                      </span>
                    </label>
                  );
                })}
              </fieldset>
            </Card>
          </div>

          <div className="st-footer">
            <span
              className={`st-status${status ? ` is-${status.kind}` : ""}`}
              role="status"
              aria-live="polite"
            >
              {status ? status.message : isDirty ? "You have unsaved changes." : "All changes saved."}
            </span>
            <div className="st-actions">
              <button
                type="button"
                className="st-btn st-btn-secondary"
                onClick={handleCancel}
                disabled={!isDirty || saving}
              >
                Cancel
              </button>
              <button type="submit" className="st-btn st-btn-primary" disabled={!isDirty || saving}>
                {saving && <span className="st-spinner" aria-hidden="true" />}
                {saving ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Task;
