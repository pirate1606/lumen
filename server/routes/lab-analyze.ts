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

    if (file.mimetype === "application/pdf") {
      return res
        .status(415)
        .json({
          error: "Unsupported file type for prototype",
          details:
            "Please upload a PNG or JPEG image of the lab report for now.",
        });
    }

    if (!/^image\/(png|jpe?g)$/i.test(file.mimetype || "")) {
      return res
        .status(415)
        .json({
          error: "Unsupported file type",
          details: `Received ${file.mimetype}. Allowed: PNG or JPEG.`,
        });
    }

    const base64 = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64}`;

    const payload = {
      inputs: {
        question:
          "Extract all test names and values as a JSON object with keys as short test names and values with units.",
        image: dataUri,
      },
      parameters: {
        return_full_text: false,
      },
    };

    const hfRes = await fetch(HF_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!hfRes.ok) {
      const t = await hfRes.text();
      return res.status(502).json({ error: "HuggingFace error", details: t });
    }
    const data = await hfRes.json();
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
