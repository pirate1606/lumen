import React from "react";

export default function SectionDivider({ flip = false }: { flip?: boolean }) {
  return (
    <div
      aria-hidden
      className={`w-full overflow-hidden ${flip ? "rotate-180" : ""}`}
    >
      <svg
        viewBox="0 0 1440 150"
        className="w-full h-[120px] text-brand-sea/60"
      >
        <path
          fill="currentColor"
          d="M0,64L60,58.7C120,53,240,43,360,58.7C480,75,600,117,720,128C840,139,960,117,1080,112C1200,107,1320,117,1380,122.7L1440,128L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        />
      </svg>
    </div>
  );
}
