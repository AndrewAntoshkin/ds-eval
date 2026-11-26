import { useState, type ChangeEvent, type FormEvent } from "react";
import {
  Button,
  Card,
  Checkbox,
  HelperText,
  Label,
  PageHeader,
  Radio,
  Switch,
} from "@ds";

type Digest = "daily" | "weekly" | "never";

const DIGEST_OPTIONS: { value: Digest; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "never", label: "Never" },
];

function readChecked(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  return Boolean((value as ChangeEvent<HTMLInputElement>)?.target?.checked);
}

export function Task() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [digest, setDigest] = useState<Digest>("weekly");
  const [productUpdates, setProductUpdates] = useState(false);
  const [saved, setSaved] = useState(false);

  const markDirty = () => setSaved(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <div
      className="ds-stack"
      style={{
        maxWidth: "40rem",
        margin: "0 auto",
        padding: "var(--space-6) var(--space-4)",
      }}
    >
      <PageHeader
        title="Notification preferences"
        description="Choose how and how often we get in touch with you."
      />

      <form onSubmit={handleSubmit} className="ds-stack">
        <Card>
          <div className="ds-stack">
            <Switch
              label="Email notifications"
              checked={emailEnabled}
              onChange={(value: unknown) => {
                setEmailEnabled(readChecked(value));
                markDirty();
              }}
            />
            <Switch
              label="Push notifications"
              checked={pushEnabled}
              onChange={(value: unknown) => {
                setPushEnabled(readChecked(value));
                markDirty();
              }}
            />
          </div>
        </Card>

        <Card>
          <fieldset
            className="ds-stack"
            style={{ border: 0, margin: 0, padding: 0, minWidth: 0 }}
          >
            <legend style={{ padding: 0, marginBottom: "var(--space-2)" }}>
              <Label>Digest frequency</Label>
            </legend>
            {DIGEST_OPTIONS.map((option) => (
              <Radio
                key={option.value}
                name="digest-frequency"
                value={option.value}
                label={option.label}
                checked={digest === option.value}
                onChange={(value: unknown) => {
                  if (readChecked(value) || value === option.value) {
                    setDigest(option.value);
                    markDirty();
                  }
                }}
              />
            ))}
            <HelperText>
              A summary of activity sent to you on a regular schedule.
            </HelperText>
          </fieldset>
        </Card>

        <Card>
          <div className="ds-stack">
            <Checkbox
              label="Send me product update emails"
              checked={productUpdates}
              onChange={(value: unknown) => {
                setProductUpdates(readChecked(value));
                markDirty();
              }}
            />
            <HelperText>
              Occasional news about new features and improvements.
            </HelperText>
          </div>
        </Card>

        <div className="ds-row">
          {saved && <HelperText role="status">Preferences saved.</HelperText>}
          <Button type="submit" variant="primary">
            Save preferences
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Task;
