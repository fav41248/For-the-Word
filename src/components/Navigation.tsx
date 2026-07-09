import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface NavigationProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  openLoginModal: () => void;
  cartItemCount: number;
  openCart: () => void;
  user: User | null;
  onLogout: () => void;
}

export function Navigation({ currentPage, setCurrentPage, openLoginModal, cartItemCount, openCart, user, onLogout }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'Collections' },
    { id: 'aigenerator', label: 'AI Generator' },
    { id: 'whyus', label: 'Why Us' }
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm border-b-sky-blue border-b' : 'bg-white/90 backdrop-blur-md border-b-sky-blue/50 border-b'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
              <img src="https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580279/LOGO-3_wmie0y.png" alt="FTW" className="h-16 object-contain" />
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => setCurrentPage(link.id)}
                  className={`font-inter font-medium text-sm transition-colors ${
                    currentPage === link.id ? 'text-teal-primary' : 'text-dark-text hover:text-teal-primary'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right Icons */}
            <div className="hidden md:flex items-center space-x-6">
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)} 
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-8 h-8 rounded-full bg-teal-primary text-white flex items-center justify-center font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {profileMenuOpen && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setProfileMenuOpen(false)}></div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-sky-blue/30 py-2 z-50 overflow-hidden"
                        >
                          <div className="px-4 py-2 border-b border-sky-blue/30 mb-1">
                            <p className="text-sm font-bold text-dark-text truncate">{user.name}</p>
                            <p className="text-xs text-dark-text/60 truncate">{user.email}</p>
                          </div>
                          <button 
                            onClick={() => { setCurrentPage(user.role === 'admin' ? 'admindashboard' : 'userdashboard'); setProfileMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm font-inter text-dark-text hover:bg-beige transition-colors"
                          >
                            My Dashboard
                          </button>
                          <button 
                            onClick={() => { setCurrentPage(user.role === 'admin' ? 'admindashboard' : 'userdashboard'); setProfileMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm font-inter text-dark-text hover:bg-beige transition-colors"
                          >
                            Settings
                          </button>
                          <div className="h-px bg-sky-blue/30 my-1"></div>
                          <button 
                            onClick={() => { onLogout(); setProfileMenuOpen(false); }}
                            className="w-full text-left px-4 py-2 text-sm font-inter text-red-600 hover:bg-red-50 transition-colors"
                          >
                            Logout
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <button onClick={openLoginModal} className="text-dark-text hover:text-teal-primary transition-colors flex items-center gap-2">
                  <UserIcon size={20} />
                  <span className="font-inter text-sm font-medium">Login</span>
                </button>
              )}
              <button onClick={openCart} className="text-dark-text hover:text-teal-primary transition-colors relative">
                <ShoppingBag size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-teal-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center space-x-4">
              <button onClick={openCart} className="text-dark-text relative">
                <ShoppingBag size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-teal-primary text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-dark-text hover:text-teal-primary p-2"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-20"
          >
            <div className="flex flex-col items-center justify-center h-full space-y-8 pb-20">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setCurrentPage(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`font-playfair text-3xl ${
                    currentPage === link.id ? 'text-teal-primary italic' : 'text-dark-text'
                  }`}
                >
                  {link.label}
                </button>
              ))}
              {user ? (
                <>
                  <button 
                    onClick={() => {
                      setCurrentPage(user.role === 'admin' ? 'admindashboard' : 'userdashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="font-playfair text-3xl text-dark-text mt-8 flex items-center gap-2"
                  >
                    My Dashboard
                  </button>
                  <button 
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="font-playfair text-3xl text-red-600 flex items-center gap-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => {
                    openLoginModal();
                    setMobileMenuOpen(false);
                  }}
                  className="font-playfair text-3xl text-dark-text mt-8 flex items-center gap-2"
                >
                  <UserIcon size={28} /> Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
