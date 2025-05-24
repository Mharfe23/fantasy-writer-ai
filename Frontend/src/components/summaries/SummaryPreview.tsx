
import { Copy, Share2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface SummaryPreviewProps {
  showGeneratedSummary: boolean;
  onCopySummary: () => void;
  onSaveSummary: () => void;
}

export default function SummaryPreview({ 
  showGeneratedSummary, 
  onCopySummary, 
  onSaveSummary 
}: SummaryPreviewProps) {
  if (!showGeneratedSummary) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-8 border-t border-border pt-6"
    >
      <h3 className="text-lg font-semibold mb-4">Generated Summary</h3>
      
      <div className="bg-muted p-4 rounded-lg mb-4">
        <p className="italic text-sm mb-3">
          In this fantasy narrative, the protagonist discovers a hidden crystal kingdom beneath the mountains where time flows differently. The story follows their journey as they navigate both political intrigue and ancient magic while trying to prevent the kingdom's power source from being exploited by outside forces. A central theme is the balance between worlds and the protagonist's struggle to find their way back home while protecting this newfound realm.
        </p>
        
        <p className="italic text-sm">
          Key elements include the time dilation effect between the two worlds, the crystal-based magic system that powers the kingdom, and the moral dilemma faced by the protagonist when they realize returning home might endanger the crystal kingdom's existence. The climax features a confrontation between forces seeking to exploit the crystals and those who wish to preserve the kingdom's isolation for its own protection.
        </p>
      </div>
      
      <div className="mt-4 p-4 rounded-md bg-muted/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-primary" />
            <p className="text-sm font-medium">Summary Details</p>
          </div>
          <div className="text-xs text-muted-foreground">138 words</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="text-xs bg-background/80 px-2 py-1 rounded-md">Type: Concise</div>
          <div className="text-xs bg-background/80 px-2 py-1 rounded-md">Focus: Plot & Events</div>
          <div className="text-xs bg-background/80 px-2 py-1 rounded-md">Style: Neutral</div>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 justify-end">
        <Button variant="outline" onClick={onCopySummary}>
          <Copy size={16} className="mr-2" /> Copy
        </Button>
        <Button variant="outline">
          <Share2 size={16} className="mr-2" /> Share
        </Button>
        <Button onClick={onSaveSummary}>
          <FileText size={16} className="mr-2" /> Save Summary
        </Button>
      </div>
    </motion.div>
  );
}
