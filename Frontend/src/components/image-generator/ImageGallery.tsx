
import { ArrowDown, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dummy data for demonstration
const generatedImages = [
  { id: 1, prompt: "A majestic dragon soaring over a fantasy kingdom", date: "2 hours ago" },
  { id: 2, prompt: "An ancient wizard tower glowing with magical energy", date: "yesterday" },
  { id: 3, prompt: "A mysterious forest with glowing plants and floating crystals", date: "3 days ago" },
  { id: 4, prompt: "A powerful sorceress casting a spell in a magical storm", date: "5 days ago" },
];

export function ImageGallery() {
  return (
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
  );
}
