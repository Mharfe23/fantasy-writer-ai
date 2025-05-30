
import { useState } from "react";
import { Image, Eye, EyeOff } from "lucide-react";
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
import { generateImageWithTogether } from "@/services/imageGenerationService";

interface ImagePromptFormProps {
  onImageGenerated: () => void;
  onPromptChange?: (prompt: string) => void;
}

export function ImagePromptForm({ onImageGenerated, onPromptChange }: ImagePromptFormProps) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [showEnhancedPrompt, setShowEnhancedPrompt] = useState(false);
  
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newPrompt = e.target.value;
    setPrompt(newPrompt);
    // Clear enhanced prompt when user changes the original prompt
    setEnhancedPrompt("");
    setShowEnhancedPrompt(false);
    if (onPromptChange) {
      onPromptChange(newPrompt);
    }
  };
  
  const handleGenerateImage = async () => {
    if (prompt.length < 10) {
      toast.error("Please enter a more detailed description");
      return;
    }
    
    setIsGenerating(true);
    setIsEnhancing(true);
    
    try {
      toast.info("Enhancing your prompt with AI...");
      console.log("Starting image generation with prompt:", prompt);
      
      const imageUrl = await generateImageWithTogether(prompt);
      
      // Get the enhanced prompt from global storage and update local state
      const enhancedPromptData = (window as any).lastEnhancedPrompt;
      console.log("Retrieved enhanced prompt data:", enhancedPromptData);
      
      if (enhancedPromptData && enhancedPromptData.enhanced) {
        setEnhancedPrompt(enhancedPromptData.enhanced);
        setShowEnhancedPrompt(true); // Auto-show the enhanced prompt
        console.log("Set enhanced prompt in state:", enhancedPromptData.enhanced);
      }
      
      setIsEnhancing(false);
      toast.info("Generating image with Together.AI...");
      
      // Store the generated image data globally for the preview component
      window.lastGeneratedImage = {
        prompt: enhancedPromptData?.enhanced || prompt,
        imageUrl,
        timestamp: new Date().toISOString()
      };
      
      onImageGenerated();
      toast.success("Image generated successfully with enhanced prompt!");
    } catch (error) {
      console.error("Image generation failed:", error);
      toast.error("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
      setIsEnhancing(false);
    }
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
          Your prompt will be enhanced by AI to improve generation results
        </p>
        
        {/* Enhanced prompt display */}
        {enhancedPrompt && (
          <div className="mt-4 p-4 rounded-md bg-muted border">
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-green-600">✨ AI Enhanced Prompt:</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEnhancedPrompt(!showEnhancedPrompt)}
              >
                {showEnhancedPrompt ? (
                  <>
                    <EyeOff size={14} className="mr-1" /> Hide
                  </>
                ) : (
                  <>
                    <Eye size={14} className="mr-1" /> Show
                  </>
                )}
              </Button>
            </div>
            {showEnhancedPrompt && (
              <div className="space-y-2">
                <div className="text-xs text-muted-foreground">Your original prompt:</div>
                <p className="text-sm bg-background p-2 rounded border italic">
                  "{prompt}"
                </p>
                <div className="text-xs text-muted-foreground">Enhanced version used for generation:</div>
                <p className="text-sm text-foreground leading-relaxed bg-background p-2 rounded border">
                  {enhancedPrompt}
                </p>
              </div>
            )}
          </div>
        )}
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
          {isEnhancing ? (
            <>Enhancing prompt with AI...</>
          ) : isGenerating ? (
            <>Generating with Together.AI...</>
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
