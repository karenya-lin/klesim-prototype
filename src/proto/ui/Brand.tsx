/** `light`: white mark for photo / dark headers. `dark`: graphite mark for light surfaces. */
type Tone = "light" | "dark";
type MarkProps = { size?: number; className?: string; tone?: Tone };

export function BrandMark({ size = 28, className, tone = "light" }: MarkProps) {
  const body = tone === "light" ? "var(--c-on-dark)" : "var(--c-text-dark)";
  const line = tone === "light" ? "var(--c-text-dark)" : "var(--c-on-dark)";
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M10 3h12.5A3.5 3.5 0 0 1 26 6.5v19a3.5 3.5 0 0 1-3.5 3.5h-13A3.5 3.5 0 0 1 6 25.5V8.2a2 2 0 0 1 .6-1.4l3.4-3.4V3Z"
        style={{ fill: body }}
      />
      <circle cx="16" cy="18" r="6.6" strokeWidth="1.8" style={{ stroke: line }} />
      <path
        d="M9.6 18h12.8M16 11.4c1.9 1.8 2.9 4 2.9 6.6s-1 4.8-2.9 6.6c-1.9-1.8-2.9-4-2.9-6.6s1-4.8 2.9-6.6Z"
        strokeWidth="1.6"
        strokeLinejoin="round"
        style={{ stroke: line }}
      />
    </svg>
  );
}

export function BrandWordmark({ tone = "light" }: { tone?: Tone }) {
  const ink = tone === "light" ? "var(--c-on-dark)" : "var(--c-text-dark)";
  const accent = tone === "light" ? "var(--c-accent-on-dark)" : "var(--c-selected)";
  return (
    <span
      role="img"
      aria-label="KLeSIM"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28 }}
    >
      <BrandMark size={24} tone={tone} />
      <span
        aria-hidden="true"
        style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: ink, lineHeight: 1 }}
      >
        KL<span style={{ color: accent }}>e</span>SIM
      </span>
    </span>
  );
}
