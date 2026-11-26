import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Button, Card, PageHeader, Select } from "@ds";

const COUNTRIES = [
  { code: "AU", name: "Australia" },
  { code: "BR", name: "Brazil" },
  { code: "CA", name: "Canada" },
  { code: "FR", name: "France" },
  { code: "DE", name: "Germany" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "MX", name: "Mexico" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
];

export function Task() {
  const [country, setCountry] = useState("");
  const [touched, setTouched] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  const error = touched && !country ? "Please select a country." : undefined;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value);
    setSaved(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTouched(true);
    if (!country) return;
    const match = COUNTRIES.find((c) => c.code === country);
    setSaved(match ? match.name : null);
  };

  return (
    <div className="ds-stack">
      <PageHeader title="Country" description="Choose the country you live in." />
      <Card>
        <form className="ds-stack" onSubmit={handleSubmit} noValidate>
          <Select
            id="country"
            name="country"
            label="Country"
            helper="Used to show prices and shipping options for your region."
            error={error}
            value={country}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            required
          >
            <option value="" disabled>
              Select a country
            </option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </Select>
          {saved && (
            <p role="status" style={{ margin: 0, color: "var(--color-text-muted)", fontSize: "var(--font-size-sm)" }}>
              Saved: {saved}
            </p>
          )}
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
