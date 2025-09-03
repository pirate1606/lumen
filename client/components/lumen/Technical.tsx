import React from "react";
import { BookOpen, Cpu, Shield, Workflow, Link2 } from "lucide-react";

import ZoomableImage from "./ZoomableImage";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold flex items-center gap-2">{title}</h3>
      <div className="mt-3 text-sm text-muted-foreground space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function Technical() {
  return (
    <section id="technical" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mt-10 grid lg:grid-cols-2 gap-6">
          <Card title="Problem Statement">
            <p>
              India faces uneven access to timely, quality healthcare. Rural
              populations (~65%) have limited primary and specialist care,
              doctor density is ~20.6 per 10,000 versus WHO's 44.5 benchmark,
              and preventable emergencies (e.g., ~58,000 snakebite deaths
              annually) persist due to delayed triage and guidance.
            </p>
            <p>
              LUMEN addresses this with a unified assistant that triages
              symptoms, explains diagnostics, reconstructs low-dose CT,
              interprets lab reports, and maps people to government schemes—in
              their language.
            </p>
          </Card>

          <Card title="Key Features">
            <ul className="list-disc pl-5 space-y-1">
              <li>
                Symptoms-based triage with severity bands (green/yellow/red) and
                next steps.
              </li>
              <li>
                AI specialist modules (dermatology, radiology, cardiology) for
                contextual guidance.
              </li>
              <li>
                PEARL-inspired CT reconstruction preview for lower dose, clearer
                images.
              </li>
              <li>
                Lab report analyzer that extracts values, flags risks, and
                suggests follow-up.
              </li>
              <li>
                Government schemes assistant that checks eligibility and steps.
              </li>
              <li>
                Emergency education tiles with audio guidance for first aid.
              </li>
              <li>Multi-language UX for accessibility across India.</li>
            </ul>
          </Card>
        </div>

        <div className="mt-6 grid lg:grid-cols-1 gap-6">
          <Card title="System Architecture (WIP)">
            <div className="space-y-3">
              <p>
                High-level diagram exported from Eraser. Use the controls to
                zoom and pan.
              </p>
              <Tabs defaultValue="d1" className="w-full">
                <TabsList className="bg-secondary rounded-lg p-1">
                  <TabsTrigger
                    value="d1"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                  >
                    Diagram 1
                  </TabsTrigger>
                  <TabsTrigger
                    value="d2"
                    className="rounded-md data-[state=active]:bg-white data-[state=active]:shadow"
                  >
                    Diagram 2
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="d1" className="mt-3">
                  <ZoomableImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F445519f4dc2147579ea6fb2243527f29%2F386c959d2e0945409ec9e98dd27c0526?format=webp&width=2000"
                    alt="LUMEN system architecture (Eraser export)"
                  />
                </TabsContent>
                <TabsContent value="d2" className="mt-3">
                  <ZoomableImage
                    src="https://cdn.builder.io/api/v1/image/assets%2F445519f4dc2147579ea6fb2243527f29%2F4f9ef3ba46934b92935a7f7fbac88080?format=webp&width=2000"
                    alt="LUMEN system architecture zoomed blocks (Eraser export)"
                  />
                </TabsContent>
              </Tabs>
              <p className="text-xs">
                Diagrams are conceptual and not final; implementation may
                evolve.
              </p>
            </div>
          </Card>
        </div>

        <div className="mt-6 grid lg:grid-cols-2 gap-6">
          <Card title="Core Workflows / Pipelines">
            <div className="space-y-3">
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Workflow className="text-brand-teal" /> Symptom Triage
                </div>
                <ol className="list-decimal pl-5 space-y-1 mt-1">
                  <li>
                    Client collects text/audio/image and metadata (locale,
                    consent).
                  </li>
                  <li>
                    API gateway validates, anonymizes, and performs safety
                    checks.
                  </li>
                  <li>
                    Router invokes GPT reasoning + tools (medical facts, vector
                    search, calculators).
                  </li>
                  <li>
                    Response is structured (severity, differential, next steps,
                    red flags) and localized.
                  </li>
                </ol>
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Cpu className="text-brand-blue" /> CT Reconstruction
                  (PEARL-inspired)
                </div>
                <ol className="list-decimal pl-5 space-y-1 mt-1">
                  <li>
                    Upload DICOM series — pre-processing (denoise, normalize).
                  </li>
                  <li>
                    Low-dose reconstruction engine produces enhanced
                    slices/volume.
                  </li>
                  <li>
                    Viewer renders 3D/axial previews and exports summaries.
                  </li>
                  <li>
                    Safety guardrails ensure non-diagnostic disclaimer and dose
                    notes.
                  </li>
                </ol>
              </div>
              <div>
                <div className="font-medium flex items-center gap-2">
                  <Shield className="text-cta" /> Safety & Privacy
                </div>
                <ul className="list-disc pl-5 space-y-1 mt-1">
                  <li>
                    PII minimization, content filters, and rate limiting at
                    gateway.
                  </li>
                  <li>Human-in-the-loop escalation for high-risk outputs.</li>
                  <li>
                    Audit logs and red-teaming prompts for continuous
                    evaluation.
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
