import React from "react";

const langs = ["हिन्दी", "English", "தமிழ்", "বাংলা", "मराठी"];

export default function Languages() {
  return (
    <section id="languages" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 rounded-full gradient-orb animate-[spin_18s_linear_infinite]" />
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold">Built for India’s Languages</h2>
          <p className="mt-2 text-muted-foreground">Globe spins and language toggles glow on hover.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {langs.map((l) => (
              <button key={l} className="px-4 py-2 rounded-full bg-secondary hover:shadow-glow hover:bg-white transition">
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
