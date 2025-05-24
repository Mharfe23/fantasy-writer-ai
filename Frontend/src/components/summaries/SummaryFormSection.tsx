
import { motion } from "framer-motion";
import NewSummaryForm from "@/components/summaries/NewSummaryForm";
import SummaryPreview from "@/components/summaries/SummaryPreview";

interface SummaryFormSectionProps {
  showGeneratedSummary: boolean;
  onSummaryGenerated: () => void;
  onCopySummary: () => void;
  onSaveSummary: () => void;
}

export default function SummaryFormSection({
  showGeneratedSummary,
  onSummaryGenerated,
  onCopySummary,
  onSaveSummary
}: SummaryFormSectionProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="lg:col-span-2"
    >
      <div className="bg-card rounded-lg border border-border p-6">
        <NewSummaryForm onSummaryGenerated={onSummaryGenerated} />
        
        {/* Generated summary preview */}
        <SummaryPreview 
          showGeneratedSummary={showGeneratedSummary} 
          onCopySummary={onCopySummary} 
          onSaveSummary={onSaveSummary} 
        />
      </div>
    </motion.div>
  );
}
