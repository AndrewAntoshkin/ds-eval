import { useId, useState, type CSSProperties } from "react";

const NAME_SOURCE =
  "Maximiliana Alexandrina Konstantinopolous-Vanderbilt-Featherstonehaugh de la Cruz y Montenegro-Oyelaran Wolfeschlegelsteinhausenbergerdorff Thistlewaite-Abernathy Okonkwo-Nakamura";

const DISPLAY_NAME = NAME_SOURCE.padEnd(180, " Smith").slice(0, 180);

const TEAM_NAME =
  "Platform Infrastructure, Developer Experience & Internal Tooling — EMEA Reliability Working Group";

const styles: Record<string, CSSProperties> = {
  page: {
    boxSizing: "border-box",
    minHeight: "100vh",
    width: "100%",
    padding: "24px 16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    background: "#f4f5f7",
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    color: "#1f2328",
    overflowX: "hidden",
  },
  card: {
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 480,
    minWidth: 0,
    padding: 20,
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    background: "#ffffff",
    border: "1px solid #d8dee4",
    borderRadius: 12,
    boxShadow: "0 1px 3px rgba(31, 35, 40, 0.08)",
  },
  avatar: {
    flex: "0 0 auto",
    width: 48,
    height: 48,
    borderRadius: "50%",
    display: "grid",
    placeItems: "center",
    background: "#ddf4ff",
    color: "#0550ae",
    fontWeight: 600,
    fontSize: 18,
    userSelect: "none",
  },
  body: {
    flex: "1 1 auto",
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  name: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.35,
    fontWeight: 600,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
  nameClamped: {
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  toggle: {
    alignSelf: "flex-start",
    padding: 0,
    border: "none",
    background: "none",
    color: "#0969da",
    font: "inherit",
    fontSize: 13,
    cursor: "pointer",
    textDecoration: "underline",
  },
  teamRow: {
    display: "flex",
    gap: 6,
    alignItems: "flex-start",
    minWidth: 0,
    fontSize: 14,
    lineHeight: 1.45,
    color: "#57606a",
  },
  teamLabel: {
    flex: "0 0 auto",
    fontWeight: 500,
  },
  teamName: {
    minWidth: 0,
    overflowWrap: "anywhere",
    wordBreak: "break-word",
  },
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function Task() {
  const [expanded, setExpanded] = useState(false);
  const nameId = useId();

  return (
    <main style={styles.page}>
      <article style={styles.card} aria-labelledby={nameId}>
        <div style={styles.avatar} aria-hidden="true">
          {initialsOf(DISPLAY_NAME)}
        </div>
        <div style={styles.body}>
          <h2
            id={nameId}
            title={DISPLAY_NAME}
            style={expanded ? styles.name : { ...styles.name, ...styles.nameClamped }}
          >
            {DISPLAY_NAME}
          </h2>
          <button
            type="button"
            style={styles.toggle}
            aria-expanded={expanded}
            aria-controls={nameId}
            onClick={() => setExpanded((v) => !v)}
          >
            {expanded ? "Show less" : "Show full name"}
          </button>
          <div style={styles.teamRow}>
            <span style={styles.teamLabel}>Team:</span>
            <span style={styles.teamName}>{TEAM_NAME}</span>
          </div>
        </div>
      </article>
    </main>
  );
}

export default Task;
