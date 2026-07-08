import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: "How does the sizing run?",
    answer: "Our streetwear garments are designed with a relaxed, slightly oversized fit. We recommend ordering your true size for the intended look, or sizing down if you prefer a more tailored fit. Check our Size Guide on any product page for exact measurements."
  },
  {
    question: "How long does shipping take?",
    answer: "Standard orders are processed within 1-2 business days. Domestic shipping typically takes 3-5 business days, while international shipping can take 7-14 business days depending on the destination."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship globally! Shipping rates and times are calculated at checkout based on your location. Please note that international customers are responsible for any custom duties or taxes."
  },
  {
    question: "What is the inspiration behind your designs?",
    answer: "Every piece is designed to be a conversation starter. We draw inspiration directly from scripture, combining modern streetwear aesthetics with bold, faith-based messages to help you wear the Word."
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns and exchanges within 30 days of delivery. Items must be unworn, unwashed, and in their original condition with tags attached. Please visit our Returns portal to initiate the process."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-24 bg-beige relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-playfair text-4xl text-dark-text mb-4">Frequently Asked Questions</h2>
          <p className="font-inter text-gray-600 text-lg">Everything you need to know about our products and services.</p>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
              >
                <span className="font-inter font-semibold text-dark-text text-lg pr-4">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-teal-primary shrink-0"
                >
                  <ChevronDown size={24} />
                </motion.div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    <div className="p-6 pt-0 font-inter text-gray-600 leading-relaxed border-t border-gray-50 mt-2">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
