import React from "react";

type Props = { size?: number; withWordmark?: boolean };

export default function Logo({ size = 28, withWordmark = true }: Props) {
  return (
    <div className="flex items-center gap-2 select-none">
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        aria-label="LUMEN orb logo"
        className="gradient-orb rounded-full animate-float"
      >
        <defs>
          <radialGradient id="g1" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#3FD1C1" />
            <stop offset="60%" stopColor="#1B8EE6" />
            <stop offset="100%" stopColor="#0a2a4b" stopOpacity="0.8" />
          </radialGradient>
        </defs>
        <circle cx="256" cy="256" r="240" fill="url(#g1)" />
        <circle cx="218" cy="208" r="70" fill="#fff" opacity="0.18" />
      </svg>
      {withWordmark && (
        <span
          className="text-xl font-extrabold tracking-wider font-surgena"
          style={{
            backgroundImage:
              "linear-gradient(90deg, hsl(var(--brand-teal)) 0%, hsl(var(--brand-blue)) 60%, hsl(var(--brand-teal)) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          LUMEN
        </span>
      )}
    </div>
  );
}
