
import { useState } from "react";
import { Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";

interface ImagePromptFormProps {
  onImageGenerated: () => void;
  onPromptChange?: (prompt: string) => void;
}

export function ImagePromptForm({ onImageGenerated, onPromptChange }: ImagePromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    if (onPromptChange) {
      onPromptChange(newPrompt);
    }
  };
  
  const handleGenerateImage = () => {
    if (prompt.length < 10) {
      toast.error("Please enter a more detailed description");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      onImageGenerated();
      toast.success("Image generated successfully");
    }, 2000);
  };
  
  return (
    <div>
      <div className="mb-6">
        <Label htmlFor="prompt" className="text-base mb-2 block">Describe your image</Label>
        <Textarea
          id="prompt"
          placeholder="Describe the scene you want to generate in detail (e.g., A majestic dragon soaring over a snow-capped mountain range at sunset, with golden light reflecting off its scales)"
          className="min-h-[120px] mb-2"
          value={prompt}
          onChange={handlePromptChange}
        />
        <p className="text-xs text-muted-foreground">
          Be specific about details, lighting, atmosphere, and style for better results
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-sm mb-2 block">Art Style</Label>
          <Select defaultValue="fantasy">
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fantasy">Fantasy Art</SelectItem>
              <SelectItem value="realistic">Realistic</SelectItem>
              <SelectItem value="anime">Anime/Manga</SelectItem>
              <SelectItem value="digital">Digital Art</SelectItem>
              <SelectItem value="painterly">Painterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Aspect Ratio</Label>
          <Select defaultValue="square">
            <SelectTrigger>
              <SelectValue placeholder="Select ratio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="square">Square (1:1)</SelectItem>
              <SelectItem value="portrait">Portrait (3:4)</SelectItem>
              <SelectItem value="landscape">Landscape (4:3)</SelectItem>
              <SelectItem value="wide">Widescreen (16:9)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Level of Detail</Label>
          <Slider
            defaultValue={[7]}
            max={10}
            step={1}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Simple</span>
            <span>Detailed</span>
          </div>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Lighting Intensity</Label>
          <Slider
            defaultValue={[5]}
            max={10}
            step={1}
            className="my-4"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Subtle</span>
            <span>Dramatic</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={handleGenerateImage}
          disabled={isGenerating || prompt.length < 10}
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Image size={18} className="mr-2" /> Generate Image
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
