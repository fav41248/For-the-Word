import React, { useState, useEffect } from 'react';
import { ShoppingBag, Palette, Heart, Flame, Loader2, Trash2, Star, Anchor, Sun, Sparkles, Feather, Crown, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';

interface User {
  email: string;
  role: string;
  name: string;
}

interface UserDashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
  wishlist?: Set<string>;
  toggleWishlist?: (id: string) => void;
  onAddToCart?: (product: Product) => void;
}

const VERSE_REFERENCES = [
  "Jeremiah 29:11",
  "Philippians 4:13",
  "Psalm 23:1",
  "Proverbs 3:5",
  "Joshua 1:9",
  "Romans 8:28",
  "Isaiah 41:10"
];



export function UserDashboard({ user, onNavigate, wishlist = new Set(), toggleWishlist, onAddToCart }: UserDashboardProps) {
  const { orders, loading: ordersLoading } = useOrders(user?.email);
  const [activeTab, setActiveTab] = useState('orders');
  const [displayName, setDisplayName] = useState(user?.name || '');
  const [selectedAvatar, setSelectedAvatar] = useState(() => {
    return localStorage.getItem(`ftw_avatar_${user?.email}`) || 'Heart';
  });

  const ICONS: Record<string, React.ElementType> = {
    Heart, Flame, Star, Anchor, Sun, Sparkles, Feather, Crown, Shield
  };
  const { products } = useProducts();
  const savedProducts = products.filter(p => wishlist.has(p.id));
  const [todayVerse, setTodayVerse] = useState({ text: "Loading verse...", reference: "" });

  useEffect(() => {
    const fetchVerse = async () => {
      try {
        // Day-based seed
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const ref = VERSE_REFERENCES[dayOfYear % VERSE_REFERENCES.length];
        
        const response = await fetch(`https://bible-api.com/${encodeURIComponent(ref)}`);
        const data = await response.json();
        if (data.text && data.reference) {
          setTodayVerse({ text: data.text.trim(), reference: data.reference });
        }
      } catch (error) {
        setTodayVerse({ text: "For I know the plans I have for you, declares the Lord, plans for welfare and not for evil, to give you a future and a hope.", reference: "Jeremiah 29:11" });
      }
    };
    fetchVerse();
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        if (ordersLoading) {
          return <div className="flex justify-center items-center h-full py-16"><Loader2 className="w-8 h-8 text-teal-primary animate-spin" /></div>;
        }
        if (orders.length === 0) {
          return (
            <div>
              <h2 className="font-bebas text-2xl text-dark-text mb-6">My Orders</h2>
              <div className="overflow-x-auto">
                <div className="bg-white rounded-2xl border border-sky-blue/30 p-12 text-center shadow-sm">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-playfair text-xl text-dark-text mb-2">No orders found</h3>
                <p className="font-inter text-gray-500 mb-6">You haven't placed any orders yet.</p>
                <button 
                  onClick={() => onNavigate('collections')}
                  className="bg-teal-primary text-white font-inter font-medium px-6 py-3 rounded-xl hover:bg-dark-teal transition-colors"
                >
                  Start Shopping
                </button>
              </div>
              </div>
            </div>
          );
        }
        return (
          <div>
            <h2 className="font-bebas text-2xl text-dark-text mb-6">My Orders</h2>
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="border border-sky-blue rounded-xl p-6 bg-gray-50/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-inter font-semibold uppercase ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mb-4 pb-4 border-b border-sky-blue/30">
                    <p className="font-inter text-xs text-dark-text/50 uppercase tracking-wider mb-1">Order #{order.id.toUpperCase()}</p>
                    <p className="font-inter text-sm font-medium text-dark-text">{new Date(order.created_at).toLocaleDateString()}</p>
                    {order.reference && <p className="font-inter text-xs text-dark-text/50 mt-1">Ref: {order.reference}</p>}
                  </div>
                  
                  {/* Progress Tracker */}
                  <div className="mb-6 py-4 px-2">
                    <div className="relative">
                      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-full h-1 bg-gray-200 rounded-full"></div>
                      <div className={`absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-teal-primary rounded-full transition-all duration-500 ${
                        order.status === 'pending' ? 'w-[10%]' :
                        order.status === 'processing' ? 'w-[40%]' :
                        order.status === 'shipped' ? 'w-[70%]' :
                        'w-[100%]'
                      }`}></div>
                      
                      <div className="relative flex justify-between">
                        {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                          const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
                          const currentStatusIdx = statusOrder.indexOf(order.status);
                          const isActive = idx <= currentStatusIdx;
                          return (
                            <div key={step} className="flex flex-col items-center">
                              <div className={`w-4 h-4 rounded-full border-2 bg-white transition-colors duration-300 relative z-10 ${
                                isActive ? 'border-teal-primary ring-2 ring-teal-primary/20' : 'border-gray-300'
                              }`}>
                                {isActive && <div className="absolute inset-0.5 bg-teal-primary rounded-full"></div>}
                              </div>
                              <span className={`text-xs mt-2 font-medium ${isActive ? 'text-teal-primary' : 'text-gray-400'}`}>{step}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-contain bg-sky-blue/20 rounded-lg p-2" />
                        <div>
                          <p className="font-inter font-bold text-dark-text text-sm">{item.product.name}</p>
                          <p className="font-inter text-dark-text/60 text-xs">Qty: {item.quantity} {item.size && `• Size: ${item.size}`}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 border-t border-sky-blue/30 flex justify-between items-center">
                    <span className="font-inter font-medium text-dark-text">Total</span>
                    <span className="font-bebas text-xl text-teal-primary">₦{(order.total || 0).toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'designs':
        return (
          <div>
            <h2 className="font-bebas text-2xl text-dark-text mb-6">My Designs</h2>
            <div className="bg-white rounded-2xl border border-sky-blue/30 p-12 text-center shadow-sm">
              <Palette className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-playfair text-xl text-dark-text mb-2">No generated designs yet</h3>
              <p className="font-inter text-gray-500 mb-6">Start designing your own custom apparel.</p>
              <button 
                onClick={() => onNavigate('aigenerator')}
                className="bg-teal-primary text-white font-inter font-medium px-6 py-3 rounded-xl hover:bg-dark-teal transition-colors"
              >
                Go to AI Generator
              </button>
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div>
            <h2 className="font-bebas text-2xl text-dark-text mb-6">Wishlist</h2>
            {savedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-sky-blue/30 p-12 text-center">
                <Heart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="font-playfair text-xl text-dark-text mb-2">Your wishlist is empty</h3>
                <p className="font-inter text-gray-500 mb-6">Save items you love to find them later.</p>
                <button 
                  onClick={() => onNavigate('collections')}
                  className="bg-teal-primary text-white font-inter font-medium px-6 py-3 rounded-xl hover:bg-dark-teal transition-colors"
                >
                  Explore Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {savedProducts.map((product) => (
                  <div key={product.id} className="flex bg-white border border-sky-blue/30 rounded-xl overflow-hidden p-4 items-center gap-4 hover:border-teal-primary transition-colors">
                    <div className="w-20 h-24 bg-gray-100 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bebas text-gray-400 text-xs">{product.volume}</span>
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-inter font-bold text-dark-text text-sm line-clamp-1">{product.name}</h3>
                      <p className="font-inter italic text-teal-primary text-xs mt-1 mb-2 line-clamp-1">{product.scripture}</p>
                      <p className="font-bebas text-lg">{product.priceDisplay}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => onAddToCart?.(product)}
                        className="p-2 text-teal-primary hover:bg-teal-primary/10 rounded-full transition-colors"
                        title="Add to Cart"
                      >
                        <ShoppingBag size={20} />
                      </button>
                      <button 
                        onClick={() => toggleWishlist?.(product.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-full transition-colors"
                        title="Remove from Wishlist"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'profile':
        return (
          <div className="max-w-2xl">
            <h2 className="font-bebas text-2xl text-dark-text mb-6">Profile Settings</h2>
            <form className="space-y-6" onSubmit={(e) => {
              e.preventDefault();
              localStorage.setItem(`ftw_avatar_${user?.email}`, selectedAvatar);
              // Also update user's name in localStorage if needed (mocked)
              if (displayName) {
                const stored = localStorage.getItem('ftw_user');
                if (stored) {
                  try {
                    const parsed = JSON.parse(stored);
                    parsed.name = displayName;
                    localStorage.setItem('ftw_user', JSON.stringify(parsed));
                  } catch (err) {}
                }
              }
              toast.success('Profile updated successfully!');
            }}>
              <div className="space-y-6">
                <div>
                  <label className="block font-inter text-sm font-medium text-dark-text mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={displayName} 
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-sky-blue focus:border-teal-primary focus:ring-1 focus:ring-teal-primary outline-none font-inter" 
                  />
                </div>
                
                <div>
                  <label className="block font-inter text-sm font-medium text-dark-text mb-2">Select Faith Avatar</label>
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                    {Object.entries(ICONS).map(([name, Icon]) => (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setSelectedAvatar(name)}
                        className={`aspect-square flex items-center justify-center rounded-xl border-2 transition-all ${
                          selectedAvatar === name 
                            ? 'border-teal-primary bg-teal-primary/10 text-teal-primary' 
                            : 'border-sky-blue/30 bg-white text-dark-text/40 hover:border-teal-primary/50 hover:text-teal-primary'
                        }`}
                      >
                        <Icon size={24} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div>
                    <label className="block font-inter text-sm font-medium text-dark-text mb-2">Email Address</label>
                    <input type="email" defaultValue={user?.email || ''} className="w-full px-4 py-3 rounded-lg border border-sky-blue bg-gray-50 outline-none font-inter text-dark-text/70" disabled />
                  </div>
                  <div>
                    <label className="block font-inter text-sm font-medium text-dark-text mb-2">Country</label>
                    <select className="w-full px-4 py-3 rounded-lg border border-sky-blue focus:border-teal-primary focus:ring-1 focus:ring-teal-primary outline-none font-inter bg-white">
                      <option>Nigeria</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>Ghana</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-sky-blue/30">
                <h3 className="font-inter font-bold text-dark-text mb-4">Notification Preferences</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-sky-blue text-teal-primary focus:ring-teal-primary accent-teal-primary" />
                    <span className="font-inter text-sm text-dark-text">New Collection Drops</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-sky-blue text-teal-primary focus:ring-teal-primary accent-teal-primary" />
                    <span className="font-inter text-sm text-dark-text">Order Updates & Shipping</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded border-sky-blue text-teal-primary focus:ring-teal-primary accent-teal-primary" />
                    <span className="font-inter text-sm text-dark-text">Community Newsletter</span>
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button type="submit" className="bg-teal-primary text-white font-inter font-medium py-3 px-6 rounded-lg hover:bg-dark-teal transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-playfair text-4xl md:text-5xl text-dark-text mb-2 flex items-center gap-4">
              Welcome back, {displayName || user?.name || 'Believer'}
              {(() => {
                const IconComponent = ICONS[selectedAvatar];
                return IconComponent ? <span className="bg-teal-primary/10 text-teal-primary p-2 rounded-full"><IconComponent size={28} /></span> : null;
              })()}
            </h1>
            <p className="font-inter text-dark-text/70 text-lg">Keep wearing the Word.</p>
          </div>
          <button 
            onClick={() => onNavigate('collections')}
            className="shrink-0 bg-teal-primary text-white font-inter font-semibold py-3 px-6 rounded-xl hover:bg-dark-teal transition-colors flex items-center gap-2"
          >
            <ShoppingBag size={20} />
            Shop Collections
          </button>
        </div>
        
        <div className="bg-teal-primary text-white p-6 md:p-8 rounded-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
             <img src="https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580279/LOGO-3_wmie0y.png" alt="FTW" className="h-48 object-contain brightness-0 invert" />
          </div>
          <div className="relative z-10">
            <span className="font-bebas tracking-widest text-sky-blue text-sm mb-2 block">VERSE OF THE DAY</span>
            <p className="font-playfair text-2xl md:text-3xl italic mb-2">"{todayVerse.text}"</p>
            <p className="font-inter font-medium text-white/80">— {todayVerse.reference}</p>
          </div>
          <button className="relative z-10 shrink-0 bg-white text-teal-primary font-inter font-semibold py-3 px-6 rounded-xl hover:bg-sky-blue transition-colors">
            Read Full Chapter
          </button>
        </div>
      </div>

      {/* Dashboard Grid (Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl border border-sky-blue shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-primary/10 text-teal-primary flex items-center justify-center shrink-0">
            <ShoppingBag size={24} />
          </div>
          <div>
            <p className="font-bebas text-3xl text-dark-text leading-none mb-1">{orders.length}</p>
            <p className="font-inter text-sm text-dark-text/70">Orders placed</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-sky-blue shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-primary/10 text-teal-primary flex items-center justify-center shrink-0">
            <Palette size={24} />
          </div>
          <div>
            <p className="font-bebas text-3xl text-dark-text leading-none mb-1">0</p>
            <p className="font-inter text-sm text-dark-text/70">Designs created</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-sky-blue shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-primary/10 text-teal-primary flex items-center justify-center shrink-0">
            <Heart size={24} />
          </div>
          <div>
            <p className="font-bebas text-3xl text-dark-text leading-none mb-1">{savedProducts.length}</p>
            <p className="font-inter text-sm text-dark-text/70">Saved items</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-sky-blue shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-primary/10 text-teal-primary flex items-center justify-center shrink-0">
            <Flame size={24} />
          </div>
          <div>
            <p className="font-bebas text-3xl text-dark-text leading-none mb-1">1</p>
            <p className="font-inter text-sm text-dark-text/70">Day scripture streak</p>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1">
          <nav className="space-y-2 sticky top-24">
            {[
              { id: 'orders', label: 'My Orders' },
              { id: 'designs', label: 'My Designs' },
              { id: 'wishlist', label: 'Wishlist' },
              { id: 'profile', label: 'Profile Settings' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-4 py-3 rounded-lg font-inter font-medium transition-colors ${
                  activeTab === tab.id 
                    ? 'bg-teal-primary text-white' 
                    : 'text-dark-text/70 hover:bg-white hover:text-teal-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="col-span-1 md:col-span-3 bg-white p-6 md:p-8 rounded-2xl border border-sky-blue shadow-sm min-h-[500px]">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
