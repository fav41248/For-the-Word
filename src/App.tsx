/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from './lib/supabase';
import { Toaster, toast } from 'react-hot-toast';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { LoginModal } from './components/LoginModal';
import { ResetPasswordModal } from './components/ResetPasswordModal';
import { CartDrawer } from './components/CartDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { AIGeneratorPage } from './pages/AIGeneratorPage';
import { WhyChooseUsPage } from './pages/WhyChooseUsPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { ShoppingBag } from 'lucide-react';
import { CartItem, Product, User } from './types';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`ftw_wishlist_${currentUser.email}`);
      if (saved) setWishlist(new Set(JSON.parse(saved)));
    }
  }, [currentUser?.email]);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const userData: User = { 
          email: session.user.email || '', 
          role: ['admin@ftw.com', 'ayojire1@gmail.com'].includes(session.user.email || '') ? 'admin' : 'user', 
          name: session.user.user_metadata?.name || 'Believer' 
        };
        setCurrentUser(userData);
      }
    });

    // Listen for auth changes (e.g. login, logout, oauth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsResetPasswordModalOpen(true);
      }
      
      if (session?.user) {
        const isAdmin = ['admin@ftw.com', 'ayojire1@gmail.com'].includes(session.user.email || '');
        const userData: User = { 
          email: session.user.email || '', 
          role: isAdmin ? 'admin' : 'user', 
          name: session.user.user_metadata?.name || 'Believer' 
        };
        setCurrentUser(userData);
        // Optionally navigate to dashboard on login
        if (event === 'SIGNED_IN') {
           setCurrentPage(isAdmin ? 'admindashboard' : 'userdashboard');
        }
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  const [wishlist, setWishlist] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('ftw_wishlist');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const toggleWishlist = (id: string) => {
    if (!currentUser) {
      toast.error('Please login to save to wishlist');
      setIsLoginModalOpen(true);
      return;
    }
    setWishlist(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      localStorage.setItem(`ftw_wishlist_${currentUser.email}`, JSON.stringify(Array.from(next)));
      return next;
    });
  };

  const addToCart = (product: Product, size: string = "M") => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id && item.size === size);
      if (existing) {
        return prev.map(item => (item.product.id === product.id && item.size === size) ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { product, quantity: 1, size }];
    });
    toast.success('Item added to cart');
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.product.id === productId) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    toast('Item removed from cart', { icon: '🗑️' });
  };

  const emptyCart = () => setCartItems([]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={setCurrentPage} onAddToCart={addToCart} onOpenSizeGuide={() => setIsSizeGuideOpen(true)} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'collections':
        return <CollectionsPage onAddToCart={addToCart} onOpenSizeGuide={() => setIsSizeGuideOpen(true)} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
      case 'aigenerator':
        return <AIGeneratorPage />;
      case 'whyus':
        return <WhyChooseUsPage />;
      case 'userdashboard':
        if (!currentUser) {
          setTimeout(() => {
             setCurrentPage('home');
             setIsLoginModalOpen(true);
          }, 0);
          return null;
        }
        return <UserDashboard user={currentUser} onNavigate={setCurrentPage} wishlist={wishlist} toggleWishlist={toggleWishlist} onAddToCart={addToCart} />;
      case 'admindashboard':
        if (currentUser?.role !== 'admin') {
          setTimeout(() => {
             setCurrentPage('home');
             if (!currentUser) setIsLoginModalOpen(true);
          }, 0);
          return null;
        }
        return <AdminDashboard user={currentUser} onLogout={async () => { 
          if (isSupabaseConfigured) await supabase.auth.signOut();
          setCurrentUser(null); 
          setCurrentPage('home'); 
          localStorage.removeItem('ftw_user');
          localStorage.removeItem('ftw_wishlist');
          localStorage.removeItem('ftw_avatar');
          setWishlist(new Set());
        }} />;
      default:
        return <HomePage onNavigate={setCurrentPage} onAddToCart={addToCart} onOpenSizeGuide={() => setIsSizeGuideOpen(true)} wishlist={wishlist} toggleWishlist={toggleWishlist} />;
    }
  };

  const handleLoginSuccess = (user: User) => {
    setIsLoginModalOpen(false);
    setCurrentUser(user);
    setCurrentPage(user.role === 'admin' ? 'admindashboard' : 'userdashboard');
    toast.success('Successfully logged in');
  };

  const isAdmin = currentPage === 'admindashboard';

  return (
    <div className={`min-h-screen ${isAdmin ? 'bg-gray-50' : 'bg-beige'} flex flex-col`}>
      {!isAdmin && (
        <Navigation 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          openLoginModal={() => setIsLoginModalOpen(true)}
          cartItemCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
          openCart={() => setIsCartOpen(true)}
          user={currentUser}
          onLogout={async () => {
            if (isSupabaseConfigured) {
              await supabase.auth.signOut();
            }
            setCurrentUser(null);
            setCurrentPage('home');
            localStorage.removeItem('ftw_user');
            localStorage.removeItem('ftw_wishlist');
            localStorage.removeItem('ftw_avatar');
            setWishlist(new Set());
            toast.success('Logged out successfully');
          }}
        />
      )}
      
      <main className="flex-grow flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex flex-col"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAdmin && <Footer />}

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      
      <ResetPasswordModal 
        isOpen={isResetPasswordModalOpen} 
        onClose={() => setIsResetPasswordModalOpen(false)}
        onSuccess={() => {
          setIsResetPasswordModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
      
      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        updateQuantity={updateQuantity}
        removeItem={removeItem}
        emptyCart={emptyCart}
        user={currentUser}
        onLoginRequest={() => {
          setIsCartOpen(false);
          setIsLoginModalOpen(true);
        }}
        onNavigate={(page) => {
          setCurrentPage(page);
          setIsCartOpen(false);
        }}
      />

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />


      {/* Floating CTA */}
      {!isAdmin && currentPage !== 'collections' && (
        <button
          onClick={() => setCurrentPage('collections')}
          className="fixed bottom-6 right-6 z-40 bg-teal-primary text-white p-4 rounded-full shadow-2xl hover:bg-dark-teal transition-all hover:scale-105 flex items-center justify-center group"
          title="Shop Collections"
        >
          <span className="font-inter font-semibold max-w-0 overflow-hidden group-hover:max-w-xs group-hover:mr-2 transition-all duration-300 whitespace-nowrap">Shop Collection</span>
          <ShoppingBag size={24} />
        </button>
      )}

      <Toaster 
        position="bottom-center" 
        toastOptions={{
          style: {
            background: '#1A1A2E',
            color: '#fff',
            borderRadius: '12px',
          },
        }} 
      />
    </div>
  );
}
