import { useState, type ButtonHTMLAttributes, type CSSProperties } from "react";

type Variant = "primary" | "secondary" | "danger";

const variantStyles: Record<
  Variant,
  { base: CSSProperties; hover: CSSProperties }
> = {
  primary: {
    base: {
      background: "#2563eb",
      color: "#ffffff",
      border: "1px solid #2563eb",
    },
    hover: { background: "#1d4ed8", borderColor: "#1d4ed8" },
  },
  secondary: {
    base: {
      background: "#ffffff",
      color: "#1f2937",
      border: "1px solid #d1d5db",
    },
    hover: { background: "#f3f4f6" },
  },
  danger: {
    base: {
      background: "#dc2626",
      color: "#ffffff",
      border: "1px solid #dc2626",
    },
    hover: { background: "#b91c1c", borderColor: "#b91c1c" },
  },
};

const baseButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: 36,
  padding: "0 16px",
  borderRadius: 6,
  fontSize: 14,
  fontWeight: 500,
  fontFamily: "inherit",
  lineHeight: 1,
  cursor: "pointer",
  transition: "background-color 120ms ease, border-color 120ms ease",
};

interface ToolbarButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: Variant;
}

function ToolbarButton({
  variant,
  style,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: ToolbarButtonProps) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const { base, hover } = variantStyles[variant];

  return (
    <button
      type="button"
      {...rest}
      style={{
        ...baseButtonStyle,
        ...base,
        ...(hovered ? hover : null),
        ...(focused
          ? {
              outline: "2px solid #93c5fd",
              outlineOffset: 2,
            }
          : null),
        ...style,
      }}
      onMouseEnter={(e) => {
        setHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={(e) => {
        setHovered(false);
        onMouseLeave?.(e);
      }}
      onFocus={(e) => {
        setFocused(e.currentTarget.matches(":focus-visible"));
        onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        onBlur?.(e);
      }}
    />
  );
}

export function Task() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 24,
        boxSizing: "border-box",
        background: "#f9fafb",
        fontFamily:
          "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      <div
        role="toolbar"
        aria-label="Document actions"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: 12,
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 8,
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
        }}
      >
        <ToolbarButton variant="primary">Save</ToolbarButton>
        <ToolbarButton variant="secondary">Cancel</ToolbarButton>
        <div style={{ flex: 1 }} />
        <ToolbarButton variant="danger">Delete</ToolbarButton>
      </div>
    </div>
  );
}

export default Task;
