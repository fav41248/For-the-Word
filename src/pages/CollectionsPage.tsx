import React, { useState } from 'react';
import { Heart, ShoppingBag, Loader2, Ruler, Search, SlidersHorizontal, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';
import { QuickViewModal } from '../components/QuickViewModal';
import { useProducts } from '../hooks/useProducts';

interface CollectionsPageProps {
  onAddToCart: (product: Product) => void;
  onOpenSizeGuide: () => void;
  wishlist?: Set<string>;
  toggleWishlist?: (id: string) => void;
}

export const PRODUCTS: Product[] = [
  { id: '1', name: 'Redeemed Culture Tee', scripture: 'Isaiah 55:11', price: 15000, priceDisplay: '₦15,000', category: 'T-Shirts', volume: 'Volume I', color: '#567C8D', isNew: true, image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580258/redeemed_mosnvw.png' },
  { id: '2', name: 'Isaiah 55:11 Hoodie', scripture: 'Isaiah 55:11', price: 28000, priceDisplay: '₦28,000', category: 'Hoodies', volume: 'Volume I', color: '#567C8D', image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580257/hoodie_ur6d3q.png' },
  { id: '3', name: 'Salt & Light Tee', scripture: 'Matthew 5:13-16', price: 15000, priceDisplay: '₦15,000', category: 'T-Shirts', volume: 'Volume II', color: '#3A5A6B', image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580258/salt-light_owqoe5.png' },
  { id: '4', name: 'Walk By Faith Cap', scripture: '2 Corinthians 5:7', price: 10000, priceDisplay: '₦10,000', category: 'Caps', volume: 'Volume II', color: '#3A5A6B', isNew: true, image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/walk-by-faith_mpyjek.png' },
  { id: '5', name: 'Romans 12:2 Tee', scripture: 'Romans 12:2', price: 15000, priceDisplay: '₦15,000', category: 'T-Shirts', volume: 'Volume III', color: '#1A1A2E', image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580258/tee_tpppm4.png' },
  { id: '6', name: 'Romans 12:2 Hoodie', scripture: 'Romans 12:2', price: 28000, priceDisplay: '₦28,000', category: 'Hoodies', volume: 'Volume III', color: '#1A1A2E', image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/walk_uefuay.png' },
  { id: '7', name: 'FTW Logo Tee', scripture: 'Core Collection', price: 12000, priceDisplay: '₦12,000', category: 'T-Shirts', volume: 'Core', color: '#C8D9E6', image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580258/tee_tpppm4.png' },
  { id: '8', name: 'FTW Scripture Cap', scripture: 'Core Collection', price: 10000, priceDisplay: '₦10,000', category: 'Caps', volume: 'Core', color: '#C8D9E6', image: 'https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580259/cap_1_cylmt1.png' },
];

const FILTERS = ['All', 'T-Shirts', 'Hoodies', 'Caps', 'Accessories'];

export function CollectionsPage({ onAddToCart, onOpenSizeGuide, wishlist = new Set(), toggleWishlist }: CollectionsPageProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { products, loading } = useProducts();

  
  const filteredProducts = products.filter(p => {
    const matchesCategory = activeFilter === 'All' || p.category === activeFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.scripture && p.scripture.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    return 0; // Default newest can just use array order
  });


  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-24 flex justify-center items-center">
        <Loader2 className="w-8 h-8 text-teal-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="font-playfair text-5xl text-dark-text mb-8">All Collections</h1>
        

        {/* Advanced Filters & Search */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-sky-blue/30">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-inter font-medium transition-colors text-sm border ${
                  activeFilter === filter 
                    ? 'bg-teal-primary text-white border-teal-primary' 
                    : 'bg-beige text-dark-text border-transparent hover:border-sky-blue'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow sm:flex-grow-0 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-text/40 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-beige pl-10 pr-4 py-2 rounded-full font-inter text-sm border border-transparent focus:border-teal-primary focus:outline-none transition-colors text-dark-text placeholder:text-dark-text/40"
              />
            </div>
            
            <div className="relative min-w-[140px]">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-beige appearance-none pl-4 pr-10 py-2 rounded-full font-inter text-sm border border-transparent focus:border-teal-primary focus:outline-none transition-colors text-dark-text"
              >
                <option value="newest">Sort by: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text/60 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {filteredProducts.map((product, index) => (
          <motion.div 
            key={product.id} 
            className="group flex flex-col"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {/* Product Image Area */}
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
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
            </div>

            {/* Product Info */}
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
                    onClick={() => setQuickViewProduct(product)}
                    className="bg-teal-primary text-white p-2.5 rounded-xl hover:bg-dark-teal transition-colors flex items-center gap-2"
                  >
                    <ShoppingBag size={18} />
                    <span className="font-inter font-semibold text-sm hidden sm:inline-block">Add</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="font-inter text-dark-text/60 text-lg">No products found in this category.</p>
          <button 
            onClick={() => setActiveFilter('All')}
            className="mt-4 text-teal-primary font-inter font-medium hover:underline"
          >
            Clear Filters
          </button>
        </div>
      )}
      <QuickViewModal 
        isOpen={!!quickViewProduct} 
        onClose={() => setQuickViewProduct(null)} 
        product={quickViewProduct}
        onAddToCart={onAddToCart}
        onOpenSizeGuide={onOpenSizeGuide}
      />
    </div>
  );
}
