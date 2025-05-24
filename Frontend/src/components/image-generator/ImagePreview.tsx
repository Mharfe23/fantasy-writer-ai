
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Image, X, Share, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { saveGeneratedImage } from "@/services/imageGenerationService";

interface ImagePreviewProps {
  prompt: string;
  onClose: () => void;
}

interface GeneratedImageData {
  prompt: string;
  imageUrl: string;
  timestamp: string;
}

export function ImagePreview({ prompt, onClose }: ImagePreviewProps) {
  const [imageData, setImageData] = useState<GeneratedImageData | null>(null);

  useEffect(() => {
    // Get the generated image data from global storage
    const generatedImage = (window as any).lastGeneratedImage as GeneratedImageData;
    if (generatedImage) {
      setImageData(generatedImage);
    }
  }, []);

  const handleSaveImage = () => {
    if (imageData) {
      saveGeneratedImage(imageData.prompt, imageData.imageUrl);
      toast.success("Image saved to your gallery");
    }
  };
  
  const handleDownloadImage = () => {
    if (imageData) {
      const link = document.createElement('a');
      link.href = imageData.imageUrl;
      link.download = `generated-image-${Date.now()}.png`;
      link.click();
      toast.success("Image downloaded successfully");
    }
  };

  const handleShareImage = async () => {
    if (imageData && navigator.share) {
      try {
        // Convert data URL to blob for sharing
        const response = await fetch(imageData.imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'generated-image.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Generated Image',
          text: `Generated with prompt: ${imageData.prompt}`,
          files: [file]
        });
      } catch (error) {
        // Fallback to copying image URL
        navigator.clipboard.writeText(imageData.imageUrl);
        toast.success("Image URL copied to clipboard");
      }
    } else {
      toast.info("Sharing not supported on this device");
    }
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 border-t border-border pt-6"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Generated Image</h3>
        <button 
          onClick={onClose}
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>
      
      <div className="aspect-square w-full max-w-2xl mx-auto rounded-lg overflow-hidden bg-muted">
        {imageData ? (
          <img 
            src={imageData.imageUrl} 
            alt={`Generated: ${imageData.prompt}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="p-6 text-center">
              <Image size={64} className="mx-auto mb-2 text-purple-500/70" />
              <p className="text-sm text-muted-foreground">Loading generated image...</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-4 rounded-md bg-muted">
        <p className="text-sm font-medium mb-1">Prompt:</p>
        <p className="text-sm text-muted-foreground">{imageData?.prompt || prompt}</p>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 justify-end">
        <Button variant="outline" onClick={handleShareImage}>
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
  );
}
