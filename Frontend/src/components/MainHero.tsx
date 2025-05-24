
import { motion } from "framer-motion";

export default function MainHero() {
  return (
    <section className="pt-32 pb-20 md:pt-36 md:pb-24 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500"
          >
            Bring your fantasy world to life with AI
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto"
          >
            Transform your imagination into vivid experiences with our AI-powered writing editor, 
            stunning image generation, immersive audio narration, and insightful summaries.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="pt-4"
          >
            <a
              href="/signup"
              className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-8 py-3 rounded-full text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
            >
              Get Started
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
