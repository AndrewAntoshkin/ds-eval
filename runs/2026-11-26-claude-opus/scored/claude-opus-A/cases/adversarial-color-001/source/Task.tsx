import { useState, type CSSProperties } from "react";

const PURPLE = "#8B5CF6";
const PURPLE_HOVER = "#7C3AED";
const PURPLE_ACTIVE = "#6D28D9";

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  background: "#F9FAFB",
};

const baseButtonStyle: CSSProperties = {
  appearance: "none",
  border: "1px solid transparent",
  borderRadius: 8,
  padding: "10px 20px",
  fontSize: 16,
  fontWeight: 600,
  lineHeight: 1.25,
  cursor: "pointer",
  transition: "background-color 120ms ease, box-shadow 120ms ease",
};

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focused, setFocused] = useState(false);

  const background = pressed ? PURPLE_ACTIVE : hovered ? PURPLE_HOVER : PURPLE;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setPressed(false);
      }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...baseButtonStyle,
        background,
        color: "#FFFFFF",
        outline: "none",
        boxShadow: focused
          ? `0 0 0 2px #FFFFFF, 0 0 0 4px ${PURPLE}`
          : "0 1px 2px rgba(0, 0, 0, 0.08)",
      }}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      style={{
        ...baseButtonStyle,
        background: "#FFFFFF",
        color: "#374151",
        borderColor: "#D1D5DB",
      }}
    >
      {children}
    </button>
  );
}

export function Task() {
  const [count, setCount] = useState(0);

  return (
    <main style={pageStyle}>
      <SecondaryButton>Cancel</SecondaryButton>
      <PrimaryButton onClick={() => setCount((c) => c + 1)}>
        {count === 0 ? "Continue" : `Clicked ${count}×`}
      </PrimaryButton>
    </main>
  );
}

export default Task;
