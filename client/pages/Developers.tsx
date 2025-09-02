import React from "react";
import Navbar from "@/components/lumen/Navbar";
import Footer from "@/components/lumen/Footer";
import ScratchReveal from "@/components/lumen/ScratchReveal";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const CV_URL =
  "https://cdn.builder.io/o/assets%2F445519f4dc2147579ea6fb2243527f29%2F64cb59ca2bb34b889f0a978bf1db3d56?alt=media&token=f1b2d979-0083-4c4e-9bca-11ee86faadd6&apiKey=445519f4dc2147579ea6fb2243527f29";

export default function DevelopersPage() {
  const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
  const photo = params.get("photo") || "";

  return (
    <div className="relative">
      <Navbar />
      <main className="pt-28 pb-16">
        <section className="container grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-4">
            <h1 className="text-3xl font-bold">Developers</h1>
            <div className="card p-5 space-y-3">
              <h2 className="text-xl font-semibold">Sanchitsai Nipanikar</h2>
              <div className="space-y-2 text-sm">
                <a className="flex items-center gap-2 hover:underline" href="tel:+918459597997">
                  <Phone size={16} /> +91-8459597997
                </a>
                <a className="flex items-center gap-2 hover:underline" href="mailto:sanchitnipanikar@gmail.com">
                  <Mail size={16} /> sanchitnipanikar@gmail.com
                </a>
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> Marvel Cascada, Balewadi, Pune 411045
                </p>
                <div className="flex items-center gap-3 pt-1">
                  {/* Provide real profile URLs when available */}
                  <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                    <Github size={16} /> GitHub
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground text-sm">
                    <Linkedin size={16} /> LinkedIn
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-semibold mb-3">Developer Photo</h3>
              {photo ? (
                <ScratchReveal
                  imageSrc={photo}
                  className="w-full"
                  revealThreshold={0.55}
                  brushRadius={24}
                />
              ) : (
                <div className="text-sm text-muted-foreground">
                  Add a photo query param to reveal, for example: /developers?photo=https%3A%2F%2Fexample.com%2Fyour-photo.jpg
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="card p-5">
              <h3 className="text-lg font-semibold mb-3">Curriculum Vitae</h3>
              <div className="aspect-[16/9] w-full rounded-lg overflow-hidden border border-border bg-muted">
                <iframe
                  src={`${CV_URL}#view=FitH`}
                  title="Sanchit CV"
                  className="w-full h-full"
                />
              </div>
              <div className="mt-3 flex gap-2">
                <a
                  href={CV_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-cta"
                >
                  Open CV
                </a>
                <a
                  href={CV_URL}
                  download
                  className="px-4 py-2 rounded-lg border border-input bg-background font-semibold hover:bg-accent"
                >
                  Download
                </a>
              </div>
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                B.Tech in Computer Engineering at Vishwakarma Institute of Technology, Pune (SPPU), experienced in full‑stack web and AI/ML projects. Interested in computer vision, multimodal models, and practical software systems.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
