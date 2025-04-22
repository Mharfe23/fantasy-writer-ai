
import { motion } from "framer-motion";

export default function CallToAction() {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-12 bg-gradient-to-br from-purple-600/20 via-indigo-600/20 to-blue-600/20 border border-primary/20"
        >
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[center_top_1rem]" />
          <div className="relative z-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Creating Your Fantasy World Today</h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Join thousands of writers who have transformed their stories with AI-powered tools.
              Try Fantasy Writer AI now with 500 free tokens.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <a
                href="/signup"
                className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium px-8 py-3 rounded-full text-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-200"
              >
                Get Started — It's Free
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
