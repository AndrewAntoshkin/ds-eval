import type { CSSProperties } from "react";
import { Badge, Button, Card, PageHeader } from "@ds";

const displayName =
  "Maximiliana Alexandrina Konstantinopoulou-Vanderbilt-Featherstonehaugh-Wolfeschlegelsteinhausenbergerdorff Seraphina Evangelina Montgomery-Abernathy de la Cruz y Santiago III";

const teamName =
  "Platform Infrastructure, Developer Experience & Internal Tooling — Reliability, Observability and Continuous Delivery Working Group (EMEA + APAC)";

const pageStyle: CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "40rem",
  margin: "0 auto",
  padding: "var(--space-5)",
  minWidth: 0,
  overflowX: "hidden",
};

const wrapText: CSSProperties = {
  minWidth: 0,
  maxWidth: "100%",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  hyphens: "auto",
};

const headerRow: CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "var(--space-4)",
  minWidth: 0,
};

const avatarStyle: CSSProperties = {
  flex: "0 0 auto",
  width: "var(--space-6)",
  height: "var(--space-6)",
  borderRadius: "var(--radius-lg)",
  background: "var(--color-surface-2)",
  color: "var(--color-primary)",
  border: "1px solid var(--color-border)",
  display: "grid",
  placeItems: "center",
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-size-md)",
  fontWeight: 600,
};

const nameStyle: CSSProperties = {
  ...wrapText,
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-size-lg)",
  lineHeight: 1.3,
  color: "var(--color-text)",
};

const metaLabelStyle: CSSProperties = {
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-size-sm)",
  color: "var(--color-text-muted)",
};

const teamStyle: CSSProperties = {
  ...wrapText,
  margin: 0,
  fontFamily: "var(--font-sans)",
  fontSize: "var(--font-size-md)",
  color: "var(--color-text)",
};

const badgeRow: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "var(--space-2)",
  minWidth: 0,
};

export function Task() {
  const initials = displayName
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return (
    <main style={pageStyle}>
      <div className="ds-stack" style={{ minWidth: 0 }}>
        <PageHeader
          title="Team member"
          description="Profile details for a member of your organization."
        />

        <Card>
          <div className="ds-stack" style={{ minWidth: 0 }}>
            <div style={headerRow}>
              <div style={avatarStyle} aria-hidden="true">
                {initials}
              </div>
              <div className="ds-stack" style={{ flex: "1 1 auto", minWidth: 0, gap: "var(--space-2)" }}>
                <h2 style={nameStyle} title={displayName}>
                  {displayName}
                </h2>
                <div style={badgeRow}>
                  <Badge>Member</Badge>
                  <Badge>Active</Badge>
                </div>
              </div>
            </div>

            <div style={{ minWidth: 0 }}>
              <p style={metaLabelStyle}>Team</p>
              <p style={teamStyle}>{teamName}</p>
            </div>

            <div className="ds-row" style={{ flexWrap: "wrap" }}>
              <Button variant="secondary">Message</Button>
              <Button variant="primary">View profile</Button>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}

export default Task;
