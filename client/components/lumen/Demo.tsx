import React, { useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import LabAnalyzer from "./LabAnalyzer";
import HealthcareChatbot from "./HealthcareChatbot";
import VoiceProcessor from "./VoiceProcessor";

function Cube() {
  return (
    <mesh rotation={[0.6, 0.8, 0]}>
      <boxGeometry args={[1.2, 1.2, 1.2]} />
      <meshStandardMaterial color="#19bfb2" metalness={0.4} roughness={0.2} />
      <pointLight position={[4, 4, 4]} intensity={1.2} />
    </mesh>
  );
}

export default function Demo() {
  const [activeTab, setActiveTab] = useState("chatbot");
  
  return (
    <section id="demo" className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center">
          Live Demo / Prototype
        </h2>
        <p className="mt-2 text-center text-muted-foreground">
          Interactive AI-powered healthcare tools powered by working models.
        </p>

        <div className="mt-10 grid lg:grid-cols-3 gap-6">
          {/* CT Viewer */}
          <div className="card p-6">
            <h3 className="font-semibold">3D CT Viewer</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Interactive 3D visualization
            </p>
            <div className="mt-3 h-48 rounded-xl bg-secondary overflow-hidden">
              <Canvas camera={{ position: [2.8, 2.8, 2.8] }}>
                <ambientLight intensity={0.6} />
                <Cube />
                <OrbitControls
                  enablePan={false}
                  enableZoom={false}
                  autoRotate
                  autoRotateSpeed={1.4}
                />
              </Canvas>
            </div>
          </div>

          {/* Lab Report Analyzer */}
          <div className="card p-6">
            <h3 className="font-semibold">Lab Report Analyzer</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Upload lab reports for AI analysis
            </p>
            <div className="mt-3">
              <LabAnalyzer />
            </div>
          </div>

          {/* AI Healthcare Assistant */}
          <div className="card p-6">
            <h3 className="font-semibold">AI Healthcare Assistant</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Powered by Microsoft DialoGPT
            </p>
            <div className="mt-3">
              <HealthcareChatbot />
            </div>
          </div>
        </div>

        {/* Additional AI Tools */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-center mb-8">
            Additional AI Tools
          </h3>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Voice Processing */}
            <div className="card p-6">
              <h4 className="font-semibold text-lg mb-4">Voice-to-Text Processing</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Convert your voice to text using OpenAI Whisper AI technology
              </p>
              <VoiceProcessor />
            </div>

            {/* Model Status */}
            <div className="card p-6">
              <h4 className="font-semibold text-lg mb-4">AI Model Status</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Healthcare Chatbot</span>
                  <span className="text-green-600 text-sm">✅ Working</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Speech Recognition</span>
                  <span className="text-green-600 text-sm">✅ Working</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Text Embeddings</span>
                  <span className="text-green-600 text-sm">✅ Working</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Text-to-Speech</span>
                  <span className="text-red-600 text-sm">❌ Broken</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Document Analysis</span>
                  <span className="text-red-600 text-sm">❌ Broken</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Success Rate:</strong> 3 out of 5 models working (60%)
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
