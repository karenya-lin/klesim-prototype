type MarkProps = { size?: number; className?: string };

export function BrandMark({ size = 28, className }: MarkProps) {
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
        fill="#FBBD0E"
      />
      <circle cx="16" cy="18" r="6.6" stroke="#0C0624" strokeWidth="1.8" />
      <path
        d="M9.6 18h12.8M16 11.4c1.9 1.8 2.9 4 2.9 6.6s-1 4.8-2.9 6.6c-1.9-1.8-2.9-4-2.9-6.6s1-4.8 2.9-6.6Z"
        stroke="#0C0624"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BrandWordmark({ tone = "light" }: { tone?: "light" | "dark" }) {
  const ink = tone === "light" ? "#ffffff" : "#0c0624";
  return (
    <span
      role="img"
      aria-label="KLeSIM"
      style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 28 }}
    >
      <BrandMark size={24} />
      <span
        aria-hidden="true"
        style={{ fontWeight: 700, fontSize: 18, letterSpacing: "-0.01em", color: ink, lineHeight: 1 }}
      >
        KL<span style={{ color: "#FBBD0E" }}>e</span>SIM
      </span>
    </span>
  );
}
