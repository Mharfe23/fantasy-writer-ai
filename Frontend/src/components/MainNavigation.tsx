import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

interface MainNavigationProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function MainNavigation({ isMenuOpen, setIsMenuOpen }: MainNavigationProps) {
  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen, setIsMenuOpen]);

  // Smooth scroll function
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border/40 shadow-sm">
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-center relative">
        <nav className="flex items-center justify-between w-full max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link to="/" className="font-semibold text-xl mr-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-indigo-400 hover:opacity-90 transition">
              Fantasy Writer AI
            </Link>
          </motion.div>
          
          <div className="hidden md:flex items-center gap-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="flex gap-6 text-sm font-medium"
            >
              <button onClick={() => scrollToSection('features')} className="text-foreground/70 hover:text-foreground transition">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="text-foreground/70 hover:text-foreground transition">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="text-foreground/70 hover:text-foreground transition">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="text-foreground/70 hover:text-foreground transition">FAQ</button>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center gap-4"
            >
              <Link to="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">Login</Link>
              <Link 
                to="/signup" 
                className="text-sm font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
              <ThemeToggle />
            </motion.div>
          </div>
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
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
          className="md:hidden bg-background/95 backdrop-blur-lg border-b border-border/40 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <button onClick={() => scrollToSection('features')} className="py-2 text-foreground/70 hover:text-foreground transition text-left">Features</button>
              <button onClick={() => scrollToSection('how-it-works')} className="py-2 text-foreground/70 hover:text-foreground transition text-left">How It Works</button>
              <button onClick={() => scrollToSection('pricing')} className="py-2 text-foreground/70 hover:text-foreground transition text-left">Pricing</button>
              <button onClick={() => scrollToSection('faq')} className="py-2 text-foreground/70 hover:text-foreground transition text-left">FAQ</button>
            </div>
            <div className="border-t border-border/40 my-2"></div>
            <div className="flex items-center gap-4 py-2">
              <Link to="/login" className="font-medium text-foreground/70 hover:text-foreground transition">Login</Link>
              <Link 
                to="/signup" 
                className="font-medium bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2 rounded-full hover:opacity-90 transition shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}
