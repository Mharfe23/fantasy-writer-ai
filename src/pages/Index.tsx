
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
        {/* Gradient background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-blue-500/10 dark:from-purple-900/10 dark:to-blue-900/10" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)]" />
        </div>

        {/* Navigation */}
        <nav className="absolute top-0 w-full p-6 flex justify-between items-center z-10">
          <div className="w-24" /> {/* Spacer for centering */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-lg font-medium text-foreground/80"
          >
            Fantasy Writer AI
          </motion.div>
          <ThemeToggle />
        </nav>

        {/* Hero Section */}
        <div className="relative pt-32 px-6 container mx-auto max-w-3xl min-h-screen flex flex-col items-center justify-center text-center gap-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent"
          >
            Write your fantasy story<br />with magical AI
          </motion.h1>

          <motion.p
            {...fadeIn}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed"
          >
            Your AI writing companion that helps you craft immersive fantasy worlds, 
            bringing your stories to life with stunning imagery and enchanting audio narration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
            >
              Start Writing Now
            </Button>
            <div className="text-sm text-muted-foreground">
              No credit card required
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-16"
          >
            {[
              {
                title: "AI Writing Assistant",
                description: "Get intelligent suggestions and overcome writer's block"
              },
              {
                title: "Image Generation",
                description: "Visualize your characters and scenes instantly"
              },
              {
                title: "Audio Narration",
                description: "Bring your stories to life with enchanting voices"
              },
              {
                title: "Smart Summaries",
                description: "Keep track of your plot and character arcs"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-border/80 transition-colors"
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
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
