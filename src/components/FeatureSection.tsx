
import { motion } from "framer-motion";
import { Edit, Image, Headphones, FileText, Coins } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: <Edit className="h-6 w-6" />,
      title: "Smart Story Editor",
      description: "Write seamlessly with AI-powered suggestions to enhance your fantasy narratives."
    },
    {
      icon: <Image className="h-6 w-6" />,
      title: "AI Image Generator",
      description: "Turn your written scenes into beautiful fantasy visuals with a click."
    },
    {
      icon: <Headphones className="h-6 w-6" />,
      title: "Audio Narration",
      description: "Convert your chapters into immersive audiobooks with lifelike voices."
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "AI Summaries",
      description: "Get instant summaries of your stories or chapters to keep track of your narrative."
    },
    {
      icon: <Coins className="h-6 w-6" />,
      title: "Token System",
      description: "Simple pay-as-you-go tokens for accessing premium AI features when you need them."
    }
  ];

  return (
    <section id="features" className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Everything you need to create captivating fantasy stories, from writing to visualization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl border border-border/50 hover:border-border transition"
            >
              <div className="bg-primary/10 p-3 rounded-xl w-fit mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-foreground/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
