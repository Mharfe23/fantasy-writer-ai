
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Image, 
  CirclePlay,
  Plus,
  ArrowUp,
  LayoutDashboard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/components/DashboardLayout";

// Dummy data for demonstration
const projects = [
  { id: 1, title: "The Dragon's Quest", wordCount: 12500, chapters: 5, lastEdited: "2 hours ago" },
  { id: 2, title: "Realm of Shadows", wordCount: 8200, chapters: 3, lastEdited: "yesterday" },
  { id: 3, title: "Crystal Kingdoms", wordCount: 15700, chapters: 7, lastEdited: "3 days ago" },
];

const generatedContent = [
  { id: 1, type: "image", title: "Dragon overlooking mountains", date: "2 hours ago" },
  { id: 2, type: "audio", title: "Chapter 3 narration", date: "yesterday" },
  { id: 3, type: "summary", title: "Full story synopsis", date: "3 days ago" },
];

export default function Dashboard() {
  const [tokens, setTokens] = useState(750);
  const totalTokens = 1000;
  
  return (
    <DashboardLayout>
      {/* Top cards section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Token Balance</CardTitle>
              <CardDescription>Your current usage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold">{tokens}</span>
                <span className="text-sm text-muted-foreground">of {totalTokens}</span>
              </div>
              <Progress value={(tokens / totalTokens) * 100} className="h-2 mb-2" />
              <p className="text-xs text-muted-foreground">Tokens reset in 25 days</p>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline" className="w-full">
                Buy More Tokens
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Writing Progress</CardTitle>
              <CardDescription>Across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Word Count</p>
                  <p className="text-2xl font-bold">36,400</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Chapters</p>
                  <p className="text-2xl font-bold">15</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Daily Goal</p>
                  <div className="flex items-center">
                    <p className="text-xl font-bold mr-2">85%</p>
                    <ArrowUp className="text-green-500" size={16} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Writing Streak</p>
                  <p className="text-xl font-bold">5 days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest creations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {generatedContent.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center">
                    {item.type === "image" && <Image size={16} className="mr-2 text-purple-500" />}
                    {item.type === "audio" && <CirclePlay size={16} className="mr-2 text-blue-500" />}
                    {item.type === "summary" && <FileText size={16} className="mr-2 text-green-500" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="ghost" className="w-full">
                View All Activity
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
      
      {/* Projects section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button size="sm">
            <Plus size={16} className="mr-1" /> New Project
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id} className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>Last edited {project.lastEdited}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Words</p>
                    <p className="font-medium">{project.wordCount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Chapters</p>
                    <p className="font-medium">{project.chapters}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm">
                  <BookOpen size={16} className="mr-1" /> Open
                </Button>
                <Button variant="outline" size="sm">
                  <Image size={16} className="mr-1" /> Generate
                </Button>
              </CardFooter>
            </Card>
          ))}
          
          {/* New project card */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors cursor-pointer flex flex-col items-center justify-center py-8">
            <div className="rounded-full bg-primary/10 p-4 mb-4">
              <Plus size={24} className="text-primary" />
            </div>
            <h3 className="text-lg font-medium mb-1">Create New Project</h3>
            <p className="text-sm text-muted-foreground text-center max-w-[80%]">
              Start a new story from scratch
            </p>
          </Card>
        </div>
      </motion.div>
      
      {/* Generated content section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Generated Content</h2>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Image size={16} className="mr-1" /> Images
            </Button>
            <Button variant="outline" size="sm">
              <CirclePlay size={16} className="mr-1" /> Audio
            </Button>
            <Button variant="outline" size="sm">
              <FileText size={16} className="mr-1" /> Summaries
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cards for different types of generated content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image size={18} className="mr-2 text-purple-500" /> 
                Images
              </CardTitle>
              <CardDescription>AI generated visuals</CardDescription>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="grid grid-cols-2 gap-2">
                <div className="aspect-square rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Image size={24} className="text-purple-500/70" />
                </div>
                <div className="aspect-square rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Image size={24} className="text-purple-500/70" />
                </div>
                <div className="aspect-square rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Image size={24} className="text-purple-500/70" />
                </div>
                <div className="aspect-square rounded-md bg-gradient-to-br from-purple-500/20 to-indigo-500/20 flex items-center justify-center">
                  <Image size={24} className="text-purple-500/70" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Images
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CirclePlay size={18} className="mr-2 text-blue-500" /> 
                Audio
              </CardTitle>
              <CardDescription>Narrated content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-2 rounded-md bg-blue-500/10">
                  <CirclePlay size={16} className="mr-2 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Chapter 1 - The Beginning</p>
                    <p className="text-xs text-muted-foreground">5:45 - 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded-md bg-blue-500/10">
                  <CirclePlay size={16} className="mr-2 text-blue-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">The Castle Scene</p>
                    <p className="text-xs text-muted-foreground">3:22 - 3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Audio
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText size={18} className="mr-2 text-green-500" /> 
                Summaries
              </CardTitle>
              <CardDescription>AI-generated insights</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center p-2 rounded-md bg-green-500/10">
                  <FileText size={16} className="mr-2 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Full Story Synopsis</p>
                    <p className="text-xs text-muted-foreground">1200 words - 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center p-2 rounded-md bg-green-500/10">
                  <FileText size={16} className="mr-2 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Chapter 3 Summary</p>
                    <p className="text-xs text-muted-foreground">450 words - 5 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" className="w-full">
                View All Summaries
              </Button>
            </CardFooter>
          </Card>
        </div>
      </motion.div>
    </DashboardLayout>
  );
}
