import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Brain, Globe, TrendingUp, BarChart3, Target } from "lucide-react";

interface EmbeddingResponse {
  embedding: number[];
  dim: number;
}

interface SimilarityResult {
  text: string;
  similarity: number;
  rank: number;
}

export default function EmbeddingAnalyzer() {
  const [inputText, setInputText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [embeddingData, setEmbeddingData] = useState<EmbeddingResponse | null>(null);
  const [similarityResults, setSimilarityResults] = useState<SimilarityResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("embedding");

  // Sample healthcare texts for similarity comparison
  const sampleTexts = [
    "I have a fever and headache",
    "My blood pressure is high",
    "I'm experiencing chest pain",
    "I have diabetes and need to monitor my blood sugar",
    "I'm feeling dizzy and nauseous",
    "I have a rash on my skin",
    "My joints are swollen and painful",
    "I'm having trouble breathing",
    "I have a persistent cough",
    "I'm feeling very tired and weak"
  ];

  const processEmbedding = async () => {
    if (!inputText.trim()) return;

    setIsProcessing(true);
    setError(null);
    setEmbeddingData(null);

    try {
      const response = await fetch("/api/embed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: EmbeddingResponse = await response.json();
      setEmbeddingData(data);
      
      // Calculate similarity with sample texts
      calculateSimilarities(inputText, data.embedding);
    } catch (err) {
      console.error("Embedding error:", err);
      setError("Failed to process text. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateSimilarities = async (inputText: string, inputEmbedding: number[]) => {
    try {
      const similarities: SimilarityResult[] = [];

      for (const sampleText of sampleTexts) {
        const response = await fetch("/api/embed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: sampleText }),
        });

        if (response.ok) {
          const data: EmbeddingResponse = await response.json();
          const similarity = cosineSimilarity(inputEmbedding, data.embedding);
          similarities.push({
            text: sampleText,
            similarity,
            rank: 0
          });
        }
      }

      // Sort by similarity (highest first) and add ranking
      similarities.sort((a, b) => b.similarity - a.similarity);
      similarities.forEach((item, index) => {
        item.rank = index + 1;
      });

      setSimilarityResults(similarities);
    } catch (err) {
      console.error("Similarity calculation error:", err);
    }
  };

  const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
    if (vecA.length !== vecB.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    
    for (let i = 0; i < vecA.length; i++) {
      dotProduct += vecA[i] * vecB[i];
      normA += vecA[i] * vecA[i];
      normB += vecB[i] * vecB[i];
    }
    
    if (normA === 0 || normB === 0) return 0;
    
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  };

  const getSimilarityColor = (similarity: number) => {
    if (similarity > 0.8) return "text-green-600";
    if (similarity > 0.6) return "text-yellow-600";
    if (similarity > 0.4) return "text-orange-600";
    return "text-red-600";
  };

  const getSimilarityBadge = (similarity: number) => {
    if (similarity > 0.8) return "bg-green-100 text-green-800 border-green-200";
    if (similarity > 0.6) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    if (similarity > 0.4) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-600" />
          AI Text Analysis & Embeddings
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Sentence Transformers
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Working
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Enter text for AI analysis:
            </label>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Describe your symptoms, health concern, or any text you want to analyze..."
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={processEmbedding}
              disabled={!inputText.trim() || isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4 mr-2" />
                  Analyze with AI
                </>
              )}
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                setInputText("");
                setEmbeddingData(null);
                setSimilarityResults([]);
                setError(null);
              }}
            >
              Clear
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Results Tabs */}
        {embeddingData && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="embedding" className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Embedding Data
              </TabsTrigger>
              <TabsTrigger value="similarity" className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Similarity Analysis
              </TabsTrigger>
              <TabsTrigger value="visualization" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Visualization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="embedding" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Embedding Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span className="font-medium">{embeddingData.dim}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Vector Length:</span>
                      <span className="font-medium">{embeddingData.embedding.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Model:</span>
                      <span className="font-medium">all-mpnet-base-v2</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Sample Values</h4>
                  <div className="text-xs font-mono space-y-1 max-h-32 overflow-y-auto">
                    {embeddingData.embedding.slice(0, 10).map((value, index) => (
                      <div key={index} className="flex justify-between">
                        <span>[{index}]:</span>
                        <span>{value.toFixed(6)}</span>
                      </div>
                    ))}
                    {embeddingData.embedding.length > 10 && (
                      <div className="text-gray-500 italic">
                        ... and {embeddingData.embedding.length - 10} more values
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="similarity" className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Similarity with Healthcare Topics
                </h4>
                <p className="text-sm text-gray-600">
                  How similar is your text to common healthcare scenarios
                </p>
              </div>
              
              <div className="space-y-3">
                {similarityResults.map((result) => (
                  <div key={result.text} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-gray-100 text-gray-700">
                        #{result.rank}
                      </Badge>
                      <span className="text-sm">{result.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getSimilarityBadge(result.similarity)}
                      >
                        {(result.similarity * 100).toFixed(1)}%
                      </Badge>
                      <span className={`text-sm font-medium ${getSimilarityColor(result.similarity)}`}>
                        {result.similarity.toFixed(3)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="visualization" className="space-y-4">
              <div className="text-center mb-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Embedding Visualization
                </h4>
                <p className="text-sm text-gray-600">
                  Visual representation of your text's semantic features
                </p>
              </div>
              
              <div className="grid grid-cols-10 gap-1 p-4 bg-gray-50 rounded-lg">
                {embeddingData.embedding.slice(0, 100).map((value, index) => (
                  <div
                    key={index}
                    className="w-4 h-4 rounded-sm"
                    style={{
                      backgroundColor: `rgba(59, 130, 246, ${Math.abs(value)})`,
                      opacity: Math.abs(value) > 0.1 ? 1 : 0.3
                    }}
                    title={`Dimension ${index}: ${value.toFixed(4)}`}
                  />
                ))}
              </div>
              
              <div className="text-center text-sm text-gray-600">
                <p>Each square represents one dimension of the {embeddingData.dim}-dimensional vector</p>
                <p>Darker squares indicate higher absolute values</p>
              </div>
            </TabsContent>
          </Tabs>
        )}

        {/* Information Panel */}
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">How This Works</h4>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Text Embeddings:</strong> Your text is converted to a high-dimensional numerical vector</p>
            <p>• <strong>Semantic Analysis:</strong> The AI understands meaning, not just words</p>
            <p>• <strong>Similarity Search:</strong> Compare your text with healthcare scenarios</p>
            <p>• <strong>Applications:</strong> Symptom matching, medical query understanding, content recommendation</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
