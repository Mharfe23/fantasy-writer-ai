
import { motion } from "framer-motion";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Write Your Story",
      description: "Start writing your fantasy story in our intuitive editor designed for creative writing."
    },
    {
      number: "02",
      title: "Highlight Key Scenes",
      description: "Select descriptive scenes or paragraphs that you want to transform into visuals or audio."
    },
    {
      number: "03",
      title: "Generate Content",
      description: "Use AI to create stunning images or narrations based on your highlighted text."
    },
    {
      number: "04",
      title: "Share or Export",
      description: "Export your work in multiple formats or share it directly with your audience."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 bg-background/50">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Our simple process takes you from imagination to immersive fantasy content in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative"
            >
              <div className="text-5xl font-bold text-primary/20 mb-2">{step.number}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-foreground/70">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary/20 to-transparent transform translate-x-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
