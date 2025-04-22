
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ThemeProvider } from "@/components/theme-provider"
import { ArrowRight, BookOpen, Image, Volume2, FileText, Info, MessageSquare, Star, ArrowDown } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

const staggerChildren = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
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
          
          {/* Down arrow for scrolling to next section */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.8,
              repeat: Infinity,
              repeatType: "reverse" 
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <ArrowDown className="h-8 w-8 text-muted-foreground/60" />
          </motion.div>
        </div>

        {/* Key Features Section */}
        <section id="features" className="py-24 px-6 relative z-10">
          <div className="container max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to create captivating fantasy narratives, from initial concept to final polished work
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: <BookOpen className="h-10 w-10 mb-4 text-primary" />,
                  title: "Smart Story Editor",
                  description: "AI-powered writing assistant that helps you craft compelling narratives, develop characters, and overcome writer's block."
                },
                {
                  icon: <Image className="h-10 w-10 mb-4 text-primary" />,
                  title: "AI Image Generator",
                  description: "Turn your text descriptions into stunning fantasy imagery. Create character portraits, landscapes, and scenes with a few clicks."
                },
                {
                  icon: <Volume2 className="h-10 w-10 mb-4 text-primary" />,
                  title: "Audio Narration",
                  description: "Convert your chapters into audiobooks with realistic AI voices. Choose from multiple narrators with fantasy-appropriate accents."
                },
                {
                  icon: <FileText className="h-10 w-10 mb-4 text-primary" />,
                  title: "AI-Driven Summaries",
                  description: "Get instant summaries of your chapters and overall story. Track character arcs, plot points, and maintain consistency."
                }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-card/40 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                >
                  {feature.icon}
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-24 px-6 relative bg-gradient-to-b from-background to-background/80 z-10">
          <div className="container max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Four simple steps to bring your fantasy world to life
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {/* Connecting line */}
              <div className="hidden lg:block absolute top-1/2 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/30 via-primary/50 to-primary/30 transform -translate-y-1/2 z-0" />
              
              {[
                {
                  step: "1",
                  title: "Write Your Story",
                  description: "Use our AI-powered editor to craft your narrative, with helpful suggestions to overcome writer's block."
                },
                {
                  step: "2",
                  title: "Highlight Descriptive Scenes",
                  description: "Select passages of text describing characters, locations, or action scenes for visualization."
                },
                {
                  step: "3",
                  title: "Generate Visuals & Audio",
                  description: "With one click, turn your descriptions into stunning imagery or convert text to natural-sounding narration."
                },
                {
                  step: "4",
                  title: "Share & Export",
                  description: "Export your work as an e-book, audiobook, or share it directly with your audience."
                }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col items-center text-center p-6 rounded-xl bg-card/20 backdrop-blur-sm border border-border/50 relative z-10"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing & Token Info */}
        <section id="pricing" className="py-24 px-6 relative z-10">
          <div className="container max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Pricing & Tokens</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Flexible options to meet your creative needs
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Free",
                  price: "$0",
                  description: "Perfect for trying out the platform",
                  features: [
                    "5 free tokens per day",
                    "Basic writing assistance",
                    "1 image generation per day",
                    "Access to community"
                  ],
                  cta: "Get Started",
                  popular: false
                },
                {
                  title: "Creator",
                  price: "$9.99",
                  period: "month",
                  description: "Everything you need for regular writing",
                  features: [
                    "100 tokens per month",
                    "Advanced writing assistance",
                    "Character & plot development",
                    "10 image generations per day",
                    "5 audio narrations per month",
                    "AI story summaries"
                  ],
                  cta: "Choose Creator",
                  popular: true
                },
                {
                  title: "Professional",
                  price: "$19.99",
                  period: "month",
                  description: "For serious fantasy authors",
                  features: [
                    "300 tokens per month",
                    "Premium writing assistance",
                    "Unlimited image generations",
                    "Unlimited audio narrations",
                    "Advanced story analysis",
                    "Export to multiple formats",
                    "Priority support"
                  ],
                  cta: "Choose Professional",
                  popular: false
                }
              ].map((plan) => (
                <motion.div
                  key={plan.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`flex flex-col p-6 rounded-xl border ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border/50'} relative h-full`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">{plan.title}</h3>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      {plan.period && <span className="text-muted-foreground">/{plan.period}</span>}
                    </div>
                    <p className="text-muted-foreground text-sm">{plan.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Star className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.popular ? "default" : "outline"}
                    className={`mt-auto w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : ''}`}
                  >
                    {plan.cta}
                  </Button>
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              viewport={{ once: true }}
              className="mt-16 p-6 rounded-xl border border-border/50 text-center"
            >
              <h3 className="text-xl font-semibold mb-2">Token Packs</h3>
              <p className="text-muted-foreground mb-6">Need more tokens? Purchase additional packs anytime</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { amount: "50 Tokens", price: "$4.99" },
                  { amount: "100 Tokens", price: "$8.99" },
                  { amount: "250 Tokens", price: "$19.99" }
                ].map((pack) => (
                  <Card key={pack.amount} className="backdrop-blur-sm">
                    <CardContent className="p-4 flex flex-col gap-2 items-center">
                      <div className="font-semibold">{pack.amount}</div>
                      <div className="text-muted-foreground">{pack.price}</div>
                      <Button variant="outline" size="sm" className="mt-2 w-full">
                        Purchase
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 px-6 relative bg-gradient-to-b from-background/90 to-background z-10">
          <div className="container max-w-5xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                See how Fantasy Writer AI is helping authors bring their stories to life
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  quote: "Fantasy Writer AI helped me visualize my characters exactly as I imagined them. The AI suggestions even improved my worldbuilding in ways I hadn't considered.",
                  author: "Elaine Morey",
                  title: "Fantasy Novelist"
                },
                {
                  quote: "I've been struggling with writer's block for months. This platform not only helped me overcome it, but the audio narration feature made me fall in love with my own story again.",
                  author: "Marcus Chen",
                  title: "Indie Author"
                },
                {
                  quote: "As a D&D Dungeon Master, I use Fantasy Writer AI to create vivid descriptions and imagery for my campaigns. My players are amazed by the detailed world I can now present to them.",
                  author: "Sophie Williams",
                  title: "Game Master & Writer"
                },
                {
                  quote: "The image generation perfectly captures the atmosphere I want for my dark fantasy series. I can finally show my readers exactly what's in my imagination.",
                  author: "Jamal Thompson",
                  title: "Fantasy Blogger"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.author}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex flex-col p-6 rounded-xl bg-card/30 backdrop-blur-sm border border-border/50 hover:border-primary/30 transition-all duration-300"
                >
                  <MessageSquare className="h-8 w-8 text-primary/50 mb-4" />
                  <p className="text-foreground/90 italic mb-6">{testimonial.quote}</p>
                  <div className="mt-auto">
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-24 px-6 relative z-10">
          <div className="container max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about Fantasy Writer AI
              </p>
            </motion.div>

            <div className="space-y-6">
              {[
                {
                  question: "How do tokens work on Fantasy Writer AI?",
                  answer: "Tokens are our platform's currency for using AI features. Different actions cost different amounts of tokens. For example, generating an image might cost 1 token, while a full chapter narration might cost 5 tokens. Free users get 5 tokens daily, while paid plans include monthly token allowances."
                },
                {
                  question: "Who owns the content I create?",
                  answer: "You retain full ownership of all content you create using Fantasy Writer AI, including stories, generated images, and audio narrations. You're free to use these for personal or commercial purposes."
                },
                {
                  question: "Can I export my work to other formats?",
                  answer: "Yes! Fantasy Writer AI allows you to export your stories as PDF, EPUB, DOCX, or plain text files. Audio narrations can be exported as MP3 files, and images can be downloaded as high-resolution PNG or JPG files."
                },
                {
                  question: "Is my writing private and secure?",
                  answer: "Absolutely. Your writing is private and only accessible by you unless you choose to share it. We use industry-standard encryption to protect your data and never use your content to train our AI models without explicit permission."
                },
                {
                  question: "How accurate are the AI-generated summaries?",
                  answer: "Our AI summaries are highly accurate for capturing plot points, character development, and maintaining consistency. However, we recommend reviewing them for creative nuances that only you as the author would know."
                },
                {
                  question: "Can I cancel my subscription anytime?",
                  answer: "Yes, you can cancel your subscription at any time. You'll continue to have access to your paid features until the end of your current billing period."
                }
              ].map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-card/20 backdrop-blur-sm border border-border/50"
                >
                  <div className="flex gap-4">
                    <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-24 px-6 relative z-10">
          <div className="container max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              viewport={{ once: true }}
              className="p-10 md:p-16 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-lg border border-primary/20 text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to bring your fantasy world to life?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands of authors who are using AI to enhance their creative writing process.
                Get started today with 5 free tokens, no credit card required.
              </p>
              <Button 
                size="lg"
                className="px-8 py-6 text-lg rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group"
              >
                Start Writing Now 
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 relative z-10 border-t border-border/30">
          <div className="container max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
              <div className="md:col-span-1">
                <h3 className="text-lg font-semibold mb-4">Fantasy Writer AI</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Bringing your fantasy worlds to life with the power of AI.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#features" className="hover:text-primary transition-colors">Smart Editor</a></li>
                  <li><a href="#features" className="hover:text-primary transition-colors">Image Generation</a></li>
                  <li><a href="#features" className="hover:text-primary transition-colors">Audio Narration</a></li>
                  <li><a href="#features" className="hover:text-primary transition-colors">Story Summaries</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Resources</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                  <li><a href="#pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                  <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                </ul>
              </div>
            </div>
            
            <Separator className="my-8 opacity-20" />
            
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © 2025 Fantasy Writer AI. All rights reserved.
              </div>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  )
}

export default Index
