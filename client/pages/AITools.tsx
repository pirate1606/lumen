import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  MessageCircle, 
  Volume2, 
  FileText, 
  Image, 
  Brain, 
  Globe,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import HealthcareChatbot from "@/components/lumen/HealthcareChatbot";
import VoiceProcessor from "@/components/lumen/VoiceProcessor";
import LabAnalyzer from "@/components/lumen/LabAnalyzer";
import EmbeddingAnalyzer from "@/components/lumen/EmbeddingAnalyzer";

export default function AITools() {
  const [activeTab, setActiveTab] = useState("chatbot");

  const workingModels = [
    {
      id: "chatbot",
      name: "Healthcare Chatbot",
      model: "microsoft/DialoGPT-medium",
      status: "working",
      description: "AI-powered healthcare conversation and symptom analysis",
      icon: MessageCircle,
      color: "text-green-600"
    },
    {
      id: "whisper",
      name: "Speech Recognition",
      model: "openai/whisper-small",
      status: "working",
      description: "Convert speech to text using advanced Whisper AI",
      icon: Volume2,
      color: "text-green-600"
    },
    {
      id: "embedding",
      name: "Text Embeddings",
      model: "sentence-transformers/all-mpnet-base-v2",
      status: "working",
      description: "Semantic text analysis and similarity search",
      icon: Brain,
      color: "text-green-600"
    },
    {
      id: "multilingual",
      name: "Multilingual Support",
      model: "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
      status: "working",
      description: "Cross-language healthcare assistance",
      icon: Globe,
      color: "text-green-600"
    }
  ];

  const nonWorkingModels = [
    {
      id: "tts",
      name: "Text-to-Speech",
      model: "facebook/tts-ms-en-ljspeech",
      status: "broken",
      description: "Voice output functionality (currently unavailable)",
      icon: Volume2,
      color: "text-red-600"
    },
    {
      id: "donut",
      name: "Document Analysis",
      model: "naver-clova-ix/donut-base-finetuned-cord-v2",
      status: "broken",
      description: "Lab report OCR and analysis (currently unavailable)",
      icon: FileText,
      color: "text-red-600"
    },
    {
      id: "blip",
      name: "Image Analysis",
      model: "Salesforce/blip-image-captioning-base",
      status: "broken",
      description: "Dermatology and image understanding (currently unavailable)",
      icon: Image,
      color: "text-red-600"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "working":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "broken":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "working":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Working</Badge>;
      case "broken":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Broken</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Unknown</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Healthcare Tools
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our AI-powered healthcare features powered by state-of-the-art machine learning models
          </p>
        </div>

        {/* Model Status Overview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                Working Models ({workingModels.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {workingModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <model.icon className={`w-5 h-5 ${model.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{model.name}</p>
                      <p className="text-sm text-gray-600">{model.description}</p>
                    </div>
                  </div>
                  {getStatusIcon(model.status)}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <XCircle className="w-5 h-5" />
                Non-Working Models ({nonWorkingModels.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nonWorkingModels.map((model) => (
                <div key={model.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <model.icon className={`w-5 h-5 ${model.color}`} />
                    <div>
                      <p className="font-medium text-gray-900">{model.name}</p>
                      <p className="text-sm text-gray-600">{model.description}</p>
                    </div>
                  </div>
                  {getStatusIcon(model.status)}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Interactive Tools */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Interactive AI Tools
          </h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="chatbot" className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Healthcare Chatbot
              </TabsTrigger>
              <TabsTrigger value="voice" className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Voice Processing
              </TabsTrigger>
              <TabsTrigger value="embedding" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Text Analysis
              </TabsTrigger>
              <TabsTrigger value="lab" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Lab Analysis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chatbot" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Healthcare Assistant
                </h3>
                <p className="text-gray-600">
                  Powered by Microsoft DialoGPT - Get instant healthcare guidance, symptom analysis, and emergency advice
                </p>
              </div>
              <HealthcareChatbot />
            </TabsContent>

            <TabsContent value="voice" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Voice-to-Text Processing
                </h3>
                <p className="text-gray-600">
                  Powered by OpenAI Whisper - Convert your voice to text for easy communication with the AI assistant
                </p>
              </div>
              <VoiceProcessor />
            </TabsContent>

            <TabsContent value="embedding" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  AI Text Analysis & Embeddings
                </h3>
                <p className="text-gray-600">
                  Powered by Sentence Transformers - Analyze text semantics, find similarities, and understand healthcare queries
                </p>
              </div>
              <EmbeddingAnalyzer />
            </TabsContent>

            <TabsContent value="lab" className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Lab Report Analysis
                </h3>
                <p className="text-gray-600">
                  Upload lab report images for AI-powered analysis and interpretation
                </p>
                <div className="mt-2">
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Note: Document analysis models are currently being updated
                  </Badge>
                </div>
              </div>
              <LabAnalyzer />
            </TabsContent>
          </Tabs>
        </div>

        {/* Technical Information */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              Technical Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Working Models</h4>
                <div className="space-y-2">
                  {workingModels.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-medium">{model.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {model.model}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Model Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Models:</span>
                    <span className="font-medium">{workingModels.length + nonWorkingModels.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Working:</span>
                    <span className="font-medium text-green-600">{workingModels.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Non-Working:</span>
                    <span className="font-medium text-red-600">{nonWorkingModels.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Success Rate:</span>
                    <span className="font-medium text-blue-600">
                      {Math.round((workingModels.length / (workingModels.length + nonWorkingModels.length)) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">✅ What Works</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• AI-powered healthcare conversations and symptom analysis</li>
                  <li>• Voice-to-text conversion using Whisper AI</li>
                  <li>• Text embedding and semantic analysis</li>
                  <li>• Multilingual healthcare assistance</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-900 mb-2">⚠️ Limitations</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  <li>• Text-to-speech functionality is currently unavailable</li>
                  <li>• Document analysis and OCR features are being updated</li>
                  <li>• Image analysis capabilities are temporarily disabled</li>
                </ul>
              </div>

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-900 mb-2">🚨 Important</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  <li>• This AI assistant provides general guidance only</li>
                  <li>• It is not a substitute for professional medical care</li>
                  <li>• For emergencies, call your local emergency number immediately</li>
                  <li>• Always consult healthcare professionals for serious concerns</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
