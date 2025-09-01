import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, MessageCircle, Stethoscope, AlertTriangle, Heart } from "lucide-react";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
  triageLevel?: "green" | "yellow" | "red";
  confidence?: number;
}

interface ChatResponse {
  output: string;
  triageLevel?: "green" | "yellow" | "red";
  confidence?: number;
}

export default function HealthcareChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      type: "assistant",
      content: "Hello! I'm your AI healthcare assistant. I can help with symptom analysis, general health questions, and emergency guidance. How can I help you today?",
      timestamp: new Date(),
      triageLevel: "green"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<"symptoms" | "general" | "emergency">("general");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (content: string, type: "user" | "assistant", triageLevel?: "green" | "yellow" | "red", confidence?: number) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
      triageLevel,
      confidence
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue("");
    addMessage(userMessage, "user");
    setIsLoading(true);

    try {
      let endpoint = "/api/chat/symptoms";
      let payload: any = { prompt: userMessage };

      if (chatMode === "general") {
        // For general chat, we'll use the symptoms endpoint but with a general prefix
        payload.prompt = `General health question: ${userMessage}`;
      } else if (chatMode === "emergency") {
        payload.prompt = `Emergency situation: ${userMessage}. Provide immediate first aid guidance.`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: ChatResponse = await response.json();
      
      // Determine triage level based on content analysis
      let triageLevel: "green" | "yellow" | "red" = "green";
      const content = data.output.toLowerCase();
      
      if (content.includes("emergency") || content.includes("immediate") || content.includes("call 911") || content.includes("ambulance")) {
        triageLevel = "red";
      } else if (content.includes("urgent") || content.includes("soon") || content.includes("within 24 hours")) {
        triageLevel = "yellow";
      }

      addMessage(data.output, "assistant", triageLevel, data.confidence || 0.8);
    } catch (error) {
      console.error("Chat error:", error);
      addMessage(
        "I'm sorry, I'm experiencing technical difficulties. Please try again or contact a healthcare professional for urgent concerns.",
        "assistant",
        "red"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getTriageColor = (level: "green" | "yellow" | "red") => {
    switch (level) {
      case "red": return "bg-red-100 text-red-800 border-red-200";
      case "yellow": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "green": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTriageIcon = (level: "green" | "yellow" | "red") => {
    switch (level) {
      case "red": return <AlertTriangle className="w-4 h-4" />;
      case "yellow": return <Stethoscope className="w-4 h-4" />;
      case "green": return <Heart className="w-4 h-4" />;
      default: return <MessageCircle className="w-4 h-4" />;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          AI Healthcare Assistant
        </CardTitle>
        <div className="flex gap-2">
          <Button
            variant={chatMode === "general" ? "default" : "outline"}
            size="sm"
            onClick={() => setChatMode("general")}
          >
            General
          </Button>
          <Button
            variant={chatMode === "symptoms" ? "default" : "outline"}
            size="sm"
            onClick={() => setChatMode("symptoms")}
          >
            Symptoms
          </Button>
          <Button
            variant={chatMode === "emergency" ? "default" : "outline"}
            size="sm"
            onClick={() => setChatMode("emergency")}
          >
            Emergency
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea ref={scrollAreaRef} className="h-96 w-full rounded-md border p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === "assistant" && message.triageLevel && (
                      <Badge 
                        variant="outline" 
                        className={`${getTriageColor(message.triageLevel)} border-2`}
                      >
                        <div className="flex items-center gap-1">
                          {getTriageIcon(message.triageLevel)}
                          {message.triageLevel.toUpperCase()}
                        </div>
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-gray-600">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              chatMode === "emergency" 
                ? "Describe the emergency situation..." 
                : chatMode === "symptoms" 
                  ? "Describe your symptoms..." 
                  : "Ask a general health question..."
            }
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send"}
          </Button>
        </form>

        <div className="text-xs text-gray-500 text-center">
          <p>This AI assistant provides general guidance only and is not a substitute for professional medical care.</p>
          <p>For emergencies, call your local emergency number immediately.</p>
        </div>
      </CardContent>
    </Card>
  );
}
