
import { useState } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/DashboardLayout";
import { ImagePromptForm } from "@/components/image-generator/ImagePromptForm";
import { ImagePreview } from "@/components/image-generator/ImagePreview";
import { ImageGallery } from "@/components/image-generator/ImageGallery";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [showGeneratedImage, setShowGeneratedImage] = useState(false);
  
  const handleImageGenerated = () => {
    setShowGeneratedImage(true);
  };
  
  const handleClosePreview = () => {
    setShowGeneratedImage(false);
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
            
            <ImagePromptForm 
              onImageGenerated={handleImageGenerated}
              onPromptChange={(newPrompt) => setPrompt(newPrompt)}
            />
            
            {/* Generated image preview */}
            {showGeneratedImage && (
              <ImagePreview 
                prompt={prompt} 
                onClose={handleClosePreview}
              />
            )}
          </div>
        </motion.div>
        
        {/* Right side - Image gallery */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ImageGallery />
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
