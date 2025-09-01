import React, { useState } from "react";

interface ResultItem {
  key: string;
  value: string;
  status: "low" | "high" | "normal" | "unknown";
}

interface AnalyzeResponse {
  fields?: Record<string, string>;
  items?: ResultItem[];
  severity?: "green" | "yellow" | "red";
  summary?: string;
  error?: string;
  details?: string;
  note?: string;
}

export default function LabAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setErr(null);
    setData(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/lab/analyze", {
        method: "POST",
        body: fd,
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      let json: AnalyzeResponse | null = null;
      try {
        json = (await res.json()) as AnalyzeResponse;
      } catch {
        json = null;
      }
      if (!res.ok) {
        setErr(
          `${json?.error || `Upload failed (HTTP ${res.status})`} ${json?.details ? `— ${json.details}` : ""}`,
        );
      } else {
        setData(json || { error: "Empty response" });
      }
    } catch (e: any) {
      setErr(e?.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-3">
        <label className="mt-1 grid place-items-center h-40 rounded-xl border-2 border-dashed border-brand-blue/40 bg-secondary cursor-pointer">
          <input
            type="file"
            accept="application/pdf,image/png,image/jpeg"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
          <span className="text-sm">
            {file ? file.name : "Click to choose PDF/PNG/JPEG"}
          </span>
        </label>
        <div className="flex gap-2">
          <button
            disabled={!file || loading}
            className="btn-cta disabled:opacity-50"
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>
          {file && (
            <button
              type="button"
              onClick={() => setFile(null)}
              className="px-4 py-2 rounded-lg border bg-background font-semibold hover:bg-accent"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {err && <p className="mt-3 text-sm text-red-600">{err}</p>}

      {data && (
        <div className="mt-4 space-y-3">
          {data.summary && (
            <div
              className={`rounded-lg p-3 text-sm ${data.severity === "red" ? "bg-red-50 text-red-700" : data.severity === "yellow" ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"}`}
            >
              {data.summary}
            </div>
          )}
          {data.items && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {data.items.map((i) => (
                <div
                  key={i.key}
                  className="rounded-lg bg-white p-3 shadow-sm border"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{i.key}</div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${i.status === "normal" ? "bg-emerald-100 text-emerald-700" : i.status === "low" ? "bg-amber-100 text-amber-700" : i.status === "high" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {i.status}
                    </span>
                  </div>
                  <div className="text-muted-foreground">{i.value}</div>
                </div>
              ))}
            </div>
          )}
          {data.note && (
            <p className="text-xs text-muted-foreground">{data.note}</p>
          )}
        </div>
      )}
    </div>
  );
}
