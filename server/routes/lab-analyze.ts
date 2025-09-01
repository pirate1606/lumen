import type { Request, Response } from "express";
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const labUploadMiddleware = upload.single("file");

const HF_URL =
  "https://api-inference.huggingface.co/models/naver-clova-ix/donut-base-finetuned-docvqa";

function parseDonutOutput(raw: any): Record<string, string> | null {
  // HF Inference can return: [{ generated_text: "{\"Hemoglobin\":\"9.8 g/dL\"}" }] or direct object
  try {
    if (Array.isArray(raw) && raw.length && (raw[0] as any).generated_text) {
      const txt = (raw[0] as any).generated_text as string;
      const trimmed = txt.trim();
      if (trimmed.startsWith("{") && trimmed.endsWith("}"))
        return JSON.parse(trimmed);
      // sometimes Donut returns like: "{key: value, ...}" without quotes -> best effort
      const fixed = trimmed
        .replace(/([,{]\s*)([A-Za-z0-9_.\-]+)(\s*:\s*)/g, '$1"$2"$3')
        .replace(/'/g, '"');
      return JSON.parse(fixed);
    }
    if (raw && typeof raw === "object") return raw as Record<string, string>;
  } catch {
    return null;
  }
  return null;
}

const ranges: Record<string, { low: number; high: number; unit?: string }> = {
  Hemoglobin: { low: 12, high: 16, unit: "g/dL" },
  WBC: { low: 4000, high: 11000, unit: "/µL" },
  RBC: { low: 4.0, high: 5.5, unit: "M/µL" },
};

function extractNumber(v: string): number | null {
  const m = /[-+]?[0-9]*\.?[0-9]+/.exec(v.replace(/,/g, ""));
  return m ? Number(m[0]) : null;
}

function evaluate(values: Record<string, string>) {
  const items = Object.entries(values).map(([k, v]) => {
    const ref = ranges[k];
    if (!ref) return { key: k, value: v, status: "unknown" as const };
    const num = extractNumber(v);
    if (num == null) return { key: k, value: v, status: "unknown" as const };
    if (num < ref.low) return { key: k, value: v, status: "low" as const };
    if (num > ref.high) return { key: k, value: v, status: "high" as const };
    return { key: k, value: v, status: "normal" as const };
  });
  const severity = items.some((i) => i.status === "high")
    ? "red"
    : items.some((i) => i.status === "low")
      ? "yellow"
      : "green";
  const summary =
    severity === "green"
      ? "All values within reference ranges. Maintain healthy habits and routine checkups."
      : severity === "yellow"
        ? "Some values below range. Consider dietary improvements and re-test in 1–2 weeks."
        : "One or more values above range. Seek clinician advice promptly.";
  return { items, severity, summary };
}

export async function handleLabAnalyze(req: Request, res: Response) {
  try {
    const key = process.env.HF_API_KEY;
    if (!key)
      return res.status(500).json({ error: "HF_API_KEY not configured" });
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file)
      return res.status(400).json({ error: "Missing file field 'file'" });

    const HF_DONUT = "https://api-inference.huggingface.co/models/naver-clova-ix/donut-base-finetuned-docvqa";
    const HF_FALLBACK = "https://api-inference.huggingface.co/models/impira/layoutlm-document-qa";

    let data: any;

    if (file.mimetype === "application/pdf") {
      return res.status(415).json({
        error: "PDF not supported in prototype",
        details: "Convert PDF → PNG/JPEG (≤5MB) and upload the image.",
      });
    } else {
      if (!/^image\/(png|jpe?g)$/i.test(file.mimetype || "")) {
        return res.status(415).json({ error: "Unsupported file type", details: `Received ${file.mimetype}. Allowed: PNG, JPEG, or PDF.` });
      }
      const binary = file.buffer;
      const tryModel = (url: string) =>
        fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": file.mimetype,
            Accept: "application/json",
          },
          body: binary,
        });
      // Retry up to 3 times (cold starts) and fallback model
      let r = await tryModel(HF_DONUT);
      if (!r.ok) {
        const t = await r.text();
        r = await tryModel(HF_FALLBACK);
        if (!r.ok) {
          // small backoff retries
          for (let i = 0; i < 2; i++) {
            await new Promise((resDelay) => setTimeout(resDelay, 1500 * (i + 1)));
            r = await tryModel(HF_DONUT);
            if (r.ok) break;
          }
          if (!r.ok) return res.status(502).json({ error: "HuggingFace error", details: t });
        }
      }
      data = await r.json();
    }
    const parsed = parseDonutOutput(data);
    if (!parsed)
      return res
        .status(200)
        .json({ raw: data, note: "Unable to parse structured fields" });

    const evald = evaluate(parsed);
    res.json({ fields: parsed, ...evald });
  } catch (e: any) {
    res
      .status(500)
      .json({ error: "Server failure", message: e?.message ?? String(e) });
  }
}
