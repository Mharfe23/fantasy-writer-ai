
import { useState, useEffect } from "react";
import { CirclePlay, Upload, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  generateAudioWithKokoro, 
  saveGeneratedAudio, 
  AMERICAN_ENGLISH_VOICES,
  setFalApiKey,
  getFalApiKey,
  type VoiceType
} from "@/services/kokoroTtsService";

interface NewAudioFormProps {
  onAudioGenerated: () => void;
}

export default function NewAudioForm({ onAudioGenerated }: NewAudioFormProps) {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [voice, setVoice] = useState<VoiceType>("af_heart");
  const [speed, setSpeed] = useState([1]);
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  
  useEffect(() => {
    const storedApiKey = getFalApiKey();
    if (storedApiKey) {
      setApiKey(storedApiKey);
    } else {
      setShowApiKeyInput(true);
    }
  }, []);
  
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      setFalApiKey(apiKey.trim());
      setShowApiKeyInput(false);
      toast.success("API key saved successfully!");
    } else {
      toast.error("Please enter a valid API key");
    }
  };
  
  const handleGenerateAudio = async () => {
    if (text.length < 10 && activeTab === "text") {
      toast.error("Please enter more text to generate audio");
      return;
    }
    
    if (!getFalApiKey()) {
      toast.error("Please set your FAL API key first");
      setShowApiKeyInput(true);
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast.info("Generating audio with Kokoro TTS...");
      
      const audioUrl = await generateAudioWithKokoro({
        prompt: text,
        voice: voice,
        speed: speed[0]
      });
      
      // Save the generated audio
      const savedAudio = saveGeneratedAudio({
        prompt: text,
        voice: voice,
        speed: speed[0]
      }, audioUrl);
      
      // Store globally for the preview component
      window.lastGeneratedAudio = {
        prompt: text,
        voice: voice,
        speed: speed[0],
        audioUrl: audioUrl,
        timestamp: new Date().toISOString()
      };
      
      onAudioGenerated();
      toast.success("Audio generated successfully with Kokoro TTS!");
    } catch (error) {
      console.error("Audio generation failed:", error);
      toast.error("Failed to generate audio. Please check your FAL API key and try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create New Audio with Kokoro TTS</h2>
      
      {showApiKeyInput && (
        <div className="mb-6 p-4 rounded-md bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Key size={16} className="text-blue-600" />
            <h3 className="font-medium text-blue-800">FAL API Key Required</h3>
          </div>
          <p className="text-sm text-blue-700 mb-3">
            Enter your FAL API key to use Kokoro TTS. You can get one from fal.ai
          </p>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Enter your FAL API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveApiKey}>Save</Button>
          </div>
        </div>
      )}
      
      {!showApiKeyInput && (
        <div className="mb-4 p-3 rounded-md bg-green-50 border border-green-200">
          <p className="text-sm text-green-800">
            ✓ API key configured. Ready to generate audio with Kokoro TTS.
            <Button 
              variant="link" 
              size="sm" 
              onClick={() => setShowApiKeyInput(true)}
              className="ml-2 p-0 h-auto text-green-700"
            >
              Change key
            </Button>
          </p>
        </div>
      )}
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="text">From Text</TabsTrigger>
          <TabsTrigger value="upload">Upload Script</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <div className="mb-6">
            <Label htmlFor="text" className="text-base mb-2 block">Enter your text</Label>
            <Textarea
              id="text"
              placeholder="Enter the text you want to convert to audio..."
              className="min-h-[200px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Current: {text.length} characters. Kokoro TTS works best with clear, well-punctuated text.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="border-2 border-dashed border-border rounded-lg p-10 text-center mb-6">
            <Upload size={40} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Script File</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your text file here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports .txt, .docx, or .pdf files up to 10MB
            </p>
            <Button>
              <Upload size={16} className="mr-2" /> Browse Files
            </Button>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-sm mb-2 block">Voice Selection (Kokoro TTS)</Label>
          <Select value={voice} onValueChange={(value: VoiceType) => setVoice(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              {AMERICAN_ENGLISH_VOICES.map((voiceOption) => (
                <SelectItem key={voiceOption.value} value={voiceOption.value}>
                  {voiceOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Reading Speed</Label>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            min={0.5}
            max={2}
            step={0.1}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Slow (0.5x)</span>
            <span>Current ({speed[0]}x)</span>
            <span>Fast (2x)</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={handleGenerateAudio}
          disabled={isGenerating || (text.length < 10 && activeTab === "text") || showApiKeyInput}
        >
          {isGenerating ? (
            <>Generating with Kokoro TTS...</>
          ) : (
            <>
              <CirclePlay size={18} className="mr-2" /> Generate Audio
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
