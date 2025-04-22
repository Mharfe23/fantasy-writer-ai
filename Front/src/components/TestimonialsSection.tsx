
import { motion } from "framer-motion";

export default function TestimonialsSection() {
  const testimonials = [
    {
      quote: "Fantasy Writer AI transformed my writing process. The image generation feature brings my scenes to life in ways I never thought possible.",
      author: "Sarah K.",
      title: "Fantasy Novelist"
    },
    {
      quote: "The audio narration tool is a game-changer. Now my readers can listen to my stories with incredible voice acting that I could never afford otherwise.",
      author: "Michael R.",
      title: "Self-published Author"
    },
    {
      quote: "As someone who struggles with writer's block, the AI assistance helps me flesh out ideas and keep my creativity flowing. Absolutely worth every token.",
      author: "Elena J.",
      title: "Creative Writing Teacher"
    }
  ];

  return (
    <section className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Writers Say</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of writers who have transformed their fantasy stories with our platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card/30 backdrop-blur-sm p-6 rounded-2xl border border-border/50"
            >
              <div className="mb-4 text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 11H6C6 11 6 9 8 9C10 9 9 7 9 6C9 5 10 2 6 2C2 2 2 6 2 6V14C2 16 4 16 4 16H10C12 16 12 14 12 13C12 12 12 11 10 11Z" fill="currentColor"/>
                  <path d="M22 11H18C18 11 18 9 20 9C22 9 21 7 21 6C21 5 22 2 18 2C14 2 14 6 14 6V14C14 16 16 16 16 16H22C24 16 24 14 24 13C24 12 24 11 22 11Z" fill="currentColor"/>
                </svg>
              </div>
              <p className="text-foreground/90 mb-4 italic">{testimonial.quote}</p>
              <div>
                <div className="font-medium">{testimonial.author}</div>
                <div className="text-sm text-foreground/70">{testimonial.title}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
