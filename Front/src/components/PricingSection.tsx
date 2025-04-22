
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "Free",
      description: "Perfect for trying out the platform",
      features: [
        "500 tokens to start",
        "Basic story editor",
        "2 AI images per month",
        "Text-only exports"
      ],
      buttonText: "Start Free",
      highlighted: false
    },
    {
      name: "Creator",
      price: "$12",
      period: "/month",
      description: "For serious fantasy writers",
      features: [
        "5,000 tokens monthly",
        "Advanced AI writing tools",
        "50 AI images per month",
        "10 audio narrations",
        "Priority support",
        "All export formats"
      ],
      buttonText: "Choose Creator",
      highlighted: true
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      description: "For power users and teams",
      features: [
        "15,000 tokens monthly",
        "Unlimited AI writing tools",
        "Unlimited AI images",
        "50 audio narrations",
        "API access",
        "Team collaboration"
      ],
      buttonText: "Choose Professional",
      highlighted: false
    }
  ];

  const tokenPacks = [
    { amount: "1,000", price: "$5" },
    { amount: "5,000", price: "$20" },
    { amount: "10,000", price: "$35" }
  ];

  return (
    <section id="pricing" className="py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple Pricing</h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Choose the plan that fits your creative needs, with flexible subscription options and token packs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`rounded-2xl p-6 ${plan.highlighted ? 
                'bg-gradient-to-b from-primary/20 to-background border-primary/30' : 
                'bg-card/50 backdrop-blur-sm border-border/50'} border relative`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground text-sm font-medium py-1 px-3 rounded-full">
                  Most Popular
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && <span className="text-foreground/70 ml-1">{plan.period}</span>}
                </div>
                <p className="text-foreground/70 mt-2">{plan.description}</p>
              </div>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start">
                    <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button className={`w-full py-2 rounded-lg font-medium ${
                plan.highlighted 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' 
                  : 'bg-primary/10 text-foreground hover:bg-primary/20'
              } transition`}>
                {plan.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-card/30 backdrop-blur-sm rounded-2xl p-8 border border-border/50"
        >
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Token Packs</h3>
            <p className="text-foreground/70">Need more tokens? Purchase additional packs anytime.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokenPacks.map((pack, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.4 }}
                className="bg-background/50 border border-border/50 rounded-xl p-4 text-center"
              >
                <div className="text-xl font-semibold mb-1">{pack.amount} Tokens</div>
                <div className="text-lg font-bold text-primary mb-3">{pack.price}</div>
                <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 rounded-lg font-medium transition">
                  Buy Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
