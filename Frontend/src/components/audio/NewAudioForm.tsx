
import { useState } from "react";
import { CirclePlay, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface NewAudioFormProps {
  onAudioGenerated: () => void;
}

export default function NewAudioForm({ onAudioGenerated }: NewAudioFormProps) {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [voice, setVoice] = useState("roger");
  const [speed, setSpeed] = useState([1]);
  const [quality, setQuality] = useState("standard");
  const [format, setFormat] = useState("mp3");
  
  const handleGenerateAudio = () => {
    if (text.length < 10 && activeTab === "text") {
      toast.error("Please enter more text to generate audio");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      onAudioGenerated();
      toast.success("Audio generated successfully");
    }, 2000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create New Audio</h2>
      
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
              Maximum 5000 characters. Current: {text.length} characters.
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
          <Label className="text-sm mb-2 block">Voice Selection</Label>
          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger>
              <SelectValue placeholder="Select voice" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="roger">Roger (Male, British)</SelectItem>
              <SelectItem value="sarah">Sarah (Female, American)</SelectItem>
              <SelectItem value="brian">Brian (Male, American)</SelectItem>
              <SelectItem value="lily">Lily (Female, British)</SelectItem>
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
            <span>Slow</span>
            <span>Normal ({speed[0]}x)</span>
            <span>Fast</span>
          </div>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Audio Quality</Label>
          <Select value={quality} onValueChange={setQuality}>
            <SelectTrigger>
              <SelectValue placeholder="Select quality" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Audio Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger>
              <SelectValue placeholder="Select format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mp3">MP3</SelectItem>
              <SelectItem value="wav">WAV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
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
    </div>
  );
}
