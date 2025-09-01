import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Play, Square, Download, Loader2, Volume2 } from "lucide-react";

interface VoiceProcessorProps {
  onTranscript?: (text: string) => void;
  language?: string;
}

export default function VoiceProcessor({ onTranscript, language = "en" }: VoiceProcessorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        setAudioBlob(audioBlob);
        processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError("Failed to access microphone. Please check permissions.");
      console.error("Recording error:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("language", language);

      const response = await fetch("/api/voice/speech-to-text", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTranscript(data.text);
      
      if (onTranscript) {
        onTranscript(data.text);
      }
    } catch (err) {
      console.error("Processing error:", err);
      setError("Failed to process audio. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopAudio = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const downloadAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `voice-recording-${new Date().toISOString().slice(0, 19)}.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const clearRecording = () => {
    setTranscript("");
    setAudioBlob(null);
    setError(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-600" />
          Voice Processor
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {language.toUpperCase()}
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Whisper AI
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="flex justify-center gap-4">
          {!isRecording ? (
            <Button
              onClick={startRecording}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700"
            >
              <Mic className="w-4 h-4 mr-2" />
              Start Recording
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="bg-gray-600 hover:bg-gray-700"
            >
              <MicOff className="w-4 h-4 mr-2" />
              Stop Recording
            </Button>
          )}
        </div>

        {/* Status Indicators */}
        {isRecording && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 text-red-800 rounded-full">
              <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
              Recording... Speak now
            </div>
          </div>
        )}

        {isProcessing && (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full">
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing audio with AI...
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Audio Playback Controls */}
        {audioBlob && !isProcessing && (
          <div className="flex justify-center gap-2">
            {!isPlaying ? (
              <Button onClick={playAudio} variant="outline" size="sm">
                <Play className="w-4 h-4 mr-2" />
                Play Recording
              </Button>
            ) : (
              <Button onClick={stopAudio} variant="outline" size="sm">
                <Square className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}
            <Button onClick={downloadAudio} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={clearRecording} variant="outline" size="sm">
              Clear
            </Button>
          </div>
        )}

        {/* Transcript Display */}
        {transcript && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Transcript:</label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Transcript will appear here..."
              className="min-h-[100px] resize-none"
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Characters: {transcript.length}</span>
              <span>Words: {transcript.split(/\s+/).filter(word => word.length > 0).length}</span>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• Click "Start Recording" and speak clearly into your microphone</p>
          <p>• The AI will transcribe your speech using advanced Whisper technology</p>
          <p>• You can edit the transcript and use it for further processing</p>
        </div>
      </CardContent>
    </Card>
  );
}
