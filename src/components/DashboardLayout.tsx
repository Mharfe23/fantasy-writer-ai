
import { ReactNode, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ThemeToggle } from "@/components/theme-toggle";
import { 
  LayoutDashboard, 
  BookOpen, 
  Image, 
  Users, 
  FileText, 
  CirclePlay, 
  Bell, 
  Cog
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  
  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { label: "Editor", icon: <BookOpen size={20} />, path: "/editor" },
    { label: "Images", icon: <Image size={20} />, path: "/image-generator" },
    { label: "Audio", icon: <CirclePlay size={20} />, path: "/audio" },
    { label: "Summaries", icon: <FileText size={20} />, path: "/summaries" },
  ];
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <motion.aside 
        initial={{ width: 250 }}
        animate={{ width: isSidebarOpen ? 250 : 70 }}
        className="fixed left-0 top-0 z-20 h-full border-r border-border/40 bg-background/80 backdrop-blur-md"
      >
        <div className="flex h-16 items-center px-4">
          <Link to="/" className={`flex items-center ${!isSidebarOpen && 'justify-center'}`}>
            <span className={`font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-400 ${!isSidebarOpen && 'hidden'}`}>
              Fantasy Writer
            </span>
            {!isSidebarOpen && (
              <span className="font-semibold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-400">
                FW
              </span>
            )}
          </Link>
        </div>
        
        <nav className="mt-6 px-2">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path 
                      ? 'bg-primary/10 text-primary' 
                      : 'hover:bg-primary/5 text-foreground/70 hover:text-foreground'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="mt-8 px-4">
            <div className={`uppercase text-xs font-semibold text-foreground/50 ${!isSidebarOpen && 'hidden'}`}>
              Account
            </div>
            <ul className="mt-2 space-y-2">
              <li>
                <Link
                  to="/settings"
                  className="flex items-center px-4 py-3 rounded-lg text-foreground/70 hover:text-foreground hover:bg-primary/5 transition-colors"
                >
                  <span className="mr-3"><Cog size={20} /></span>
                  {isSidebarOpen && <span>Settings</span>}
                </Link>
              </li>
            </ul>
          </div>
        </nav>
        
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute right-[-12px] top-20 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background text-foreground/70 hover:text-foreground"
        >
          {isSidebarOpen ? '<' : '>'}
        </button>
      </motion.aside>
      
      {/* Main content */}
      <div className={`flex-1 transition-all ${isSidebarOpen ? 'ml-[250px]' : 'ml-[70px]'}`}>
        {/* Header */}
        <header className="sticky top-0 z-10 h-16 border-b border-border/40 bg-background/80 backdrop-blur-md">
          <div className="flex h-full items-center justify-between px-6">
            <h1 className="text-xl font-semibold">
              {location.pathname === '/dashboard' && 'Dashboard'}
              {location.pathname === '/editor' && 'Story Editor'}
              {location.pathname === '/image-generator' && 'Image Generator'}
            </h1>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 rounded-full hover:bg-primary/10 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
              </button>
              
              <ThemeToggle />
              
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-medium">
                  U
                </div>
                <span className="text-sm font-medium">User</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
