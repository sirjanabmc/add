import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useRef, useState, useMemo } from "react";

export const FAQSection: React.FC = () => {
  const title = "Frequently Asked Questions";
  const description = "Common questions about our platform.";

  // ✅ Memoized FAQ data (for performance)
  const faqs = useMemo(
    () => [
      {
        question: "How do I get started?",
        answer:
          "Sign up for a free account, choose your plan, and start building immediately. Our onboarding guide will walk you through the process step by step.",
      },
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for enterprise customers. All payments are processed securely.",
      },
      {
        question: "Can I cancel my subscription anytime?",
        answer:
          "Yes! You can cancel your subscription at any time from your account settings. You will continue to have access until the end of your current billing period.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Absolutely. We use enterprise-grade encryption, regular security audits, and comply with GDPR and SOC 2 standards to ensure your data is protected.",
      },
      {
        question: "Do you offer customer support?",
        answer:
          "Yes! We provide 24/7 support via chat and email for all paid plans. Enterprise customers also get dedicated phone support.",
      },
    ],
    []
  );

  // ✅ Accordion mode — only one open at a time
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggleItem = (index: number) => {
    const itemId = index.toString();
    setOpenItem((prev) => (prev === itemId ? null : itemId));
  };

  // ✅ Framer Motion in-view animation
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={containerRef}
      className="py-20 px-6 bg-white dark:bg-zinc-900 transition-colors duration-300"
    >
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {title}
          </motion.h2>

          <motion.p
            className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {description}
          </motion.p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {faqs.map((faq, index) => {
            const isOpen = openItem === index.toString();

            return (
              <motion.div
                key={index}
                className="group border border-zinc-200 dark:border-zinc-700 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-zinc-800"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
              >
                {/* Button */}
                <motion.button
                  id={`faq-question-${index}`}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  onClick={() => toggleItem(index)}
                  className="w-full p-6 text-left flex items-center justify-between transition-colors duration-200"
                >
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 pr-4">
                    {faq.question}
                  </h3>

                  <motion.div
                    animate={{
                      rotate: isOpen ? 180 : 0,
                      backgroundColor: isOpen
                        ? "#27272a"
                        : "rgba(244,244,245,0.8)",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-colors duration-300 ${
                        isOpen ? "text-white" : "text-zinc-600 dark:text-zinc-300"
                      }`}
                    />
                  </motion.div>
                </motion.button>

                {/* Answer Panel */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      role="region"
                      aria-labelledby={`faq-question-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        className="px-6 pb-6"
                        initial={{ y: -10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -10, opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                      >
                        <p className="text-zinc-800 dark:text-zinc-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
