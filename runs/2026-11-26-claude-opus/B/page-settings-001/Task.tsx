import { useState } from "react";
import {
  Button,
  Card,
  Checkbox,
  Field,
  Input,
  PageHeader,
  Select,
  Switch,
  Tabs,
  Textarea,
} from "@ds";

type TabId = "profile" | "notifications";

interface ProfileState {
  name: string;
  email: string;
  bio: string;
  timezone: string;
}

interface NotificationState {
  emailUpdates: boolean;
  pushNotifications: boolean;
  weeklyDigest: boolean;
  mentionsOnly: boolean;
  frequency: string;
}

const initialProfile: ProfileState = {
  name: "Alex Morgan",
  email: "alex@example.com",
  bio: "",
  timezone: "utc",
};

const initialNotifications: NotificationState = {
  emailUpdates: true,
  pushNotifications: false,
  weeklyDigest: true,
  mentionsOnly: false,
  frequency: "daily",
};

const timezoneOptions = [
  { value: "utc", label: "UTC" },
  { value: "america-new_york", label: "Eastern Time (US)" },
  { value: "america-los_angeles", label: "Pacific Time (US)" },
  { value: "europe-london", label: "London" },
  { value: "europe-berlin", label: "Berlin" },
  { value: "asia-tokyo", label: "Tokyo" },
];

const frequencyOptions = [
  { value: "realtime", label: "Real time" },
  { value: "daily", label: "Daily summary" },
  { value: "weekly", label: "Weekly summary" },
];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function Task() {
  const [tab, setTab] = useState<TabId>("profile");
  const [profile, setProfile] = useState<ProfileState>(initialProfile);
  const [notifications, setNotifications] =
    useState<NotificationState>(initialNotifications);
  const [savedProfile, setSavedProfile] = useState<ProfileState>(initialProfile);
  const [savedNotifications, setSavedNotifications] =
    useState<NotificationState>(initialNotifications);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const nameError =
    submitted && profile.name.trim() === "" ? "Name is required." : undefined;
  const emailError =
    submitted && !EMAIL_PATTERN.test(profile.email.trim())
      ? "Enter a valid email address."
      : undefined;

  const isDirty =
    JSON.stringify(profile) !== JSON.stringify(savedProfile) ||
    JSON.stringify(notifications) !== JSON.stringify(savedNotifications);

  const updateProfile = <K extends keyof ProfileState>(
    key: K,
    value: ProfileState[K],
  ) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  };

  const updateNotifications = <K extends keyof NotificationState>(
    key: K,
    value: NotificationState[K],
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    setStatus(null);
  };

  const handleSave = () => {
    setSubmitted(true);
    const valid =
      profile.name.trim() !== "" && EMAIL_PATTERN.test(profile.email.trim());
    if (!valid) {
      setTab("profile");
      setStatus(null);
      return;
    }
    setSavedProfile(profile);
    setSavedNotifications(notifications);
    setSubmitted(false);
    setStatus("Settings saved.");
  };

  const handleCancel = () => {
    setProfile(savedProfile);
    setNotifications(savedNotifications);
    setSubmitted(false);
    setStatus(null);
  };

  return (
    <main className="ds-stack" style={{ padding: "var(--space-6)" }}>
      <PageHeader
        title="Settings"
        description="Manage your profile and how we keep you informed."
      />

      <Tabs
        tabs={[
          { id: "profile", label: "Profile" },
          { id: "notifications", label: "Notifications" },
        ]}
        value={tab}
        onChange={(id: string) => setTab(id as TabId)}
      />

      <Card>
        {tab === "profile" ? (
          <form
            className="ds-stack"
            onSubmit={(event) => {
              event.preventDefault();
              handleSave();
            }}
          >
            <Field
              label="Full name"
              htmlFor="settings-name"
              error={nameError}
            >
              <Input
                id="settings-name"
                value={profile.name}
                invalid={Boolean(nameError)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  updateProfile("name", event.target.value)
                }
              />
            </Field>

            <Field
              label="Email"
              htmlFor="settings-email"
              helper="We use this address for account notices."
              error={emailError}
            >
              <Input
                id="settings-email"
                type="email"
                value={profile.email}
                invalid={Boolean(emailError)}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  updateProfile("email", event.target.value)
                }
              />
            </Field>

            <Field
              label="Bio"
              htmlFor="settings-bio"
              helper="A short description shown on your profile."
            >
              <Textarea
                id="settings-bio"
                rows={4}
                value={profile.bio}
                onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
                  updateProfile("bio", event.target.value)
                }
              />
            </Field>

            <Select
              id="settings-timezone"
              label="Time zone"
              helperText="Used for scheduling and timestamps."
              options={timezoneOptions}
              value={profile.timezone}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                updateProfile("timezone", event.target.value)
              }
            />
          </form>
        ) : (
          <div className="ds-stack">
            <Switch
              label="Email updates"
              checked={notifications.emailUpdates}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateNotifications("emailUpdates", event.target.checked)
              }
            />
            <Switch
              label="Push notifications"
              checked={notifications.pushNotifications}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateNotifications("pushNotifications", event.target.checked)
              }
            />
            <Select
              id="settings-frequency"
              label="Email frequency"
              helperText="How often we bundle updates into an email."
              options={frequencyOptions}
              value={notifications.frequency}
              disabled={!notifications.emailUpdates}
              onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                updateNotifications("frequency", event.target.value)
              }
            />
            <Checkbox
              label="Send me a weekly digest"
              checked={notifications.weeklyDigest}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateNotifications("weeklyDigest", event.target.checked)
              }
            />
            <Checkbox
              label="Only notify me when I'm mentioned"
              checked={notifications.mentionsOnly}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                updateNotifications("mentionsOnly", event.target.checked)
              }
            />
          </div>
        )}
      </Card>

      <div className="ds-row" style={{ alignItems: "center" }}>
        {status && (
          <span
            role="status"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "var(--font-size-sm)",
              marginRight: "auto",
            }}
          >
            {status}
          </span>
        )}
        <Button variant="secondary" onClick={handleCancel} disabled={!isDirty}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!isDirty}>
          Save changes
        </Button>
      </div>
    </main>
  );
}

export default Task;
