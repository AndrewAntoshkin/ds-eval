import { useState, type FormEvent } from "react";
import { Button, Card, HelperText, PageHeader, Radio, Checkbox, Switch } from "@ds";

type DigestFrequency = "daily" | "weekly" | "never";

const DIGEST_OPTIONS: { value: DigestFrequency; label: string }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "never", label: "Never" },
];

export function Task() {
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [digest, setDigest] = useState<DigestFrequency>("weekly");
  const [productUpdates, setProductUpdates] = useState(false);
  const [saved, setSaved] = useState(false);

  const markDirty = () => setSaved(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaved(true);
  };

  return (
    <div className="ds-stack">
      <PageHeader
        title="Notification preferences"
        description="Choose how and how often we contact you."
      />

      <Card>
        <form className="ds-stack" onSubmit={handleSubmit} noValidate>
          <div className="ds-stack">
            <Switch
              label="Email notifications"
              checked={emailEnabled}
              onChange={(value) => {
                setEmailEnabled(value);
                markDirty();
              }}
            />
            <Switch
              label="Push notifications"
              checked={pushEnabled}
              onChange={(value) => {
                setPushEnabled(value);
                markDirty();
              }}
            />
          </div>

          <fieldset
            className="ds-field"
            style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}
          >
            <legend className="ds-label">Digest frequency</legend>
            <div className="ds-stack" role="radiogroup" aria-describedby="digest-help">
              {DIGEST_OPTIONS.map((option) => (
                <Radio
                  key={option.value}
                  name="digest-frequency"
                  value={option.value}
                  label={option.label}
                  checked={digest === option.value}
                  onChange={() => {
                    setDigest(option.value);
                    markDirty();
                  }}
                />
              ))}
            </div>
            <HelperText>
              <span id="digest-help">A summary of activity you may have missed.</span>
            </HelperText>
          </fieldset>

          <Checkbox
            label="Send me product update emails"
            name="product-updates"
            checked={productUpdates}
            onChange={(event) => {
              setProductUpdates(event.target.checked);
              markDirty();
            }}
          />

          <div className="ds-row">
            <Button type="submit" variant="primary">
              Save preferences
            </Button>
          </div>

          {saved && (
            <div role="status" aria-live="polite">
              <HelperText>Your notification preferences have been saved.</HelperText>
            </div>
          )}
        </form>
      </Card>
    </div>
  );
}
