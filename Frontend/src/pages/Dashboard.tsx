
import { useState } from "react";
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
import NewProjectModal from "@/components/dashboard/NewProjectModal";
import { toast } from "sonner";

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

// Dummy data for projects
const projectsData = [
  { 
    id: 1, 
    title: "The Crystal Kingdom", 
    progress: 65, 
    lastEdited: "2 hours ago",
    wordCount: 12450,
    chapters: 8,
    images: 5,
    audio: 3
  },
  { 
    id: 2, 
    title: "Dragons of the North", 
    progress: 40, 
    lastEdited: "yesterday",
    wordCount: 8320,
    chapters: 5,
    images: 3,
    audio: 1
  },
  { 
    id: 3, 
    title: "The Enchanted Forest", 
    progress: 25, 
    lastEdited: "3 days ago",
    wordCount: 4120,
    chapters: 3,
    images: 2,
    audio: 0
  },
];

// Dummy data for recent activities
const recentActivities = [
  { id: 1, type: "chapter", title: "Chapter 8: The Final Battle", project: "The Crystal Kingdom", timestamp: "2 hours ago" },
  { id: 2, type: "image", title: "Dragon flying over mountains", project: "Dragons of the North", timestamp: "yesterday" },
  { id: 3, type: "audio", title: "Chapter 5 narration", project: "The Crystal Kingdom", timestamp: "2 days ago" },
  { id: 4, type: "summary", title: "Plot summary", project: "The Enchanted Forest", timestamp: "3 days ago" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [projects, setProjects] = useState(projectsData);
  
  const handleProjectCreated = (newProject: { title: string; description: string; type: string }) => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    
    const projectToAdd = {
      id: newId,
      title: newProject.title,
      progress: 0,
      lastEdited: "just now",
      wordCount: 0,
      chapters: 0,
      images: 0,
      audio: 0
    };
    
    setProjects([...projects, projectToAdd]);
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
            <NewProjectModal onProjectCreated={handleProjectCreated} />
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
                <div className="text-2xl font-bold">24,890</div>
                <p className="text-xs text-muted-foreground mt-1">+1,230 this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">Active projects</p>
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
                <div className="text-2xl font-bold">10</div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-xs">
                    <Image size={12} className="mr-1" /> 5
                  </div>
                  <div className="flex items-center text-xs">
                    <CirclePlay size={12} className="mr-1" /> 4
                  </div>
                  <div className="flex items-center text-xs">
                    <FileText size={12} className="mr-1" /> 1
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
              <TabsTrigger value="projects">Projects</TabsTrigger>
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
                        <Bar dataKey="words" className="fill-primary" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Recent projects and activity */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Projects</CardTitle>
                      <CardDescription>Your active writing projects</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {projectsData.slice(0, 2).map(project => (
                      <div key={project.id} className="border border-border p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">{project.title}</h4>
                          <span className="text-xs text-muted-foreground">{project.lastEdited}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                          <span>{project.wordCount} words</span>
                          <span>{project.chapters} chapters</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5 mb-1" />
                        <div className="flex justify-between text-xs mt-1">
                          <span>{project.progress}% complete</span>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center">
                              <Image size={10} className="mr-1" /> {project.images}
                            </div>
                            <div className="flex items-center">
                              <CirclePlay size={10} className="mr-1" /> {project.audio}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" size="sm" className="w-full">
                      View All Projects
                    </Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Your latest content and edits</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start">
                          <div className="p-2 rounded-full bg-primary/10 mr-3">
                            {activity.type === "chapter" && <FileText size={14} className="text-primary" />}
                            {activity.type === "image" && <Image size={14} className="text-primary" />}
                            {activity.type === "audio" && <CirclePlay size={14} className="text-primary" />}
                            {activity.type === "summary" && <FileText size={14} className="text-primary" />}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{activity.title}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span>{activity.project}</span>
                              <span className="mx-1">•</span>
                              <span>{activity.timestamp}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="w-full">
                        View All Activity
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Projects tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">Your Projects</h3>
                <NewProjectModal onProjectCreated={handleProjectCreated} />
              </div>
              
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {projects.map(project => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="h-3 bg-primary"></div>
                    <CardHeader>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription>{project.wordCount} words, {project.chapters} chapters</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1.5" />
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <div>Last edited: {project.lastEdited}</div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center">
                            <Image size={12} className="mr-1" /> {project.images}
                          </div>
                          <div className="flex items-center">
                            <CirclePlay size={12} className="mr-1" /> {project.audio}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText size={14} className="mr-1" /> Edit
                        </Button>
                        <Button size="sm" className="flex-1">
                          <FileText size={14} className="mr-1" /> Continue
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <NewProjectModal />
              </div>
            </TabsContent>
            
            {/* Tokens tab */}
            <TabsContent value="tokens" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Token Balance</CardTitle>
                  <CardDescription>Track your token usage and purchase history</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-4 bg-muted rounded-lg mb-6">
                    <div>
                      <p className="text-sm font-medium mb-1">Current Balance</p>
                      <h3 className="text-3xl font-bold">450 Tokens</h3>
                      <p className="text-xs text-muted-foreground mt-1">Premium Plan · Renews in 15 days</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">View History</Button>
                      <Button>Buy Tokens</Button>
                    </div>
                  </div>
                  
                  <h4 className="font-semibold mb-3">Token Usage</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Images (200/300)</span>
                        <span>67%</span>
                      </div>
                      <Progress value={67} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Audio (120/150)</span>
                        <span>80%</span>
                      </div>
                      <Progress value={80} className="h-1.5" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Summaries (30/50)</span>
                        <span>60%</span>
                      </div>
                      <Progress value={60} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upgrade Your Plan</CardTitle>
                  <CardDescription>Get more tokens with our premium plans</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Basic</h4>
                    <p className="text-2xl font-bold mt-1">$9.99<span className="text-sm font-normal">/month</span></p>
                    <p className="text-sm text-muted-foreground mt-1">500 tokens monthly</p>
                    <Button className="w-full mt-4" variant="outline">Current Plan</Button>
                  </div>
                  <div className="border rounded-lg p-4 bg-primary/5 border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">Pro</h4>
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Popular</span>
                    </div>
                    <p className="text-2xl font-bold">$19.99<span className="text-sm font-normal">/month</span></p>
                    <p className="text-sm text-muted-foreground mt-1">1,500 tokens monthly</p>
                    <Button className="w-full mt-4">Upgrade</Button>
                  </div>
                  <div className="border rounded-lg p-4">
                    <h4 className="font-semibold">Premium</h4>
                    <p className="text-2xl font-bold mt-1">$29.99<span className="text-sm font-normal">/month</span></p>
                    <p className="text-sm text-muted-foreground mt-1">3,000 tokens monthly</p>
                    <Button className="w-full mt-4" variant="outline">Upgrade</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Activity tab */}
            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your latest content and edits</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentActivities.map((activity, index) => (
                    <div key={activity.id}>
                      <div className="flex items-start py-4">
                        <div className="p-2 rounded-full bg-primary/10 mr-3">
                          {activity.type === "chapter" && <FileText size={16} className="text-primary" />}
                          {activity.type === "image" && <Image size={16} className="text-primary" />}
                          {activity.type === "audio" && <CirclePlay size={16} className="text-primary" />}
                          {activity.type === "summary" && <FileText size={16} className="text-primary" />}
                        </div>
                        <div className="flex flex-col sm:flex-row sm:justify-between w-full">
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">{activity.project}</p>
                          </div>
                          <div className="flex items-center mt-1 sm:mt-0">
                            <Clock size={14} className="text-muted-foreground mr-1" />
                            <span className="text-sm text-muted-foreground">{activity.timestamp}</span>
                          </div>
                        </div>
                      </div>
                      {index < recentActivities.length - 1 && <Separator />}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
