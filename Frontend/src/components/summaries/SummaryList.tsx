
import { useState } from "react";
import { 
  Copy, 
  RefreshCw, 
  Trash2, 
  FileText, 
  ChevronDown,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Summary } from "@/types/summary";

interface SummaryListProps {
  summaries: Summary[];
  onCreateNewSummary: () => void;
}

export default function SummaryList({ summaries, onCreateNewSummary }: SummaryListProps) {
  return (
    <div className="space-y-4">
      {summaries.map((summary) => (
        <Collapsible key={summary.id} className="border border-border rounded-md overflow-hidden">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <FileText size={16} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-medium line-clamp-1">{summary.title}</p>
                <p className="text-xs text-muted-foreground">{summary.wordCount} words • {summary.date}</p>
              </div>
            </div>
            <ChevronDown size={16} className="text-muted-foreground" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="border-t border-border p-3 bg-muted/30">
              <p className="text-sm mb-3">{summary.text}</p>
              <div className="flex flex-wrap gap-2 justify-end">
                <Button size="sm" variant="outline">
                  <Copy size={14} className="mr-1" /> Copy
                </Button>
                <Button size="sm" variant="outline">
                  <RefreshCw size={14} className="mr-1" /> Regenerate
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      ))}
      
      <Button variant="outline" className="w-full" onClick={onCreateNewSummary}>
        <Plus size={16} className="mr-1" /> Create New Summary
      </Button>
    </div>
  );
}
