import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleLabAnalyze, labUploadMiddleware } from "./routes/lab-analyze";
import {
  handleSymptomsChat,
  handleVisionAnalyze,
  handleEmbed,
  imageUpload,
} from "./routes/hf";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Lab analyzer
  app.post("/api/lab/analyze", labUploadMiddleware, handleLabAnalyze);
  // Chat (symptom-based diagnosis text)
  app.post("/api/chat/symptoms", handleSymptomsChat);
  // Vision (image-based analysis)
  app.post("/api/vision/analyze", imageUpload, handleVisionAnalyze);
  // Embeddings (for scheme retrieval)
  app.post("/api/embed", handleEmbed);

  return app;
}
