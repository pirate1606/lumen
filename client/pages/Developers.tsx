import React from "react";
import Navbar from "@/components/lumen/Navbar";
import Footer from "@/components/lumen/Footer";
import ScratchReveal from "@/components/lumen/ScratchReveal";
import { Github, Linkedin } from "lucide-react";

const CV_URL =
  "https://cdn.builder.io/o/assets%2F445519f4dc2147579ea6fb2243527f29%2F64cb59ca2bb34b889f0a978bf1db3d56?alt=media&token=f1b2d979-0083-4c4e-9bca-11ee86faadd6&apiKey=445519f4dc2147579ea6fb2243527f29";
const DEFAULT_PHOTO =
  "https://cdn.builder.io/api/v1/image/assets%2F445519f4dc2147579ea6fb2243527f29%2F29b7158d37314f3eb52498f9fc477c47?format=webp&width=800";

function DeveloperCard({
  name,
  photo,
  cv,
  github,
  linkedin,
  useScratch,
}: {
  name: string;
  photo?: string;
  cv?: string;
  github?: string;
  linkedin?: string;
  useScratch?: boolean;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <div className="rounded-xl overflow-hidden border border-border">
          {useScratch && photo ? (
            <ScratchReveal imageSrc={photo} className="w-full" revealThreshold={0.55} brushRadius={24} />
          ) : (
            <div className="aspect-[4/5] w-full bg-muted grid place-items-center text-muted-foreground text-sm">
              Profile coming soon
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {cv ? (
            <a href={cv} target="_blank" rel="noreferrer" className="btn-cta">
              View CV
            </a>
          ) : (
            <button disabled className="px-4 py-2 rounded-lg border border-input bg-background font-semibold text-muted-foreground">
              CV unavailable
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 pt-1">
          {github ? (
            <a href={github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
              <Github size={16} /> GitHub
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
              <Github size={16} /> GitHub
            </span>
          )}
          {linkedin ? (
            <a href={linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:underline">
              <Linkedin size={16} /> LinkedIn
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
              <Linkedin size={16} /> LinkedIn
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DevelopersPage() {
  return (
    <div className="relative">
      <Navbar />
      <main className="pt-28 pb-16">
        <section className="container space-y-6">
          <h1 className="text-3xl font-bold">Developers</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            <DeveloperCard
              name="Sanchitsai Nipanikar"
              photo={DEFAULT_PHOTO}
              cv={CV_URL}
              github={""}
              linkedin={""}
              useScratch
            />
            <DeveloperCard name="Team member" />
            <DeveloperCard name="Team member" />
            <DeveloperCard name="Team member" />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
