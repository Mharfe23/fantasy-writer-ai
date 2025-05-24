
import { useState } from "react";
import { motion } from "framer-motion";
import { Image, X, Share, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ImagePreviewProps {
  prompt: string;
  onClose: () => void;
}

export function ImagePreview({ prompt, onClose }: ImagePreviewProps) {
  const handleSaveImage = () => {
    toast.success("Image saved to your gallery");
  };
  
  const handleDownloadImage = () => {
    toast.success("Image downloaded successfully");
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
  );
}
