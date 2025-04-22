
import { useState } from "react";
import { motion } from "framer-motion";
import { Image, Download, Share, Save, Plus, ArrowDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

// Dummy data for demonstration
const generatedImages = [
  { id: 1, prompt: "A majestic dragon soaring over a fantasy kingdom", date: "2 hours ago" },
  { id: 2, prompt: "An ancient wizard tower glowing with magical energy", date: "yesterday" },
  { id: 3, prompt: "A mysterious forest with glowing plants and floating crystals", date: "3 days ago" },
  { id: 4, prompt: "A powerful sorceress casting a spell in a magical storm", date: "5 days ago" },
];

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGeneratedImage, setShowGeneratedImage] = useState(false);
  
  const handleGenerateImage = () => {
    if (prompt.length < 10) {
      toast.error("Please enter a more detailed description");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      setShowGeneratedImage(true);
      toast.success("Image generated successfully");
    }, 2000);
  };
  
  const handleSaveImage = () => {
    toast.success("Image saved to your gallery");
  };
  
  const handleDownloadImage = () => {
    toast.success("Image downloaded successfully");
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Image generation controls */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-lg border border-border p-6">
            <h2 className="text-2xl font-semibold mb-6">Create New Image</h2>
            
            <div className="mb-6">
              <Label htmlFor="prompt" className="text-base mb-2 block">Describe your image</Label>
              <Textarea
                id="prompt"
                placeholder="Describe the scene you want to generate in detail (e.g., A majestic dragon soaring over a snow-capped mountain range at sunset, with golden light reflecting off its scales)"
                className="min-h-[120px] mb-2"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
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
            
            {/* Generated image preview */}
            {showGeneratedImage && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 border-t border-border pt-6"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Generated Image</h3>
                  <button 
                    onClick={() => setShowGeneratedImage(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="aspect-square w-full max-w-2xl mx-auto rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <div className="p-6 text-center">
                    <Image size={64} className="mx-auto mb-2 text-purple-500/70" />
                    <p className="text-sm text-muted-foreground">Preview of your generated image</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 rounded-md bg-muted">
                  <p className="text-sm font-medium mb-1">Prompt:</p>
                  <p className="text-sm text-muted-foreground">{prompt}</p>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-4 justify-end">
                  <Button variant="outline">
                    <Share size={16} className="mr-2" /> Share
                  </Button>
                  <Button variant="outline" onClick={handleDownloadImage}>
                    <Download size={16} className="mr-2" /> Download
                  </Button>
                  <Button onClick={handleSaveImage}>
                    <Save size={16} className="mr-2" /> Save to Gallery
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
        
        {/* Right side - Image gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="bg-card rounded-lg border border-border p-6">
            <h3 className="text-lg font-semibold mb-4">Your Image Gallery</h3>
            
            <div className="space-y-4">
              {generatedImages.map((image) => (
                <div 
                  key={image.id} 
                  className="border border-border rounded-md overflow-hidden hover:border-primary/50 transition-colors cursor-pointer"
                >
                  <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                    <Image size={24} className="text-purple-500/70" />
                  </div>
                  <div className="p-3">
                    <p className="text-sm line-clamp-1">{image.prompt}</p>
                    <p className="text-xs text-muted-foreground">{image.date}</p>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full">
                <ArrowDown size={16} className="mr-1" /> Load More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
