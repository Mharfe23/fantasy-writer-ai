
import { useState } from "react";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import SummaryFormSection from "@/components/summaries/SummaryFormSection";
import SummariesSidebar from "@/components/summaries/SummariesSidebar";

// Types
interface Summary {
  id: number;
  title: string;
  wordCount: number;
  date: string;
  text: string;
}

// Dummy data for demonstration
const summaries = [
  { 
    id: 1, 
    title: "The Crystal Kingdom - Full Story Summary", 
    wordCount: 250, 
    date: "2 hours ago",
    text: "A young hero discovers a hidden crystal kingdom beneath the mountains, where time flows differently. As they navigate political intrigue and ancient magic, they must find a way to prevent the kingdom's power source from being exploited by outside forces, while also finding a way back to their own world."
  },
  { 
    id: 2, 
    title: "Dragons of the North - Chapter Breakdown", 
    wordCount: 180, 
    date: "yesterday",
    text: "The northern territories are being ravaged by a sudden surge in dragon attacks. The protagonist, a former dragon hunter, is called out of retirement to investigate the unusual behavior. What they discover is that climate change has disrupted the dragons' ancient breeding grounds, forcing them south into human territories."
  },
  { 
    id: 3, 
    title: "The Enchanted Forest - Plot Points", 
    wordCount: 120, 
    date: "3 days ago",
    text: "The enchanted forest holds many secrets, including ancient spirits that protect the boundaries between worlds. When a logging company threatens to destroy part of the forest, these spirits awaken and begin to affect the nearby town in mysterious ways. Only a child who can see the spirits has any hope of resolving the conflict."
  },
];

export default function Summaries() {
  const [showGeneratedSummary, setShowGeneratedSummary] = useState(false);
  
  const handleSummaryGenerated = () => {
    setShowGeneratedSummary(true);
  };
  
  const handleCopySummary = () => {
    toast.success("Summary copied to clipboard");
  };
  
  const handleSaveSummary = () => {
    toast.success("Summary saved to your library");
  };

  const handleCreateNewSummary = () => {
    setShowGeneratedSummary(false);
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left side - Summary generation controls */}
        <SummaryFormSection 
          showGeneratedSummary={showGeneratedSummary}
          onSummaryGenerated={handleSummaryGenerated}
          onCopySummary={handleCopySummary}
          onSaveSummary={handleSaveSummary}
        />
        
        {/* Right side - Summary gallery */}
        <SummariesSidebar
          summaries={summaries}
          onCreateNewSummary={handleCreateNewSummary}
        />
      </div>
    </DashboardLayout>
  );
}
