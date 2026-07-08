import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Flame, ArrowRight, ShoppingBag, Ruler, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useProducts } from '../hooks/useProducts';

import { FAQ } from '../components/FAQ';

export function HomePage({ onNavigate, onAddToCart, onOpenSizeGuide, wishlist = new Set(), toggleWishlist }: { onNavigate: (page: string) => void, onAddToCart: (product: any) => void, onOpenSizeGuide: () => void, wishlist?: Set<string>, toggleWishlist?: (id: string) => void }) {
  const [currentImageSet, setCurrentImageSet] = useState(0);
  const { products } = useProducts();

  // Manually define the images to show in the hero carousel
  const uniqueImages = [
    "/redeemed.png",
    "/salt-light.png",
    "/walk-by-faith.png"
  ];

  useEffect(() => {
    if (uniqueImages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentImageSet((prev) => (prev + 1) % uniqueImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [uniqueImages.length]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-gradient-to-br from-teal-primary via-dark-teal to-[#1A1A2E] pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 }
              }
            }}
            className="max-w-xl text-center md:text-left z-20"
          >
            <motion.h1 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="font-playfair text-5xl md:text-[72px] leading-tight text-white mb-6"
            >
              Every Shirt Is <br className="hidden md:block" /> A Sermon.
            </motion.h1>
            <motion.p 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="font-inter text-sky-blue text-lg md:text-xl mb-10 max-w-2xl"
            >
              Faith-driven apparel for a generation that carries the Word everywhere.
            </motion.p>
            <motion.div 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
              }}
              className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
            >
              <button 
                onClick={() => onNavigate('collections')}
                className="bg-white text-teal-primary font-inter font-semibold py-4 px-8 rounded-full hover:bg-sky-blue transition-colors flex items-center justify-center gap-2"
              >
                Shop Collections <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => onNavigate('aigenerator')}
                className="bg-transparent border border-white text-white font-inter font-semibold py-4 px-8 rounded-full hover:bg-white/10 transition-colors"
              >
                Generate Your Design
              </button>
            </motion.div>
          </motion.div>

          {/* Right Content - Single Image Carousel */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative w-full max-w-[500px] h-[350px] sm:h-[400px] md:h-[500px] mt-8 md:mt-0 mx-auto flex items-center justify-center flex-col"
          >
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative w-64 sm:w-80 md:w-96 h-72 sm:h-80 md:h-[400px] z-30"
            >
              <img 
                key={`carousel-${currentImageSet}`}
                src={uniqueImages[currentImageSet % uniqueImages.length] || "/redeemed.png"} 
                alt="Featured Product" 
                className="absolute inset-0 w-full h-full object-contain drop-shadow-2xl transition-opacity duration-500"
              />
            </motion.div>

            {/* Slider Dots */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40">
              {uniqueImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageSet(idx)}
                  className={`w-3 h-3 rounded-full transition-colors ${idx === (currentImageSet % uniqueImages.length) ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 md:w-96 h-64 md:h-96 bg-white/40 blur-[50px] md:blur-[80px] rounded-full z-10 pointer-events-none"></div>
          </motion.div>
        </div>
      </section>

      {/* Scripture Banner (Marquee) */}
      <div className="bg-teal-primary overflow-hidden py-4 border-y border-white/10">
        <div className="whitespace-nowrap flex w-[200%] animate-[marquee_20s_linear_infinite]">
          {/* Repeat content twice for seamless looping */}
          {[1, 2].map((i) => (
            <div key={i} className="flex-1 flex justify-around items-center space-x-8 text-white font-bebas text-xl tracking-[0.15em] shrink-0">
              <span>WEAR THE WORD</span>
              <span>•</span>
              <span>SHARE THE WORD</span>
              <span>•</span>
              <span>CREATE FROM THE WORD</span>
              <span>•</span>
              <span>EVERY SHIRT IS A SERMON</span>
              <span>•</span>
              <span>SCRIPTURE FIRST</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>

      {/* Volume Collections */}
      <section className="py-16 bg-beige">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-playfair text-3xl md:text-4xl text-dark-text mb-4">Volume Collections</h2>
            <p className="font-inter text-dark-text/70 text-base">Curated scripture-inspired themes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-teal-primary rounded-2xl text-white relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img src="/redeemed.png" alt="Volume I Tee" className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-teal-primary via-teal-primary/20 to-transparent"></div>
              </div>
              <div className="relative z-10 flex-grow px-6 pb-6 -mt-12">
                <h3 className="font-bebas text-2xl mb-1">Volume I</h3>
                <p className="font-inter italic text-sky-blue mb-4 text-sm">Isaiah 55:11</p>
                <p className="font-playfair text-base leading-snug mb-6 line-clamp-2 text-white/90">
                  "So shall my word be that goes out from my mouth; it shall not return to me empty."
                </p>
                <button 
                  onClick={() => onNavigate('collections')}
                  className="w-full bg-white text-teal-primary font-inter font-semibold py-2.5 rounded-xl hover:bg-sky-blue transition-colors mt-auto relative z-10 text-sm"
                >
                  Explore Volume I
                </button>
              </div>
            </motion.div>

            {/* Card 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="bg-dark-teal rounded-2xl text-white relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img src="/salt-light.png" alt="Volume II Tee" className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-teal via-dark-teal/20 to-transparent"></div>
              </div>
              <div className="relative z-10 flex-grow px-6 pb-6 -mt-12">
                <h3 className="font-bebas text-2xl mb-1">Volume II</h3>
                <p className="font-inter italic text-sky-blue mb-4 text-sm">Hebrews 4:12</p>
                <p className="font-playfair text-base leading-snug mb-6 line-clamp-2 text-white/90">
                  "For the word of God is living and active, sharper than any two-edged sword."
                </p>
                <button 
                  onClick={() => onNavigate('collections')}
                  className="w-full bg-white text-dark-teal font-inter font-semibold py-2.5 rounded-xl hover:bg-sky-blue transition-colors mt-auto relative z-10 text-sm"
                >
                  Explore Volume II
                </button>
              </div>
            </motion.div>

            {/* Card 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-[#1A1A2E] rounded-2xl text-white relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col"
            >
              <div className="h-48 overflow-hidden relative">
                <img src="/walk-by-faith.png" alt="Volume III Tee" className="w-full h-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A2E] via-[#1A1A2E]/20 to-transparent"></div>
              </div>
              <div className="relative z-10 flex-grow px-6 pb-6 -mt-12">
                <h3 className="font-bebas text-2xl mb-1">Volume III</h3>
                <p className="font-inter italic text-sky-blue mb-4 text-sm">Romans 12:2</p>
                <p className="font-playfair text-base leading-snug mb-6 line-clamp-2 text-white/90">
                  "Do not conform to the pattern of this world, but be transformed by the renewing of your mind."
                </p>
                <button 
                  onClick={() => onNavigate('collections')}
                  className="w-full bg-white text-[#1A1A2E] font-inter font-semibold py-2.5 rounded-xl hover:bg-sky-blue transition-colors mt-auto relative z-10 text-sm"
                >
                  Explore Volume III
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white border-t border-sky-blue/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="font-playfair text-3xl md:text-4xl text-dark-text mb-2">Latest Drops</h2>
              <p className="font-inter text-dark-text/70 text-base">Fresh arrivals from our core collection</p>
            </div>
            <button 
              onClick={() => onNavigate('collections')}
              className="font-inter font-semibold text-teal-primary flex items-center gap-2 hover:text-dark-teal transition-colors group text-sm"
            >
              View All Products
              <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="group flex flex-col">
                <div 
                  className="relative aspect-[3/4] rounded-2xl mb-4 overflow-hidden flex flex-col items-center justify-center transition-transform duration-300 group-hover:scale-[1.02]"
                  style={{ backgroundColor: product.color }}
                >
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="absolute inset-0 w-full h-full object-contain p-4 drop-shadow-xl"
                    />
                  )}
                  {product.isNew && (
                    <div className="absolute top-4 left-4 bg-teal-primary text-white font-inter text-xs font-bold px-3 py-1 rounded-full z-20 shadow-sm border border-white/20">
                      New Drop
                    </div>
                  )}
                  <button 
                    onClick={() => toggleWishlist?.(product.id)}
                    className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm transition-colors"
                  >
                    <Heart 
                      size={20} 
                      className={wishlist.has(product.id) ? "fill-white text-white" : "text-white"} 
                    />
                  </button>
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                </div>
                <div className="flex flex-col flex-grow">
                  <h3 className="font-inter font-bold text-dark-text text-lg leading-tight mb-1">{product.name}</h3>
                  <p className="font-inter italic text-teal-primary text-sm mb-3">{product.scripture}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="font-bebas text-[22px] text-dark-text">{product.priceDisplay}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={onOpenSizeGuide}
                        className="text-gray-400 hover:text-teal-primary transition-colors"
                        title="Size Guide"
                      >
                        <Ruler size={20} />
                      </button>
                      <button 
                        onClick={() => onAddToCart(product)}
                        className="bg-teal-primary text-white p-2.5 rounded-xl hover:bg-dark-teal transition-colors flex items-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        <span className="font-inter font-semibold text-sm hidden sm:inline-block">Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brief About Us */}
      <section className="py-24 bg-beige border-t border-sky-blue/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="font-bebas text-teal-primary tracking-[0.3em] text-sm md:text-base block mb-6">BRIEF ABOUT US</span>
          <h2 className="font-playfair text-4xl md:text-5xl lg:text-[48px] text-dark-text mb-8 leading-tight">
            Scripture belongs everywhere.
          </h2>
          <p className="font-inter text-lg text-dark-text/80 leading-relaxed mb-16">
            For The Word exists at the intersection of faith, fashion, technology, and community. We build a platform where Scripture becomes wearable, shareable, and culturally relevant — helping believers carry God's Word beyond church walls and into everyday life.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-blue/20">
              <div className="text-3xl mb-4">📖</div>
              <h4 className="font-inter font-bold text-dark-text mb-2">Scripture First</h4>
              <p className="font-inter text-sm text-dark-text/70">Every design begins with God's Word</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-blue/20">
              <div className="text-3xl mb-4">🎨</div>
              <h4 className="font-inter font-bold text-dark-text mb-2">Creative Worship</h4>
              <p className="font-inter text-sm text-dark-text/70">Design as an act of faith</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-sky-blue/20">
              <div className="text-3xl mb-4">🌍</div>
              <h4 className="font-inter font-bold text-dark-text mb-2">Global Impact</h4>
              <p className="font-inter text-sm text-dark-text/70">Scripture in every culture</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white overflow-hidden flex flex-col items-center">
        <h2 className="font-playfair text-4xl text-center text-dark-text mb-16 px-4">What the Community Says</h2>
        
        <div className="flex w-[200%] md:w-[150%] animate-[marquee_40s_linear_infinite] hover:[animation-play-state:paused]">
          {[1, 2].map((group) => (
            <div key={group} className="flex-1 flex justify-around space-x-6 px-3 shrink-0">
              {[
                {
                  quote: "This hoodie started 3 gospel conversations in one week.",
                  author: "@grace.moves",
                  location: "Lagos State"
                },
                {
                  quote: "The AI Generator helped my church design our entire conference merch.",
                  author: "@pastor_mike",
                  location: "Oyo State"
                },
                {
                  quote: "Finally, streetwear that represents what I actually believe.",
                  author: "@faithfulstyle",
                  location: "Osun State"
                },
                {
                  quote: "The quality is unmatched and the message is bold.",
                  author: "@kingdom.builder",
                  location: "Ogun State"
                },
                {
                  quote: "I love wearing my faith on my sleeve, literally. The designs are so fresh.",
                  author: "@sarah.faith",
                  location: "Lagos State"
                },
                {
                  quote: "Such a beautiful way to express what matters most. Shipping was fast too!",
                  author: "@david.worships",
                  location: "Oyo State"
                },
                {
                  quote: "I've been looking for Christian apparel that actually looks good. Found it.",
                  author: "@truth.seeker",
                  location: "Ogun State"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="w-[350px] bg-beige border-l-4 border-teal-primary p-8 rounded-r-xl shadow-sm shrink-0 whitespace-normal">
                  <div className="flex text-yellow-400 mb-4 text-sm">⭐⭐⭐⭐⭐</div>
                  <p className="font-inter text-dark-text text-lg italic mb-6">"{testimonial.quote}"</p>
                  <div className="font-inter text-sm font-semibold text-dark-teal">
                    {testimonial.author} <span className="text-dark-text/50 font-normal">, {testimonial.location}</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* Newsletter */}
      <section className="py-24 bg-gradient-to-br from-teal-primary to-dark-teal relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10">
           <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-playfair text-4xl md:text-5xl text-white mb-4">Join the Word Movement</h2>
          <p className="font-inter text-white/80 text-lg mb-10">Get early access to drops, scripture designs, and community updates.</p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-grow bg-white/10 border border-white/30 text-white placeholder-white/50 px-6 py-4 rounded-xl focus:outline-none focus:border-white focus:bg-white/20 transition-all font-inter"
              required
            />
            <button 
              type="submit"
              className="bg-white text-teal-primary font-inter font-bold px-8 py-4 rounded-xl hover:bg-sky-blue transition-colors whitespace-nowrap"
            >
              Join Now
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
