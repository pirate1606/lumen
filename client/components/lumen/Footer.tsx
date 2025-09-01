import React from "react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} LUMEN. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm">
            <a className="hover:underline" href="https://www.linkedin.com/in/sanchit1606/" target="_blank" rel="noreferrer">LinkedIn</a>
            <a className="hover:underline" href="https://github.com/sanchit1606" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">LUMEN is a research prototype and does not replace professional medical advice.</p>
      </div>
    </footer>
  );
}
