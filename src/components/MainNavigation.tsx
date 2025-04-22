
import { useState } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";

interface MainNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function MainNavigation({ isMenuOpen, setIsMenuOpen }: MainNavigationProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-center relative">
        <nav className="flex items-center justify-between w-full max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <a href="/" className="font-semibold text-xl mr-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-400">
              Fantasy Writer AI
            </a>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex gap-6 text-sm font-medium"
            >
              <a href="#features" className="text-foreground/70 hover:text-foreground transition">Features</a>
              <a href="#how-it-works" className="text-foreground/70 hover:text-foreground transition">How It Works</a>
              <a href="#pricing" className="text-foreground/70 hover:text-foreground transition">Pricing</a>
              <a href="#faq" className="text-foreground/70 hover:text-foreground transition">FAQ</a>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <a href="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">Login</a>
              <a 
                href="/signup" 
                className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition"
              >
                Sign Up
              </a>
              <ThemeToggle />
            </motion.div>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background border-b border-border/40"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <a href="#features" className="py-2 text-foreground/70 hover:text-foreground transition">Features</a>
            <a href="#how-it-works" className="py-2 text-foreground/70 hover:text-foreground transition">How It Works</a>
            <a href="#pricing" className="py-2 text-foreground/70 hover:text-foreground transition">Pricing</a>
            <a href="#faq" className="py-2 text-foreground/70 hover:text-foreground transition">FAQ</a>
            <div className="flex items-center gap-4 py-2">
              <a href="/login" className="font-medium text-foreground/70 hover:text-foreground transition">Login</a>
              <a 
                href="/signup" 
                className="font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition"
              >
                Sign Up
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
