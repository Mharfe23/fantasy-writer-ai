
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const Index = () => {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 dark:from-purple-900/20 dark:to-blue-900/20" />
        
        {/* Navigation */}
        <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-foreground"
          >
            Fantasy Writer AI
          </motion.div>
          <ThemeToggle />
        </nav>

        {/* Hero Section */}
        <div className="relative pt-32 px-6 container mx-auto max-w-6xl min-h-screen flex flex-col items-center justify-center text-center gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent"
          >
            Bring your fantasy world to life with AI
          </motion.h1>

          <motion.p
            {...fadeIn}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-6"
          >
            Unleash your creativity with our AI-powered writing editor. Generate immersive imagery,
            bring your stories to life with audio narration, create quick summaries, and access
            it all with our flexible token-based system.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              Get Started
            </Button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
          >
            {[
              "AI Writing Assistant",
              "Image Generation",
              "Audio Narration",
              "Smart Summaries"
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-xl bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg"
              >
                <h3 className="font-semibold text-lg mb-2">{feature}</h3>
                <p className="text-sm text-muted-foreground">
                  Enhance your storytelling with powerful AI tools
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default Index
