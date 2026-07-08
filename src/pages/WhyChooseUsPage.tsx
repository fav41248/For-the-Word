import React from 'react';
import { BookOpen, Bot, Award, Globe, RefreshCcw, Zap, Check, X } from 'lucide-react';

export function WhyChooseUsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="bg-teal-primary text-white py-32 px-4 text-center mt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Faith. Fashion. Technology.
          </h1>
          <p className="font-inter text-xl text-sky-blue max-w-2xl mx-auto leading-relaxed">
            We didn't just build a clothing brand. We built a scripture-powered creative ecosystem.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="bg-white py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl text-dark-text mb-4">A New Paradigm</h2>
            <p className="font-inter text-dark-text/70">How we're redefining faith-based apparel.</p>
          </div>
          
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-lg border border-sky-blue/30">
            {/* Left Column */}
            <div className="flex-1 bg-gray-50 p-8 md:p-12 border-b md:border-b-0 md:border-r border-sky-blue/30">
              <h3 className="font-bebas text-2xl text-dark-text/60 mb-8 text-center tracking-wide">Most Christian Brands</h3>
              <ul className="space-y-6">
                {[
                  "Generic designs",
                  "No personalization",
                  "Disconnected from culture",
                  "No technology"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-inter text-dark-text/70">
                    <X size={20} className="text-red-400 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Right Column */}
            <div className="flex-1 bg-teal-primary p-8 md:p-12 text-white relative overflow-hidden">
              {/* Decorative background element */}
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <img src="/logo.png" alt="FTW" className="h-48 object-contain brightness-0 invert" />
              </div>
              <h3 className="font-bebas text-3xl mb-8 text-center tracking-wide relative z-10">For The Word</h3>
              <ul className="space-y-6 relative z-10">
                {[
                  "Scripture-first design",
                  "AI-powered personalization",
                  "Built for Gen Z culture",
                  "Faith + Tech integration"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 font-inter font-semibold text-lg">
                    <Check size={24} className="text-sky-blue shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="bg-beige py-24 px-4 border-t border-sky-blue/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-playfair text-4xl text-dark-text mb-4">Built Different</h2>
            <p className="font-inter text-dark-text/70">Everything you need to wear your faith boldly.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen size={32} />, title: "Scripture-First Design", desc: "Every piece starts with a Bible verse, not a trend." },
              { icon: <Bot size={32} />, title: "AI Design Generator", desc: "Turn any verse into a wearable work of art in seconds." },
              { icon: <Award size={32} />, title: "Premium Quality", desc: "Streetwear-grade materials designed to last and look good." },
              { icon: <Globe size={32} />, title: "Community Driven", desc: "Built with and for the global body of Christ." },
              { icon: <RefreshCcw size={32} />, title: "Drop Culture", desc: "Limited edition collections that create meaningful moments." },
              { icon: <Zap size={32} />, title: "Print-On-Demand", desc: "Your custom design, printed and shipped to your door." }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-sky-blue/20 hover:-translate-y-1 transition-transform duration-300">
                <div className="text-teal-primary mb-6 bg-sky-blue/20 w-16 h-16 rounded-xl flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-inter font-bold text-xl text-dark-text mb-3">{feature.title}</h3>
                <p className="font-inter text-dark-text/70 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="bg-dark-teal text-white py-20 px-4 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-white/20">
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <span className="font-bebas text-6xl lg:text-7xl mb-2 text-sky-blue tracking-wider">100+</span>
              <span className="font-inter font-medium uppercase tracking-widest text-sm text-white/80">Designs Generated</span>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <span className="font-bebas text-6xl lg:text-7xl mb-2 text-sky-blue tracking-wider">3</span>
              <span className="font-inter font-medium uppercase tracking-widest text-sm text-white/80">Scripture Collections</span>
            </div>
            <div className="flex flex-col items-center pt-8 md:pt-0">
              <span className="font-bebas text-6xl lg:text-7xl mb-2 text-sky-blue tracking-wider">4+</span>
              <span className="font-inter font-medium uppercase tracking-widest text-sm text-white/80">Countries Reached</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
