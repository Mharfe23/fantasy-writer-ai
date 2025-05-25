
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/DashboardLayout";
import { BookEditor } from "@/components/book/BookEditor";
import { BookPreview } from "@/components/book/BookPreview";
import { generatePDF } from "@/services/pdfService";
import { getStoredImages } from "@/services/imageGenerationService";
import { toast } from "sonner";

export interface BookParagraph {
  id: string;
  text: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  paragraphs: BookParagraph[];
  createdAt: Date;
}

export default function Book() {
  const [book, setBook] = useState<Book>({
    id: Date.now().toString(),
    title: "My New Book",
    author: "Author Name",
    paragraphs: [],
    createdAt: new Date()
  });
  
  const [activeTab, setActiveTab] = useState("editor");
  
  // Load generated images and create book paragraphs from them
  useEffect(() => {
    const storedImages = getStoredImages();
    if (storedImages.length > 0 && book.paragraphs.length === 0) {
      const paragraphs: BookParagraph[] = storedImages.map((image, index) => ({
        id: `paragraph-${index + 1}`,
        text: image.prompt,
        imageUrl: image.imageUrl,
        imagePrompt: image.prompt
      }));
      
      setBook(prev => ({
        ...prev,
        paragraphs
      }));
    }
  }, []);
  
  const handleBookUpdate = (updatedBook: Book) => {
    setBook(updatedBook);
  };
  
  const handleRefreshFromImages = () => {
    const storedImages = getStoredImages();
    const paragraphs: BookParagraph[] = storedImages.map((image, index) => ({
      id: `paragraph-${index + 1}`,
      text: image.prompt,
      imageUrl: image.imageUrl,
      imagePrompt: image.prompt
    }));
    
    setBook(prev => ({
      ...prev,
      paragraphs
    }));
    
    toast.success("Book updated with generated images from editor!");
  };
  
  const handleDownloadPDF = async () => {
    try {
      toast.info("Generating PDF...");
      await generatePDF(book);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error("PDF generation error:", error);
    }
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Book Creator</h1>
            <p className="text-muted-foreground">Create your illustrated book using generated images from the editor</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleRefreshFromImages}>
              Refresh from Editor Images
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Editor</TabsTrigger>
            <TabsTrigger value="preview">Book Preview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BookEditor book={book} onBookUpdate={handleBookUpdate} />
            </motion.div>
          </TabsContent>
          
          <TabsContent value="preview" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BookPreview book={book} />
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
