import type { CSSProperties } from "react";
import { Badge, Button, Card, PageHeader } from "@ds";

const NAME_SEED =
  "Maximiliana Alexandrina Featherstonehaugh-Wolfeschlegelsteinhausenbergerdorff " +
  "de la Cruz-Montgomery-Vanderbilt Okonkwo-Hernández Papadopoulos-Nakamura " +
  "Supercalifragilisticexpialidociouslyunbreakablesegmentwithoutanyspaces ";

const displayName = NAME_SEED.repeat(2).slice(0, 180).trim().padEnd(180, "x");

const teamName =
  "Platform Infrastructure, Reliability & Developer Experience — EMEA Core Services (Payments, Identity, Notifications)";

const wrap: CSSProperties = {
  minWidth: 0,
  maxWidth: "100%",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
};

const headerRow: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "var(--space-4)",
  minWidth: 0,
};

const avatar: CSSProperties = {
  flex: "none",
  display: "grid",
  placeItems: "center",
  width: "var(--control-height)",
  height: "var(--control-height)",
  borderRadius: "var(--radius-md)",
  background: "var(--color-surface-2)",
  border: "1px solid var(--color-border)",
  color: "var(--color-text)",
  fontSize: "var(--font-size-md)",
  fontWeight: 600,
};

const nameStyle: CSSProperties = {
  ...wrap,
  margin: 0,
  color: "var(--color-text)",
  fontSize: "var(--font-size-lg)",
  lineHeight: 1.3,
};

const metaList: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "minmax(0, max-content) minmax(0, 1fr)",
  columnGap: "var(--space-4)",
  rowGap: "var(--space-2)",
  margin: 0,
  minWidth: 0,
};

const term: CSSProperties = {
  color: "var(--color-text-muted)",
  fontSize: "var(--font-size-sm)",
};

const definition: CSSProperties = {
  ...wrap,
  margin: 0,
  color: "var(--color-text)",
  fontSize: "var(--font-size-md)",
};

const badgeRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-2)",
  minWidth: 0,
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Task() {
  return (
    <div className="ds-stack" style={{ minWidth: 0, maxWidth: "100%" }}>
      <PageHeader title="User profile" description="Account details for a team member." />

      <div style={{ minWidth: 0, maxWidth: "100%", overflowX: "hidden" }}>
        <Card>
          <div className="ds-stack" style={{ minWidth: 0 }}>
            <div style={headerRow}>
              <div style={avatar} aria-hidden="true">
                {initials(displayName)}
              </div>
              <div className="ds-stack" style={{ gap: "var(--space-2)", minWidth: 0, flex: "1 1 0" }}>
                <h2 style={nameStyle} title={displayName}>
                  {displayName}
                </h2>
                <div style={badgeRow}>
                  <Badge>Active</Badge>
                  <Badge>Admin</Badge>
                </div>
              </div>
            </div>

            <dl style={metaList}>
              <dt style={term}>Team</dt>
              <dd style={definition}>{teamName}</dd>
              <dt style={term}>Email</dt>
              <dd style={definition}>
                maximiliana.featherstonehaugh-wolfeschlegelsteinhausenbergerdorff@example-enterprise.com
              </dd>
              <dt style={term}>Role</dt>
              <dd style={definition}>Staff Software Engineer</dd>
            </dl>

            <div className="ds-row" style={{ flexWrap: "wrap" }}>
              <Button type="button" variant="secondary">
                Message
              </Button>
              <Button type="button">View profile</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
