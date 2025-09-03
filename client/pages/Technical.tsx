import React from "react";
import Navbar from "@/components/lumen/Navbar";
import Footer from "@/components/lumen/Footer";
import TechnicalContent from "@/components/lumen/Technical";
import { InteractiveGridPattern } from "@/components/magicui/interactive-grid-pattern";
import { IconCloud } from "@/components/magicui/icon-cloud";
import { cn } from "@/lib/utils";

export default function TechnicalPage() {
  return (
    <div className="relative">
      <InteractiveGridPattern
        className={cn("[mask-image:radial-gradient(700px_circle_at_50%_20%,white,transparent)]")}
        width={20}
        height={20}
        squares={[120, 160]}
        squaresClassName="fill-brand-blue/50"
      />
      <Navbar />
      <main className="pt-24 relative z-10">
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-center">
              Technical Documentation
            </h1>
            <p className="mt-3 text-center text-muted-foreground max-w-2xl mx-auto">
              Deep dive into architecture, workflows, and implementation notes
              for LUMEN.
            </p>
          </div>
        </section>
        <TechnicalContent />
      </main>
      <Footer />
    </div>
  );
}
