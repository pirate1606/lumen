import React, { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";

const slides = [
  {
    title: "Snakebite",
    steps: [
      "Move away from the snake",
      "Keep limb immobilized",
      "Reach hospital quickly",
    ],
  },
  {
    title: "Drowning",
    steps: ["Call for help", "Provide rescue breaths", "Seek emergency care"],
  },
  {
    title: "Fire Burns",
    steps: [
      "Cool burn with water",
      "Cover with clean cloth",
      "Do not pop blisters",
    ],
  },
  {
    title: "Electric Shock",
    steps: [
      "Switch off power",
      "Do not touch victim directly",
      "Call emergency",
    ],
  },
];

export default function Emergency() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, align: "start" });
  const interval = useRef<number | null>(null);
  const [playing, setPlaying] = useState(true);

  const play = useCallback(() => {
    stop();
    interval.current = window.setInterval(() => embla?.scrollNext(), 3500);
  }, [embla]);

  const stop = useCallback(() => {
    if (interval.current) window.clearInterval(interval.current);
    interval.current = null;
  }, []);

  useEffect(() => {
    if (playing) play();
    else stop();
    return stop;
  }, [playing, play, stop]);

  const speak = (text: string) => {
    try {
      new SpeechSynthesisUtterance();
    } catch {
      return;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-IN";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };

  return (
    <section id="emergency" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold">
              Emergency First Aid
            </h2>
            <p className="text-muted-foreground">
              Auto‑play carousel with pictorial + audio guide.
            </p>
          </div>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="px-4 py-2 rounded-lg border bg-background font-semibold hover:bg-accent"
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <div className="mt-6 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6">
            {slides.map((s) => (
              <div
                key={s.title}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_45%] lg:flex-[0_0_30%]"
              >
                <div className="card p-6 h-full">
                  <h3 className="font-semibold">{s.title}</h3>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    {s.steps.map((step, i) => (
                      <div key={i} className="rounded-xl bg-secondary p-3">
                        <div className="h-16 rounded-md bg-gradient-to-br from-brand-blue/20 to-brand-teal/20" />
                        <p className="mt-2">
                          {i + 1}. {step}
                        </p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => speak(`${s.title}. ${s.steps.join(". ")}`)}
                    className="mt-4 btn-cta"
                  >
                    Play Audio
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
