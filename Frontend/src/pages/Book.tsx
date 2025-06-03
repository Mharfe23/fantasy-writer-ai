import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import { BookEditor } from "@/components/book/BookEditor";
import { BookPreview } from "@/components/book/BookPreview";
import { generatePDF } from "@/services/pdfService";
import { getStoredImages } from "@/services/imageGenerationService";
import { generateAudio, getAvailableVoices, getCustomVoices, type CustomVoice } from "@/services/audioService";
import bookService, { type Book as BookType } from "@/services/book.service";
import { toast } from "sonner";
import chapterService from "@/services/chapter.service";
import pageService from "@/services/page.service";

export interface BookParagraph {
  id: string;
  text: string;
  imageUrl?: string;
  imagePrompt?: string;
  chapterTitle?: string;
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
  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [customVoices, setCustomVoices] = useState<CustomVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [speed, setSpeed] = useState([1.0]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(true);
  const [availableBooks, setAvailableBooks] = useState<BookType[]>([]);
  const [selectedBookId, setSelectedBookId] = useState<string>("");
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioPreviewUrl, setAudioPreviewUrl] = useState<string | null>(null);
  
  // Load available books on component mount
  useEffect(() => {
    const loadBooks = async () => {
      try {
        setIsLoadingBooks(true);
        const books = await bookService.getBooks();
        setAvailableBooks(books);
        if (books.length > 0) {
          setSelectedBookId(books[0].id);
        }
      } catch (error) {
        console.error("Failed to load books:", error);
        toast.error("Failed to load available books");
      } finally {
        setIsLoadingBooks(false);
      }
    };
    
    loadBooks();
  }, []);
  
  // Load selected book when bookId changes
  useEffect(() => {
    const loadSelectedBook = async () => {
      if (!selectedBookId) return;
      
      try {
        const selectedBook = await bookService.getBook(selectedBookId);
        const chapters = await chapterService.getChaptersByBook(selectedBookId);
        
        // Get all pages from all chapters
        const allPages = await Promise.all(
          chapters.map(async (chapter) => {
            const pages = await pageService.getPagesByChapter(chapter.id);
            return pages.map(page => ({
              id: page.id,
              text: page.textContent,
              chapterTitle: chapter.title
            }));
          })
        );
        
        // Flatten the pages array and sort by chapter order and page number
        const sortedPages = allPages
          .flat()
          .sort((a, b) => {
            const chapterA = chapters.find(c => c.title === a.chapterTitle);
            const chapterB = chapters.find(c => c.title === b.chapterTitle);
            if (!chapterA || !chapterB) return 0;
            return chapterA.order - chapterB.order;
          });
        
        setBook({
          id: selectedBook.id,
          title: selectedBook.title,
          author: "Author Name", // You might want to add author to the book model
          paragraphs: sortedPages.map(page => ({
            id: page.id,
            text: page.text,
            chapterTitle: page.chapterTitle
          })),
          createdAt: new Date(selectedBook.createdAt)
        });
      } catch (error) {
        console.error("Failed to load selected book:", error);
        toast.error("Failed to load selected book");
      }
    };
    
    loadSelectedBook();
  }, [selectedBookId]);
  
  // Load available voices on component mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        setIsLoadingVoices(true);
        const [voices, customVoicesList] = await Promise.all([
          getAvailableVoices(),
          getCustomVoices()
        ]);
        setAvailableVoices(voices);
        setCustomVoices(customVoicesList);
        if (voices.length > 0) {
          setSelectedVoice(voices[0]);
        }
      } catch (error) {
        console.error("Failed to load voices:", error);
        toast.error("Failed to load available voices");
      } finally {
        setIsLoadingVoices(false);
      }
    };
    
    loadVoices();
  }, []);
  
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
  
  const handleDownloadAudio = async () => {
    if (!selectedVoice) {
      toast.error("Please select a voice first");
      return;
    }
    
    try {
      setIsGeneratingAudio(true);
      toast.info("Generating audio...");
      
      // Combine all paragraphs into one text, including chapter titles
      const fullText = book.paragraphs.map(p => {
        const chapterTitle = p.chapterTitle ? `\n\nChapter: ${p.chapterTitle}\n\n` : '';
        return `${chapterTitle}${p.text}`;
      }).join("\n\n");
      
      // Generate audio with selected voice and speed
      const audioResponse = await generateAudio({
        text: fullText,
        voice: selectedVoice,
        speed: speed[0]
      });
      
      // Create audio preview URL
      const audioDataUrl = `data:audio/wav;base64,${audioResponse.audioData.split(',')[1]}`;
      setAudioPreviewUrl(audioDataUrl);
      
      // Create a download link for the audio
      const audioBlob = new Blob([Buffer.from(audioResponse.audioData.split(',')[1], 'base64')], { type: 'audio/wav' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = audioUrl;
      link.download = `${book.title.toLowerCase().replace(/\s+/g, '-')}-audio.wav`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(audioUrl);
      
      toast.success("Audio generated successfully!");
    } catch (error) {
      console.error("Audio generation error:", error);
      toast.error("Failed to generate audio. Please try again.");
    } finally {
      setIsGeneratingAudio(false);
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
            <Select value={selectedBookId} onValueChange={setSelectedBookId}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select a book" />
              </SelectTrigger>
              <SelectContent>
                {isLoadingBooks ? (
                  <SelectItem value="loading" disabled>Loading books...</SelectItem>
                ) : availableBooks.length === 0 ? (
                  <SelectItem value="none" disabled>No books available</SelectItem>
                ) : (
                  availableBooks.map((book) => (
                    <SelectItem key={book.id} value={book.id}>
                      {book.title}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={handleRefreshFromImages}>
              Refresh from Editor Images
            </Button>
            <Button variant="outline" onClick={handleDownloadPDF}>
              Download PDF
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Download Audio</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Select Voice for Audio Generation</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <Label>Voice</Label>
                    <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a voice" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="default" disabled>Default Voices</SelectItem>
                        {availableVoices.map((voice) => (
                          <SelectItem key={voice} value={voice}>
                            {voice}
                          </SelectItem>
                        ))}
                        {customVoices.length > 0 && (
                          <>
                            <SelectItem value="custom" disabled>Custom Voices</SelectItem>
                            {customVoices.map((customVoice) => (
                              <SelectItem key={customVoice.id} value={customVoice.voice_name}>
                                {customVoice.voice_name} (Custom)
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Speed: {speed[0].toFixed(1)}x</Label>
                    <Slider
                      value={speed}
                      onValueChange={setSpeed}
                      min={0.5}
                      max={2}
                      step={0.1}
                    />
                  </div>
                  
                  <Button 
                    className="w-full" 
                    onClick={handleDownloadAudio}
                    disabled={!selectedVoice || isLoadingVoices || isGeneratingAudio}
                  >
                    {isGeneratingAudio ? "Generating Audio..." : "Generate Audio"}
                  </Button>

                  {audioPreviewUrl && (
                    <div className="mt-4">
                      <Label>Preview</Label>
                      <audio controls className="w-full mt-2">
                        <source src={audioPreviewUrl} type="audio/wav" />
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
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
