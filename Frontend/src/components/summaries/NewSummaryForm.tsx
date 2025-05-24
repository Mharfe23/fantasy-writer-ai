
import { useState } from "react";
import { FileText, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

interface NewSummaryFormProps {
  onSummaryGenerated: () => void;
}

export default function NewSummaryForm({ onSummaryGenerated }: NewSummaryFormProps) {
  const [text, setText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [summaryType, setSummaryType] = useState("concise");
  const [focus, setFocus] = useState("plot");
  const [style, setStyle] = useState("neutral");
  const [include, setInclude] = useState("key-points");
  
  const handleGenerateSummary = () => {
    if (text.length < 100 && activeTab === "text") {
      toast.error("Please enter more text to generate a meaningful summary");
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false);
      onSummaryGenerated();
      toast.success("Summary generated successfully");
    }, 2000);
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Create Summary</h2>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="text">From Text</TabsTrigger>
          <TabsTrigger value="upload">Upload Content</TabsTrigger>
          <TabsTrigger value="select">Select Project</TabsTrigger>
        </TabsList>
        
        <TabsContent value="text">
          <div className="mb-6">
            <Label htmlFor="text" className="text-base mb-2 block">Enter your text</Label>
            <Textarea
              id="text"
              placeholder="Paste the text you want to summarize here..."
              className="min-h-[250px]"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-1">
              For best results, enter at least 500 words.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="upload">
          <div className="border-2 border-dashed border-border rounded-lg p-10 text-center mb-6">
            <FileText size={40} className="mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Upload Document</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Drag and drop your document here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-4">
              Supports .txt, .docx, or .pdf files up to 10MB
            </p>
            <Button>Browse Files</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="select">
          <div className="mb-6">
            <Label className="text-base mb-2 block">Select Project</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="crystal">The Crystal Kingdom</SelectItem>
                <SelectItem value="dragons">Dragons of the North</SelectItem>
                <SelectItem value="forest">The Enchanted Forest</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="mb-6">
            <Label className="text-base mb-2 block">Select Chapter</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Choose a chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Story</SelectItem>
                <SelectItem value="ch1">Chapter 1: The Beginning</SelectItem>
                <SelectItem value="ch2">Chapter 2: The Journey</SelectItem>
                <SelectItem value="ch3">Chapter 3: The Revelation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label className="text-sm mb-2 block">Summary Type</Label>
          <Select value={summaryType} onValueChange={setSummaryType}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief (1-2 paragraphs)</SelectItem>
              <SelectItem value="concise">Concise (3-5 paragraphs)</SelectItem>
              <SelectItem value="detailed">Detailed (6+ paragraphs)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Focus On</Label>
          <Select value={focus} onValueChange={setFocus}>
            <SelectTrigger>
              <SelectValue placeholder="Select focus" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plot">Plot & Events</SelectItem>
              <SelectItem value="character">Characters & Development</SelectItem>
              <SelectItem value="theme">Themes & Messages</SelectItem>
              <SelectItem value="all">All Elements</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Style</Label>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral">Neutral</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-sm mb-2 block">Include</Label>
          <Select value={include} onValueChange={setInclude}>
            <SelectTrigger>
              <SelectValue placeholder="Select elements" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="key-points">Key Points</SelectItem>
              <SelectItem value="quotes">Key Points + Quotes</SelectItem>
              <SelectItem value="analysis">Key Points + Analysis</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button 
          size="lg" 
          onClick={handleGenerateSummary}
          disabled={isGenerating || (text.length < 100 && activeTab === "text")}
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <FileText size={18} className="mr-2" /> Generate Summary
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
