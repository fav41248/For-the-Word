import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Ruler } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, size: string) => void;
  onOpenSizeGuide: () => void;
}

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export function QuickViewModal({ isOpen, onClose, product, onAddToCart, onOpenSizeGuide }: QuickViewModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size first");
      return;
    }
    onAddToCart(product, selectedSize);
    onClose();
    setSelectedSize('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row relative"
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white/50 hover:bg-white rounded-full transition-colors shadow-sm"
          >
            <X size={20} />
          </button>
          
          {/* Image */}
          <div className="w-full md:w-1/2 bg-sky-blue/20 p-8 flex items-center justify-center min-h-[300px]">
            <img 
              src={product.image || 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800&auto=format&fit=crop'} 
              alt={product.name} 
              className="w-full h-full object-contain max-h-[400px]"
            />
          </div>
          
          {/* Details */}
          <div className="w-full md:w-1/2 p-8 flex flex-col">
            <div className="mb-2">
              <span className="text-xs font-bold tracking-widest text-teal-primary uppercase bg-teal-primary/10 px-3 py-1 rounded-full">
                {product.volume}
              </span>
            </div>
            <h2 className="font-playfair text-3xl text-dark-text mt-4">{product.name}</h2>
            <p className="font-inter text-dark-text/70 italic mt-2">"{product.scripture}"</p>
            
            <div className="font-bebas text-3xl text-dark-text my-6">{product.priceDisplay}</div>
            
            {/* Size Selector */}
            <div className="mt-auto">
              <div className="flex justify-between items-end mb-3">
                <span className="font-inter font-medium text-dark-text text-sm">Select Size</span>
                <button 
                  onClick={onOpenSizeGuide}
                  className="text-xs font-inter text-teal-primary hover:underline flex items-center gap-1"
                >
                  <Ruler size={12} /> Size Guide
                </button>
              </div>
              <div className="flex gap-3 mb-6">
                {SIZES.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-inter font-medium transition-colors border-2 ${
                      selectedSize === s 
                        ? 'border-teal-primary bg-teal-primary text-white' 
                        : 'border-sky-blue text-dark-text hover:border-teal-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              
              <button
                onClick={handleAddToCart}
                className="w-full bg-dark-text text-white py-4 rounded-xl font-inter font-semibold hover:bg-teal-primary transition-colors flex justify-center items-center gap-2"
              >
                <ShoppingBag size={20} /> Add to Cart
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
