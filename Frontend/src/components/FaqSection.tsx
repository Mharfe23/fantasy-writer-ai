
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FaqSection() {
  const faqs = [
    {
      question: "How do the tokens work?",
      answer: "Tokens are our virtual currency used to access AI features. Each feature (image generation, audio narration, etc.) costs a specific number of tokens. You receive tokens with your subscription plan and can purchase additional token packs if needed."
    },
    {
      question: "Who owns the content I create?",
      answer: "You retain full ownership of all content created on our platform, including your written stories, AI-generated images, and audio narrations. You're free to use them commercially or non-commercially."
    },
    {
      question: "Can I export my stories and assets?",
      answer: "Yes! You can export your stories in multiple formats (PDF, EPUB, DOCX), download your AI-generated images in high resolution, and save your audio narrations as MP3 files."
    },
    {
      question: "Is there a limit to how many images I can generate?",
      answer: "Free users can generate up to 2 images per month. Creator plan subscribers get 50 images monthly, while Professional plan users have unlimited image generation. You can also purchase additional tokens for more images."
    },
    {
      question: "What voice options are available for audio narration?",
      answer: "We offer a diverse range of voice options, including different accents, genders, and tones to match your story's characters and atmosphere. Premium subscribers have access to our entire voice library."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to your plan's benefits until the end of your current billing period."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Find answers to common questions about our platform.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="border border-border/50 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex justify-between items-center p-4 text-left font-medium focus:outline-none bg-card/30 hover:bg-card/50 transition"
              >
                <span>{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="h-5 w-5 flex-shrink-0 text-foreground/70" />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-shrink-0 text-foreground/70" />
                )}
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96 p-4' : 'max-h-0'
                }`}
              >
                <p className="text-foreground/70">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
