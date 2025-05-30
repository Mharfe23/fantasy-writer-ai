
import { useState, useEffect } from "react";
import { ArrowDown, Image, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStoredImages, GeneratedImage } from "@/services/imageGenerationService";

export function ImageGallery() {
  const [images, setImages] = useState<GeneratedImage[]>([]);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = () => {
    const storedImages = getStoredImages();
    setImages(storedImages);
  };

  const deleteImage = (imageId: string) => {
    const updatedImages = images.filter(img => img.id !== imageId);
    localStorage.setItem('generated-images', JSON.stringify(updatedImages));
    setImages(updatedImages);
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <h3 className="text-lg font-semibold mb-4">Your Image Gallery</h3>
      
      <div className="space-y-4">
        {images.length > 0 ? (
          images.map((image) => (
            <div 
              key={image.id} 
              className="border border-border rounded-md overflow-hidden hover:border-primary/50 transition-colors group"
            >
              <div className="aspect-video bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center relative">
                <img 
                  src={image.imageUrl} 
                  alt={image.prompt}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => deleteImage(image.id)}
                  className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="p-3">
                <p className="text-sm line-clamp-2 mb-1">{image.prompt}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDate(new Date(image.timestamp))}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Image size={32} className="mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No images generated yet</p>
            <p className="text-xs text-muted-foreground">Generate your first image to see it here</p>
          </div>
        )}
      </div>
    </div>
  );
}
