
import { useState } from "react";
import { Plus, Image, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { generateImageWithTogether, getStoredImages } from "@/services/imageGenerationService";
import type { Book, BookParagraph } from "@/pages/Book";

interface BookEditorProps {
  book: Book;
  onBookUpdate: (book: Book) => void;
}

export function BookEditor({ book, onBookUpdate }: BookEditorProps) {
  const [isGeneratingImage, setIsGeneratingImage] = useState<string | null>(null);
  
  const updateBookField = (field: keyof Book, value: any) => {
    onBookUpdate({
      ...book,
      [field]: value
    });
  };
  
  const addParagraph = () => {
    const newParagraph: BookParagraph = {
      id: Date.now().toString(),
      text: "",
      imagePrompt: ""
    };
    
    updateBookField("paragraphs", [...book.paragraphs, newParagraph]);
  };
  
  const updateParagraph = (id: string, updates: Partial<BookParagraph>) => {
    const updatedParagraphs = book.paragraphs.map(p => 
      p.id === id ? { ...p, ...updates } : p
    );
    updateBookField("paragraphs", updatedParagraphs);
  };
  
  const deleteParagraph = (id: string) => {
    const updatedParagraphs = book.paragraphs.filter(p => p.id !== id);
    updateBookField("paragraphs", updatedParagraphs);
  };
  
  const generateImageForParagraph = async (paragraphId: string) => {
    const paragraph = book.paragraphs.find(p => p.id === paragraphId);
    if (!paragraph || (!paragraph.text && !paragraph.imagePrompt)) {
      toast.error("Please add text or image prompt first");
      return;
    }
    
    setIsGeneratingImage(paragraphId);
    
    try {
      const prompt = paragraph.imagePrompt || paragraph.text;
      toast.info("Generating image for this paragraph...");
      
      const imageUrl = await generateImageWithTogether(prompt);
      updateParagraph(paragraphId, { imageUrl });
      
      toast.success("Image generated successfully!");
    } catch (error) {
      toast.error("Failed to generate image");
      console.error("Image generation error:", error);
    } finally {
      setIsGeneratingImage(null);
    }
  };

  const loadFromEditorImages = () => {
    const storedImages = getStoredImages();
    if (storedImages.length === 0) {
      toast.error("No images found from editor. Generate images in the editor first!");
      return;
    }

    const paragraphs: BookParagraph[] = storedImages.map((image, index) => ({
      id: `editor-${index + 1}`,
      text: image.prompt,
      imageUrl: image.imageUrl,
      imagePrompt: image.prompt
    }));

    updateBookField("paragraphs", paragraphs);
    toast.success(`Loaded ${storedImages.length} paragraphs from editor images!`);
  };
  
  return (
    <div className="space-y-6">
      {/* Book metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Book Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input
              value={book.title}
              onChange={(e) => updateBookField("title", e.target.value)}
              placeholder="Enter book title..."
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Author</label>
            <Input
              value={book.author}
              onChange={(e) => updateBookField("author", e.target.value)}
              placeholder="Enter author name..."
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Content management */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Book Content</h3>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadFromEditorImages}>
              <RotateCcw size={16} className="mr-2" />
              Load from Editor
            </Button>
            <Button onClick={addParagraph}>
              <Plus size={16} className="mr-2" />
              Add Paragraph
            </Button>
          </div>
        </div>

        {book.paragraphs.length === 0 && (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <p className="mb-4">No content yet. You can:</p>
              <div className="flex justify-center gap-2">
                <Button variant="outline" onClick={loadFromEditorImages}>
                  <RotateCcw size={16} className="mr-2" />
                  Load from Editor Images
                </Button>
                <Button onClick={addParagraph}>
                  <Plus size={16} className="mr-2" />
                  Add New Paragraph
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {book.paragraphs.map((paragraph, index) => (
          <Card key={paragraph.id} className="relative">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">Chapter {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteParagraph(paragraph.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Chapter Text</label>
                <Textarea
                  value={paragraph.text}
                  onChange={(e) => updateParagraph(paragraph.id, { text: e.target.value })}
                  placeholder="Write your chapter content..."
                  className="min-h-[100px]"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">Image Prompt (optional)</label>
                <Input
                  value={paragraph.imagePrompt || ""}
                  onChange={(e) => updateParagraph(paragraph.id, { imagePrompt: e.target.value })}
                  placeholder="Describe the image for this chapter..."
                />
              </div>
              
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => generateImageForParagraph(paragraph.id)}
                  disabled={isGeneratingImage === paragraph.id}
                >
                  {isGeneratingImage === paragraph.id ? (
                    "Generating..."
                  ) : (
                    <>
                      <Image size={16} className="mr-2" />
                      Generate Image
                    </>
                  )}
                </Button>
                
                {paragraph.imageUrl && (
                  <div className="text-sm text-green-600 flex items-center">
                    <Image size={14} className="mr-1" />
                    Image ready
                  </div>
                )}
              </div>
              
              {paragraph.imageUrl && (
                <div className="mt-3">
                  <img
                    src={paragraph.imageUrl}
                    alt={`Illustration for chapter ${index + 1}`}
                    className="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
