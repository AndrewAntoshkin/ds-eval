import { useId, useState, type FormEvent } from "react";
import {
  Badge,
  Button,
  Card,
  Checkbox,
  HelperText,
  Input,
  Label,
  PageHeader,
  Radio,
  Select,
  Switch,
  Tabs,
  Textarea,
} from "@ds";

type Settings = {
  name: string;
  email: string;
  bio: string;
  language: string;
  timezone: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  digest: "daily" | "weekly" | "never";
  topics: { mentions: boolean; comments: boolean; productUpdates: boolean };
};

const TABS = ["Profile", "Notifications"];

const INITIAL: Settings = {
  name: "Alex Morgan",
  email: "alex@example.com",
  bio: "",
  language: "en",
  timezone: "UTC",
  emailNotifications: true,
  pushNotifications: false,
  digest: "weekly",
  topics: { mentions: true, comments: true, productUpdates: false },
};

const BIO_MAX = 160;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Errors = Partial<Record<"name" | "email", string>>;

function validate(values: Settings): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Name is required.";
  if (!values.email.trim()) errors.email = "Email is required.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Enter a valid email address.";
  return errors;
}

const sectionTitleStyle = {
  margin: 0,
  fontSize: "var(--font-size-lg)",
  color: "var(--color-text)",
} as const;

const fieldsetStyle = {
  border: 0,
  margin: 0,
  padding: 0,
  display: "grid",
  gap: "var(--space-2)",
} as const;

const legendStyle = {
  padding: 0,
  marginBottom: "var(--space-2)",
  fontSize: "var(--font-size-md)",
  color: "var(--color-text)",
} as const;

export function Task() {
  const ids = useId();
  const nameId = `${ids}-name`;
  const emailId = `${ids}-email`;
  const bioId = `${ids}-bio`;

  const [tab, setTab] = useState(TABS[0]);
  const [saved, setSaved] = useState<Settings>(INITIAL);
  const [values, setValues] = useState<Settings>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<string | null>(null);

  const dirty = JSON.stringify(values) !== JSON.stringify(saved);

  function update<K extends keyof Settings>(key: K, value: Settings[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
    if (key === "name" || key === "email") {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  function updateTopic(key: keyof Settings["topics"], checked: boolean) {
    setValues((prev) => ({ ...prev, topics: { ...prev.topics, [key]: checked } }));
    setStatus(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setTab("Profile");
      setStatus(null);
      return;
    }
    setSaved(values);
    setStatus("Settings saved.");
  }

  function handleCancel() {
    setValues(saved);
    setErrors({});
    setStatus(null);
  }

  return (
    <div className="ds-stack">
      <PageHeader
        title="Settings"
        description="Manage your profile and how we keep you informed."
        actions={dirty ? <Badge>Unsaved changes</Badge> : undefined}
      />

      <Tabs tabs={TABS} value={tab} onChange={setTab} />

      <form onSubmit={handleSubmit} noValidate className="ds-stack">
        <Card>
          {tab === "Profile" ? (
            <div className="ds-stack" role="tabpanel" aria-label="Profile">
              <h2 style={sectionTitleStyle}>Profile</h2>

              <div className="ds-field">
                <Label htmlFor={nameId}>Full name</Label>
                <Input
                  id={nameId}
                  type="text"
                  autoComplete="name"
                  value={values.name}
                  invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? `${nameId}-error` : undefined}
                  onChange={(e) => update("name", e.target.value)}
                />
                {errors.name ? (
                  <span id={`${nameId}-error`}>
                    <HelperText error>{errors.name}</HelperText>
                  </span>
                ) : null}
              </div>

              <div className="ds-field">
                <Label htmlFor={emailId}>Email</Label>
                <Input
                  id={emailId}
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  invalid={Boolean(errors.email)}
                  aria-describedby={`${emailId}-help`}
                  onChange={(e) => update("email", e.target.value)}
                />
                <span id={`${emailId}-help`}>
                  {errors.email ? (
                    <HelperText error>{errors.email}</HelperText>
                  ) : (
                    <HelperText>We use this for sign-in and account notices.</HelperText>
                  )}
                </span>
              </div>

              <div className="ds-field">
                <Label htmlFor={bioId}>Bio</Label>
                <Textarea
                  id={bioId}
                  rows={4}
                  maxLength={BIO_MAX}
                  value={values.bio}
                  aria-describedby={`${bioId}-help`}
                  onChange={(e) => update("bio", e.target.value)}
                />
                <span id={`${bioId}-help`}>
                  <HelperText>
                    {values.bio.length}/{BIO_MAX} characters
                  </HelperText>
                </span>
              </div>

              <Select
                label="Language"
                value={values.language}
                onChange={(e) => update("language", e.target.value)}
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </Select>

              <Select
                label="Time zone"
                helper="Used for scheduling and timestamps."
                value={values.timezone}
                onChange={(e) => update("timezone", e.target.value)}
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time (US)</option>
                <option value="America/Los_Angeles">Pacific Time (US)</option>
                <option value="Europe/London">London</option>
                <option value="Europe/Berlin">Berlin</option>
                <option value="Asia/Tokyo">Tokyo</option>
              </Select>
            </div>
          ) : (
            <div className="ds-stack" role="tabpanel" aria-label="Notifications">
              <h2 style={sectionTitleStyle}>Notifications</h2>

              <Switch
                label="Email notifications"
                checked={values.emailNotifications}
                onChange={(checked) => update("emailNotifications", checked)}
              />
              <Switch
                label="Push notifications"
                checked={values.pushNotifications}
                onChange={(checked) => update("pushNotifications", checked)}
              />

              <fieldset style={fieldsetStyle} disabled={!values.emailNotifications}>
                <legend style={legendStyle}>Email digest</legend>
                <Radio
                  name="digest"
                  value="daily"
                  label="Daily"
                  checked={values.digest === "daily"}
                  onChange={() => update("digest", "daily")}
                />
                <Radio
                  name="digest"
                  value="weekly"
                  label="Weekly"
                  checked={values.digest === "weekly"}
                  onChange={() => update("digest", "weekly")}
                />
                <Radio
                  name="digest"
                  value="never"
                  label="Never"
                  checked={values.digest === "never"}
                  onChange={() => update("digest", "never")}
                />
                {!values.emailNotifications ? (
                  <HelperText>Turn on email notifications to choose a digest.</HelperText>
                ) : null}
              </fieldset>

              <fieldset style={fieldsetStyle}>
                <legend style={legendStyle}>Notify me about</legend>
                <Checkbox
                  name="mentions"
                  label="Mentions"
                  checked={values.topics.mentions}
                  onChange={(e) => updateTopic("mentions", e.target.checked)}
                />
                <Checkbox
                  name="comments"
                  label="Comments on my posts"
                  checked={values.topics.comments}
                  onChange={(e) => updateTopic("comments", e.target.checked)}
                />
                <Checkbox
                  name="productUpdates"
                  label="Product updates"
                  checked={values.topics.productUpdates}
                  onChange={(e) => updateTopic("productUpdates", e.target.checked)}
                />
              </fieldset>
            </div>
          )}
        </Card>

        <div className="ds-row" style={{ alignItems: "center" }}>
          {status ? (
            <span role="status" style={{ marginRight: "auto" }}>
              <HelperText>{status}</HelperText>
            </span>
          ) : null}
          <Button type="button" variant="secondary" onClick={handleCancel} disabled={!dirty}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!dirty}>
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
