import React from 'react';
import { Instagram, Facebook, Twitter, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-white/60 py-16 border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <img src="https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580279/LOGO-3_wmie0y.png" alt="FTW" className="h-12 object-contain brightness-0 invert" />
            </div>
            <p className="font-inter text-sm leading-relaxed max-w-xs">
              Faith-driven apparel for a generation that carries the Word everywhere. Every shirt is a sermon.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-teal-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-teal-primary transition-colors" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-teal-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white/60 hover:text-teal-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bebas text-white text-xl tracking-wider mb-6">Shop</h4>
            <ul className="space-y-4 font-inter text-sm">
              <li><a href="#" className="hover:text-teal-primary transition-colors">All Collections</a></li>
              <li><a href="#" className="hover:text-teal-primary transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-teal-primary transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-teal-primary transition-colors">AI Custom Design</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bebas text-white text-xl tracking-wider mb-6">Support</h4>
            <ul className="space-y-4 font-inter text-sm">
              <li><a href="#" className="hover:text-teal-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-teal-primary transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-teal-primary transition-colors">Size Guide</a></li>
              <li><a href="#" className="hover:text-teal-primary transition-colors">Track Order</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bebas text-white text-xl tracking-wider mb-6">Contact Us</h4>
            <ul className="space-y-4 font-inter text-sm">
              <li className="flex items-start gap-3">
                <Mail size={18} className="shrink-0 mt-0.5" />
                <a href="mailto:hello@fortheword.com" className="hover:text-teal-primary transition-colors">hello@fortheword.com</a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="shrink-0 mt-0.5" />
                <span>123 Faith Avenue<br />Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 font-inter text-sm">
          <p>© {new Date().getFullYear()} For The Word. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
