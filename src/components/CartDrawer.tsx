import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useOrders } from '../hooks/useOrders';
import { toast } from 'react-hot-toast';
import { CartItem, User } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  updateQuantity: (productId: string, delta: number) => void;
  removeItem: (productId: string) => void;
  onNavigate?: (page: string) => void;
  user?: User | null;
  onLoginRequest?: () => void;
  emptyCart?: () => void;
}

export function CartDrawer({ isOpen, onClose, cartItems, updateQuantity, removeItem, onNavigate, user, onLoginRequest, emptyCart }: CartDrawerProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  
  const config = {
    reference: (new Date()).getTime().toString(),
    email: user?.email || '',
    amount: subtotal * 100, // Amount is in the country's lowest currency. E.g Kobo, so 20000 kobo = N200
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    toast.success('Payment successful!');
    if (emptyCart) emptyCart();
    
    // Navigate to user dashboard
    if (onNavigate) {
      onNavigate('userdashboard');
    }
  };

  const onClosePayment = () => {
    console.log('Payment modal closed');
  };

  const handleCheckout = () => {
    if (!user) {
      toast('Please log in to checkout', { icon: '🔒' });
      if (onLoginRequest) onLoginRequest();
      return;
    }
    initializePayment({onSuccess, onClose: onClosePayment});
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex justify-end">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-dark-text/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col z-[61]"
          >
            <div className="flex items-center justify-between p-6 border-b border-sky-blue/30">
              <h2 className="font-playfair text-2xl font-bold text-dark-text flex items-center gap-2">
                <ShoppingBag size={24} /> Your Cart
              </h2>
              <button onClick={onClose} className="text-dark-text/50 hover:text-dark-text p-2">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-beige rounded-full flex items-center justify-center text-teal-primary/30">
                    <ShoppingBag size={40} />
                  </div>
                  <p className="font-inter text-dark-text/60">Your cart is currently empty.</p>
                  <button 
                    onClick={() => onNavigate ? onNavigate('collections') : onClose()}
                    className="font-inter font-medium text-teal-primary hover:underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <AnimatePresence initial={false}>
                    {cartItems.map((item) => (
                      <motion.div 
                        key={item.product.id} 
                        initial={{ opacity: 0, x: 30, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        className="flex gap-4"
                      >
                        <div 
                          className="w-20 h-24 rounded-lg flex flex-col items-center justify-center text-white p-2"
                          style={{ backgroundColor: item.product.color }}
                        >
                          <span className="font-bebas text-xs text-center leading-none">{item.product.volume}</span>
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="font-inter font-bold text-dark-text text-sm">{item.product.name}</h3>
                              <button onClick={() => removeItem(item.product.id)} className="text-dark-text/40 hover:text-dark-text">
                                <X size={16} />
                              </button>
                            </div>
                            <p className="font-inter text-xs italic text-teal-primary mt-1">{item.product.scripture}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-sky-blue rounded-md">
                              <button onClick={() => updateQuantity(item.product.id, -1)} className="p-1 text-dark-text hover:bg-beige transition-colors">
                                <Minus size={14} />
                              </button>
                              <span className="font-inter text-sm w-8 text-center">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.product.id, 1)} className="p-1 text-dark-text hover:bg-beige transition-colors">
                                <Plus size={14} />
                              </button>
                            </div>
                            <p className="font-bebas text-lg">₦{(item.product.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-sky-blue/30 p-6 bg-beige/30">
                <div className="flex justify-between items-center mb-6">
                  <span className="font-inter font-medium text-dark-text">Subtotal</span>
                  <span className="font-bebas text-2xl">₦{subtotal.toLocaleString()}</span>
                </div>
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-teal-primary text-white font-inter font-bold py-4 rounded-xl hover:bg-dark-teal transition-colors"
                >
                  Checkout
                </button>
                <div className="text-center mt-4">
                  <button 
                    onClick={() => onNavigate ? onNavigate('collections') : onClose()} 
                    className="font-inter text-sm text-dark-text/60 hover:text-dark-text underline"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
