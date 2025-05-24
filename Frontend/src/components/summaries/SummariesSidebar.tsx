
import { motion } from "framer-motion";
import SummaryList from "@/components/summaries/SummaryList";

interface Summary {
  id: number;
  title: string;
  wordCount: number;
  date: string;
  text: string;
}

interface SummariesSidebarProps {
  summaries: Summary[];
  onCreateNewSummary: () => void;
}

export default function SummariesSidebar({ summaries, onCreateNewSummary }: SummariesSidebarProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Your Summaries</h3>
        <SummaryList 
          summaries={summaries} 
          onCreateNewSummary={onCreateNewSummary} 
        />
      </div>
    </motion.div>
  );
}
