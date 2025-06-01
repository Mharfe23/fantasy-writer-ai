import { useState, useEffect } from "react";
import { CirclePlay, Upload } from "lucide-react";
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
  generateAudio,
  getAvailableVoices,
  createCustomVoice,
  testCustomVoice,
  type AudioGenerationRequest,
  type CustomVoiceRequest
} from "@/services/audioService";

interface NewAudioFormProps {
  onAudioGenerated: () => void;
  userId: string;
}

export default function NewAudioForm({ onAudioGenerated, userId }: NewAudioFormProps) {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [voice, setVoice] = useState("af_heart");
  const [speed, setSpeed] = useState([1]);
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  
  // Custom voice creation state
  const [showCustomVoiceForm, setShowCustomVoiceForm] = useState(false);
  const [customVoiceName, setCustomVoiceName] = useState("");
  const [voice1, setVoice1] = useState("");
  const [voice2, setVoice2] = useState("");
  const [weight1, setWeight1] = useState(0.5);
  const [weight2, setWeight2] = useState(0.5);
  const [isTestingVoice, setIsTestingVoice] = useState(false);
  const [testAudioUrl, setTestAudioUrl] = useState<string | null>(null);
  
  useEffect(() => {
    loadVoices();
  }, []);
  
  const loadVoices = async () => {
    try {
      setIsLoadingVoices(true);
      const voices = await getAvailableVoices();
      setAvailableVoices(voices);
      if (voices.length > 0) {
        setVoice(voices[0]);
        setVoice1(voices[0]);
        setVoice2(voices[1] || voices[0]);
      }
    } catch (error) {
      toast.error("Failed to load available voices");
    } finally {
      setIsLoadingVoices(false);
    }
  };
  
  const handleGenerateAudio = async () => {
    if (text.length < 10 && activeTab === "text") {
      toast.error("Please enter more text to generate audio");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      toast.info("Generating audio...");
      
      const response = await generateAudio(
        {
          text,
          voice,
          speed: speed[0]
        },
        userId
      );
      
      // Store globally for the preview component
      window.lastGeneratedAudio = {
        prompt: text,
        voice: voice,
        speed: speed[0],
        audioUrl: response.audioUrl,  // Keep MinIO URL for storage
        audioData: response.audioData,  // Add direct audio data for immediate playback
        timestamp: response.timestamp
      };
      
      onAudioGenerated();
      toast.success("Audio generated successfully!");
    } catch (error) {
      console.error("Audio generation failed:", error);
      toast.error("Failed to generate audio. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleTestCustomVoice = async () => {
    if (!voice1 || !voice2) {
      toast.error("Please select both voices");
      return;
    }
    
    setIsTestingVoice(true);
    
    try {
      const response = await testCustomVoice({
        text: "This is a test of the custom voice blend.",
        voice1,
        voice2,
        weight1,
        weight2
      });
      
      // Create a data URL from the base64 audio data
      const audioDataUrl = `data:audio/wav;base64,${response.audioData}`;
      setTestAudioUrl(audioDataUrl);
      toast.success("Custom voice test generated!");
    } catch (error) {
      console.error("Custom voice test failed:", error);
      toast.error("Failed to test custom voice");
    } finally {
      setIsTestingVoice(false);
    }
  };
  
  const handleCreateCustomVoice = async () => {
    if (!customVoiceName || !voice1 || !voice2) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const response = await createCustomVoice(
        {
          voiceName: customVoiceName,
          voice1,
          voice2,
          weight1,
          weight2
        },
        userId
      );
      
      toast.success("Custom voice created successfully!");
      setShowCustomVoiceForm(false);
      setCustomVoiceName("");
      // Refresh available voices
      await loadVoices();
    } catch (error) {
      console.error("Custom voice creation failed:", error);
      toast.error("Failed to create custom voice");
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create New Audio</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="text">From Text</TabsTrigger>
          <TabsTrigger value="upload">Upload Script</TabsTrigger>
          <TabsTrigger value="custom">Custom Voice</TabsTrigger>
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
              Current: {text.length} characters. Works best with clear, well-punctuated text.
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
        
        <TabsContent value="custom">
          <div className="space-y-6">
            <div>
              <Label className="text-base mb-2 block">Voice Name</Label>
              <Input
                placeholder="Enter a name for your custom voice..."
                value={customVoiceName}
                onChange={(e) => setCustomVoiceName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-base mb-2 block">First Voice</Label>
                <Select value={voice1} onValueChange={setVoice1}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voiceOption) => (
                      <SelectItem key={voiceOption} value={voiceOption}>
                        {voiceOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-base mb-2 block">Second Voice</Label>
                <Select value={voice2} onValueChange={setVoice2}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVoices.map((voiceOption) => (
                      <SelectItem key={voiceOption} value={voiceOption}>
                        {voiceOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label className="text-base mb-2 block">Voice Blend Weights</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm mb-2 block">First Voice Weight</Label>
                  <Slider
                    value={[weight1]}
                    onValueChange={([value]) => {
                      setWeight1(value);
                      setWeight2(1 - value);
                    }}
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    className="my-4"
                  />
                  <p className="text-sm text-muted-foreground">{weight1.toFixed(1)}</p>
                </div>
                
                <div>
                  <Label className="text-sm mb-2 block">Second Voice Weight</Label>
                  <Slider
                    value={[weight2]}
                    onValueChange={([value]) => {
                      setWeight2(value);
                      setWeight1(1 - value);
                    }}
                    min={0.1}
                    max={0.9}
                    step={0.1}
                    className="my-4"
                  />
                  <p className="text-sm text-muted-foreground">{weight2.toFixed(1)}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button
                onClick={handleTestCustomVoice}
                disabled={isTestingVoice || !voice1 || !voice2}
              >
                {isTestingVoice ? "Testing..." : "Test Voice Blend"}
              </Button>
              
              <Button
                onClick={handleCreateCustomVoice}
                disabled={!customVoiceName || !voice1 || !voice2}
              >
                Create Custom Voice
              </Button>
            </div>
            
            {testAudioUrl && (
              <div className="mt-4">
                <Label className="text-base mb-2 block">Test Result</Label>
                <audio controls className="w-full" src={testAudioUrl}>
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      
      {activeTab !== "custom" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label className="text-sm mb-2 block">Voice Selection</Label>
            <Select value={voice} onValueChange={setVoice}>
              <SelectTrigger>
                <SelectValue placeholder="Select voice" />
              </SelectTrigger>
              <SelectContent>
                {availableVoices.map((voiceOption) => (
                  <SelectItem key={voiceOption} value={voiceOption}>
                    {voiceOption}
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
      )}
      
      {activeTab !== "custom" && (
        <div className="flex justify-end">
          <Button 
            size="lg" 
            onClick={handleGenerateAudio}
            disabled={isGenerating || (text.length < 10 && activeTab === "text")}
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <CirclePlay size={18} className="mr-2" /> Generate Audio
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
