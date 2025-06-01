import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  Image, 
  Clock, 
  Plus,
  ChevronRight,
  CirclePlay,
  Settings,
  FileText
} from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/components/DashboardLayout";
import NewBookModal from "@/components/dashboard/NewBookModal";
import { toast } from "sonner";
import bookService, { Book, CreateBookRequest } from "@/services/book.service";
import { useNavigate } from "react-router-dom";

// Dummy data for charts
const activityData = [
  { day: "Mon", words: 120 },
  { day: "Tue", words: 240 },
  { day: "Wed", words: 380 },
  { day: "Thu", words: 320 },
  { day: "Fri", words: 500 },
  { day: "Sat", words: 450 },
  { day: "Sun", words: 600 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      const books = await bookService.getBooks();
      setBooks(books);
    } catch (error) {
      console.error("Error loading books:", error);
      toast.error("Failed to load books");
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookCreated = async (newBook: CreateBookRequest) => {
    try {
      await loadBooks(); // Reload the books list
      toast.success("Book created successfully!");
    } catch (error) {
      console.error("Error creating book:", error);
      toast.error("Failed to create book");
    }
  };

  const handleBookClick = (bookId: string) => {
    navigate(`/editor/${bookId}`);
  };
  
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Welcome section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Writer!</h1>
            <p className="text-muted-foreground mt-1">
              Here's an overview of your writing journey and creative content.
            </p>
          </div>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <NewBookModal onBookCreated={handleBookCreated} />
          </div>
        </motion.div>
        
        {/* Stats overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Word Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {books.reduce((sum, book) => sum + book.wordCount, 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground mt-1">Across all books</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{books.length}</div>
                <p className="text-xs text-muted-foreground mt-1">Active books</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tokens Balance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">450</div>
                <p className="text-xs text-muted-foreground mt-1">Renews in 15 days</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Generated Content</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {books.reduce((sum, book) => sum + book.images + book.audio, 0)}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-xs">
                    <Image size={12} className="mr-1" /> {books.reduce((sum, book) => sum + book.images, 0)}
                  </div>
                  <div className="flex items-center text-xs">
                    <CirclePlay size={12} className="mr-1" /> {books.reduce((sum, book) => sum + book.audio, 0)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Tabs for different views */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-2"
        >
          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="books">Books</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            {/* Overview tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Writing activity chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Writing Activity</CardTitle>
                  <CardDescription>Your daily word count for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={activityData}>
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Bar dataKey="words" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Books tab */}
            <TabsContent value="books" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                  <div>Loading books...</div>
                ) : books.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No books yet. Create your first book to get started!</p>
                  </div>
                ) : (
                  books.map((book) => (
                    <Card 
                      key={book.id} 
                      className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleBookClick(book.id)}
                    >
                      <CardHeader>
                        <CardTitle className="line-clamp-1">{book.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{book.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{book.progress}%</span>
                            </div>
                            <Progress value={book.progress} />
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                              <div className="font-medium">{book.wordCount}</div>
                              <div className="text-muted-foreground">Words</div>
                            </div>
                            <div>
                              <div className="font-medium">{book.chapters?.length || 0}</div>
                              <div className="text-muted-foreground">Chapters</div>
                            </div>
                            <div>
                              <div className="font-medium">{(book.images?.length || 0) + (book.audio?.length || 0)}</div>
                              <div className="text-muted-foreground">Media</div>
                            </div>
                          </div>
                          <Button variant="outline" className="w-full">
                            Continue Writing
                            <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
