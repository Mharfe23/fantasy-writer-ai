
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Image, CirclePlay, FileText, BookOpen, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";

export default function Editor() {
  const [content, setContent] = useState<string>("Once upon a time in a land far away, a young wizard discovered an ancient tome. The pages glowed with an ethereal light, revealing secrets long forgotten.\n\nThe grand castle stood majestically against the twilight sky, its spires reaching for the stars like fingers stretching toward destiny. Dragons circled overhead, their scales shimmering like precious gems in the fading light.");
  const [title, setTitle] = useState<string>("The Dragon's Quest");
  const [selectedText, setSelectedText] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  
  const handleSelectText = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };
  
  const handleGenerateImage = () => {
    if (!selectedText) {
      toast.error("Please select text to generate an image");
      return;
    }
    
    // In a real app, this would call an API
    toast.success("Generating image from selected text");
    setShowImagePreview(true);
  };
  
  const handleGenerateAudio = () => {
    if (!selectedText && content.length === 0) {
      toast.error("Please select text or write content to generate audio");
      return;
    }
    
    // In a real app, this would call an API
    toast.success("Generating audio narration");
  };
  
  const handleGenerateSummary = () => {
    if (content.length === 0) {
      toast.error("Please write content to generate a summary");
      return;
    }
    
    // In a real app, this would call an API
    toast.success("Generating summary of your content");
  };
  
  const handleSave = () => {
    // In a real app, this would save to a database
    toast.success("Story saved successfully");
  };
  
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor section - takes up 2/3 of the screen on large displays */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="bg-card rounded-lg border border-border p-4 h-full">
            <div className="flex flex-col h-full">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Enter story title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-xl font-semibold bg-transparent border-0 px-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select defaultValue="chapter1">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chapter1">Chapter 1</SelectItem>
                      <SelectItem value="chapter2">Chapter 2</SelectItem>
                      <SelectItem value="chapter3">Chapter 3</SelectItem>
                      <SelectItem value="newChapter">+ New Chapter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save size={16} className="mr-1" /> Save
                  </Button>
                </div>
              </div>
              
              <div className="flex space-x-2 mb-4">
                <Button variant="outline" size="sm">Bold</Button>
                <Button variant="outline" size="sm">Italic</Button>
                <Button variant="outline" size="sm">Heading</Button>
                <Button variant="outline" size="sm">List</Button>
              </div>
              
              <Textarea
                placeholder="Start writing your story..."
                className="flex-1 min-h-[500px] border rounded-md p-4 resize-none focus-visible:ring-1"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onMouseUp={handleSelectText}
              />
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {content.split(/\s+/).filter(Boolean).length} words
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={!selectedText}
                  >
                    <Image size={16} className="mr-1" /> Generate Image
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateAudio}
                  >
                    <CirclePlay size={16} className="mr-1" /> Generate Audio
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateSummary}
                  >
                    <FileText size={16} className="mr-1" /> Generate Summary
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Sidebar for generated content and notes - takes up 1/3 of the screen */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Tabs defaultValue="preview">
            <TabsList className="w-full">
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
              <TabsTrigger value="images" className="flex-1">Images</TabsTrigger>
              <TabsTrigger value="audio" className="flex-1">Audio</TabsTrigger>
              <TabsTrigger value="notes" className="flex-1">Notes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="min-h-[600px]">
              <div className="bg-card border border-border rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold mb-4">{title}</h3>
                {content.split("\n\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">{paragraph}</p>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="images" className="min-h-[600px]">
              <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Generated Images</h3>
                
                {showImagePreview ? (
                  <div className="space-y-4">
                    <div className="aspect-square w-full rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                      <div className="p-6 text-center">
                        <Image size={48} className="mx-auto mb-2 text-purple-500/70" />
                        <p className="text-sm text-muted-foreground">Preview of generated image will appear here</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium mb-1">Generated from:</h4>
                      <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                        {selectedText}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Regenerate
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Save Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                    <div className="rounded-full bg-primary/10 p-4 mb-4">
                      <Image size={24} className="text-primary" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No Images Yet</h3>
                    <p className="text-sm text-muted-foreground max-w-[80%] mb-4">
                      Select text in your story and click "Generate Image" to create visuals
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={handleGenerateImage}
                      disabled={!selectedText}
                    >
                      <Image size={16} className="mr-1" /> Generate Image
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="audio" className="min-h-[600px]">
              <div className="bg-card border border-border rounded-lg p-6 h-full flex flex-col">
                <h3 className="text-lg font-semibold mb-4">Audio Narration</h3>
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                  <div className="rounded-full bg-primary/10 p-4 mb-4">
                    <CirclePlay size={24} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No Audio Yet</h3>
                  <p className="text-sm text-muted-foreground max-w-[80%] mb-4">
                    Generate audio narration from your story content
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateAudio}
                  >
                    <CirclePlay size={16} className="mr-1" /> Generate Audio
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="notes" className="min-h-[600px]">
              <div className="bg-card border border-border rounded-lg p-6 h-full">
                <h3 className="text-lg font-semibold mb-4">Story Notes</h3>
                <Textarea 
                  placeholder="Add notes about your story, characters, plot ideas, etc."
                  className="min-h-[400px] resize-none"
                />
                <div className="flex justify-end mt-4">
                  <Button variant="outline" size="sm">
                    <Save size={16} className="mr-1" /> Save Notes
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
