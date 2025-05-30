import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Image, CirclePlay, FileText, BookOpen, ArrowDown, Plus } from "lucide-react";
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
import { useParams, useNavigate } from "react-router-dom";
import bookService, { Book } from "@/services/book.service";
import pageService, { Page, CreatePageRequest } from "@/services/page.service";
import imagePromptService, { ImagePrompt, CreateImagePromptRequest } from "@/services/image-prompt.service";
import chapterService, { Chapter, CreateChapterRequest } from "@/services/chapter.service";

export default function Editor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [content, setContent] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [selectedText, setSelectedText] = useState<string>("");
  const [showImagePreview, setShowImagePreview] = useState<boolean>(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentChapter, setCurrentChapter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<string>("");
  const [pages, setPages] = useState<Page[]>([]);
  const [imagePrompts, setImagePrompts] = useState<ImagePrompt[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [isCreatingChapter, setIsCreatingChapter] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [newPageContent, setNewPageContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadBook = async () => {
      if (!id) {
        toast.error("No book ID provided");
        navigate("/dashboard");
        return;
      }

      try {
        const bookData = await bookService.getBook(id);
        setBook(bookData);
        setTitle(bookData.title);
        
        // Load chapters for the book
        const bookChapters = await chapterService.getChaptersByBook(id);
        setChapters(bookChapters);
        
        // If there are chapters, load the first chapter and its pages
        if (bookChapters.length > 0) {
          const firstChapter = bookChapters[0];
          setCurrentChapter(firstChapter.id);
          const chapterPages = await pageService.getPagesByChapter(firstChapter.id);
          setPages(chapterPages);
          if (chapterPages.length > 0) {
            setCurrentPage(chapterPages[0].id);
            setContent(chapterPages[0].textContent);
            // Load image prompts for the first page
            const prompts = await imagePromptService.getImagePromptsByPage(chapterPages[0].id);
            setImagePrompts(prompts);
          }
        }
      } catch (error) {
        console.error("Error loading book:", error);
        toast.error("Failed to load book");
        navigate("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    loadBook();
  }, [id, navigate]);

  const handleChapterChange = async (chapterId: string) => {
    if (chapterId === "newChapter") {
      setIsCreatingChapter(true);
      return;
    }

    setCurrentChapter(chapterId);
    try {
      const chapterPages = await pageService.getPagesByChapter(chapterId);
      setPages(chapterPages);
      if (chapterPages.length > 0) {
        setCurrentPage(chapterPages[0].id);
        setContent(chapterPages[0].textContent);
      } else {
        setCurrentPage("");
        setContent("");
      }
    } catch (error) {
      console.error("Error loading chapter pages:", error);
      toast.error("Failed to load chapter pages");
    }
  };

  const handleCreateChapter = async () => {
    if (!id || !newChapterTitle.trim()) {
      toast.error("Please enter a chapter title");
      return;
    }

    try {
      const newChapter: CreateChapterRequest = {
        title: newChapterTitle.trim(),
        order: chapters.length + 1,
        bookId: id
      };

      const createdChapter = await chapterService.createChapter(newChapter);
      setChapters([...chapters, createdChapter]);
      setCurrentChapter(createdChapter.id);
      setNewChapterTitle("");
      setIsCreatingChapter(false);
      toast.success("New chapter created");
    } catch (error) {
      console.error("Error creating chapter:", error);
      toast.error("Failed to create chapter");
    }
  };

  const handlePageChange = async (pageId: string) => {
    if (pageId === "newPage") {
      if (!currentChapter) {
        toast.error("Please select a chapter first");
        return;
      }
      setIsCreatingPage(true);
      return;
    }

    setCurrentPage(pageId);
    const selectedPage = pages.find(p => p.id === pageId);
    if (selectedPage) {
      setContent(selectedPage.textContent);
      // Load image prompts for the selected page
      const prompts = await imagePromptService.getImagePromptsByPage(pageId);
      setImagePrompts(prompts);
    }
  };

  const handleCreatePage = async () => {
    if (!currentChapter) {
      toast.error("Please select a chapter first");
      return;
    }

    try {
      const newPage: CreatePageRequest = {
        textContent: newPageContent.trim(),
        pageNumber: pages.length + 1,
        chapterId: currentChapter
      };

      const createdPage = await pageService.createPage(newPage);
      setPages([...pages, createdPage]);
      setCurrentPage(createdPage.id);
      setContent(createdPage.textContent);
      setNewPageContent("");
      setIsCreatingPage(false);
      setImagePrompts([]);
      toast.success("New page created");
    } catch (error) {
      console.error("Error creating page:", error);
      toast.error("Failed to create page");
    }
  };

  const handleSave = async () => {
    if (!book || !currentPage) return;

    try {
      await pageService.updatePage(currentPage, {
        textContent: content,
        pageNumber: pages.findIndex(p => p.id === currentPage) + 1
      });
      toast.success("Page saved successfully");
    } catch (error) {
      console.error("Error saving page:", error);
      toast.error("Failed to save page");
    }
  };
  
  const handleSelectText = () => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      
      if (start !== end) {
        const selected = content.substring(start, end);
        setSelectedText(selected);
        setSelectionStart(start);
        setSelectionEnd(end);
        
        // Highlight the selected text with subtle animation
        const textarea = textareaRef.current;
        const originalStyle = textarea.style.backgroundColor;
        textarea.style.backgroundColor = "rgba(147, 51, 234, 0.1)";
        
        setTimeout(() => {
          textarea.style.backgroundColor = originalStyle;
        }, 300);
        
        toast.info("Text selected for image generation", {
          description: `"${selected.substring(0, 60)}${selected.length > 60 ? "..." : ""}"`,
          action: {
            label: "Generate Image",
            onClick: () => handleGenerateImage(),
          },
        });
      }
    }
  };
  
  const handleGenerateImage = async () => {
    if (!selectedText || !currentPage) {
      toast.error("Please select text to generate an image");
      return;
    }
    
    try {
      // In a real app, this would call an image generation API
      const imagePath = "/path/to/generated/image.jpg"; // This would come from the image generation API
      
      const newPrompt: CreateImagePromptRequest = {
        selectedText,
        imagePath,
        pageId: currentPage
      };

      const createdPrompt = await imagePromptService.createImagePrompt(newPrompt);
      setImagePrompts([...imagePrompts, createdPrompt]);
      setShowImagePreview(true);
      toast.success("Image generated successfully");
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image");
    }
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
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow keyboard shortcuts for generating content
    if ((e.ctrlKey || e.metaKey) && e.key === 'i' && selectedText) {
      e.preventDefault();
      handleGenerateImage();
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }
  
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
                  <Select 
                    value={currentChapter} 
                    onValueChange={handleChapterChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                      {chapters.map((chapter, index) => (
                        <SelectItem key={chapter.id} value={chapter.id}>
                          Chapter {index + 1}: {chapter.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="newChapter">+ New Chapter</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select 
                    value={currentPage} 
                    onValueChange={handlePageChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select page" />
                    </SelectTrigger>
                    <SelectContent>
                      {pages.map((page, index) => (
                        <SelectItem key={page.id} value={page.id}>
                          Page {index + 1}
                        </SelectItem>
                      ))}
                      <SelectItem value="newPage">+ New Page</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm" onClick={handleSave}>
                    <Save size={16} className="mr-1" /> Save
                  </Button>
                </div>
              </div>
              
              {isCreatingChapter && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-4 border border-primary/30 bg-primary/5 rounded-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <BookOpen size={14} className="mr-1.5 text-primary" /> Create New Chapter
                    </h4>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setIsCreatingChapter(false);
                        setNewChapterTitle("");
                      }}
                    >
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter chapter title..."
                      value={newChapterTitle}
                      onChange={(e) => setNewChapterTitle(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      size="sm"
                      onClick={handleCreateChapter}
                      disabled={!newChapterTitle.trim()}
                    >
                      <Plus size={14} className="mr-1.5" /> Create
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {isCreatingPage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4 p-4 border border-primary/30 bg-primary/5 rounded-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <FileText size={14} className="mr-1.5 text-primary" /> Create New Page
                    </h4>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => {
                        setIsCreatingPage(false);
                        setNewPageContent("");
                      }}
                    >
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Textarea
                      placeholder="Start writing your page content..."
                      value={newPageContent}
                      onChange={(e) => setNewPageContent(e.target.value)}
                      className="min-h-[200px]"
                    />
                    <div className="flex justify-end">
                      <Button 
                        size="sm"
                        onClick={handleCreatePage}
                        disabled={!newPageContent.trim()}
                      >
                        <Plus size={14} className="mr-1.5" /> Create Page
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
              
              {!isCreatingPage && (
                <>
                  <div className="flex space-x-2 mb-4">
                    <Button variant="outline" size="sm">Bold</Button>
                    <Button variant="outline" size="sm">Italic</Button>
                    <Button variant="outline" size="sm">Heading</Button>
                    <Button variant="outline" size="sm">List</Button>
                  </div>
                  
                  <Textarea
                    ref={textareaRef}
                    placeholder="Start writing your story..."
                    className="flex-1 min-h-[500px] border rounded-md p-4 resize-none focus-visible:ring-1"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onMouseUp={handleSelectText}
                    onKeyUp={handleSelectText}
                    onKeyDown={handleKeyDown}
                  />
                </>
              )}
              
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-muted-foreground">
                  {content.split(/\s+/).filter(Boolean).length} words
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant={selectedText ? "default" : "secondary"}
                    size="sm"
                    onClick={handleGenerateImage}
                    disabled={!selectedText || isCreatingPage}
                    className="relative"
                  >
                    <Image size={16} className="mr-1" /> Generate Image
                    {selectedText && (
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse"></span>
                    )}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateAudio}
                    disabled={isCreatingPage}
                  >
                    <CirclePlay size={16} className="mr-1" /> Generate Audio
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleGenerateSummary}
                    disabled={isCreatingPage}
                  >
                    <FileText size={16} className="mr-1" /> Generate Summary
                  </Button>
                </div>
              </div>
              
              {selectedText && !isCreatingPage && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 p-3 border border-primary/30 bg-primary/5 rounded-md"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-sm font-medium flex items-center">
                      <Image size={14} className="mr-1.5 text-primary" /> Selected text for image generation
                    </h4>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => setSelectedText("")}
                    >
                      <ArrowDown size={14} />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground italic">"{selectedText}"</p>
                  <div className="flex justify-end mt-2">
                    <Button 
                      size="sm"
                      onClick={handleGenerateImage}
                    >
                      <Image size={14} className="mr-1.5" /> Generate Now
                    </Button>
                  </div>
                </motion.div>
              )}
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
                
                {imagePrompts.length > 0 ? (
                  <div className="space-y-4">
                    {imagePrompts.map((prompt) => (
                      <div key={prompt.id} className="border rounded-lg overflow-hidden">
                        <div className="aspect-square w-full bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                          <div className="p-6 text-center">
                            <Image size={48} className="mx-auto mb-2 text-purple-500/70" />
                            <p className="text-sm text-muted-foreground">Image preview</p>
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="text-sm font-medium mb-1">Generated from:</h4>
                          <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {prompt.selectedText}
                          </p>
                          <div className="flex space-x-2 mt-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              Regenerate
                            </Button>
                            <Button variant="outline" size="sm" className="flex-1">
                              Save Image
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
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
