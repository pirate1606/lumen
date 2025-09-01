import type { Request, Response } from "express";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
export const imageUpload = upload.single("image");

async function callHF(model: string, body: any, key: string, contentType = "application/json") {
  const url = `https://api-inference.huggingface.co/models/${model}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": contentType, Accept: "application/json" },
    body: contentType === "application/json" ? JSON.stringify(body) : body,
  });
  return res;
}

export async function handleSymptomsChat(req: Request, res: Response) {
  try {
    const key = process.env.HF_API_KEY;
    if (!key) return res.status(500).json({ error: "HF_API_KEY not configured" });
    const { prompt, model = "mistralai/Mistral-7B-Instruct-v0.2" } = req.body ?? {};
    if (!prompt) return res.status(400).json({ error: "Missing 'prompt'" });
    const payload = { inputs: prompt, parameters: { max_new_tokens: 400 } };
    const r = await callHF(model, payload, key);
    const t = await r.text();
    if (!r.ok) return res.status(502).json({ error: "HuggingFace error", details: t });
    try {
      const arr = JSON.parse(t);
      const out = Array.isArray(arr) && arr[0]?.generated_text ? arr[0].generated_text : t;
      return res.json({ output: out });
    } catch {
      return res.json({ output: t });
    }
  } catch (e: any) {
    return res.status(500).json({ error: "Server failure", message: e?.message ?? String(e) });
  }
}

export async function handleVisionAnalyze(req: Request, res: Response) {
  try {
    const key = process.env.HF_API_KEY;
    if (!key) return res.status(500).json({ error: "HF_API_KEY not configured" });
    const file = (req as any).file as Express.Multer.File | undefined;
    if (!file) return res.status(400).json({ error: "Missing image field 'image'" });
    const { model = "Salesforce/blip-image-captioning-large" } = req.query as any;
    const base64 = file.buffer.toString("base64");
    const dataUri = `data:${file.mimetype};base64,${base64}`;
    const payload = { inputs: dataUri };
    const r = await callHF(String(model), payload, key);
    const t = await r.text();
    if (!r.ok) return res.status(502).json({ error: "HuggingFace error", details: t });
    try {
      const arr = JSON.parse(t);
      const out = Array.isArray(arr) && arr[0]?.generated_text ? arr[0].generated_text : t;
      return res.json({ output: out });
    } catch {
      return res.json({ output: t });
    }
  } catch (e: any) {
    return res.status(500).json({ error: "Server failure", message: e?.message ?? String(e) });
  }
}

export async function handleEmbed(req: Request, res: Response) {
  try {
    const key = process.env.HF_API_KEY;
    if (!key) return res.status(500).json({ error: "HF_API_KEY not configured" });
    const { text, model = "sentence-transformers/all-MiniLM-L6-v2" } = req.body ?? {};
    if (!text) return res.status(400).json({ error: "Missing 'text'" });
    const payload = { inputs: [text] };
    const r = await callHF(String(model), payload, key);
    const t = await r.text();
    if (!r.ok) return res.status(502).json({ error: "HuggingFace error", details: t });
    try {
      const arr = JSON.parse(t);
      const vec = Array.isArray(arr) ? arr[0] : arr;
      return res.json({ embedding: vec, dim: Array.isArray(vec) ? vec.length : undefined });
    } catch {
      return res.json({ raw: t });
    }
  } catch (e: any) {
    return res.status(500).json({ error: "Server failure", message: e?.message ?? String(e) });
  }
}
