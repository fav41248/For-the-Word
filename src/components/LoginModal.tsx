import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'react-hot-toast';

interface User {
  email: string;
  role: string;
  name: string;
}

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for auth state changes (e.g. after Google login redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user && isOpen) {
        const userData: User = { 
          email: session.user.email || '', 
          role: 'user', 
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'Believer' 
        };
        localStorage.setItem('ftw_user', JSON.stringify(userData));
        onLoginSuccess(userData);
        resetForm();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isOpen, onLoginSuccess]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      if (isLogin) {
        // Special case for admin login
        if (email === 'admin@ftw.com' && password === 'admin123') {
          const userData = { email, role: 'admin', name: 'FTW Admin' };
          localStorage.setItem('ftw_user', JSON.stringify(userData));
          onLoginSuccess(userData);
          resetForm();
          return;
        }

        if (!isSupabaseConfigured) {
          const userData: User = { 
            email: email, 
            role: 'user', 
            name: 'Believer' 
          };
          localStorage.setItem('ftw_user', JSON.stringify(userData));
          onLoginSuccess(userData);
          resetForm();
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          const userData: User = { 
            email: data.user.email || '', 
            role: 'user', 
            name: data.user.user_metadata?.name || 'Believer' 
          };
          localStorage.setItem('ftw_user', JSON.stringify(userData));
          onLoginSuccess(userData);
          resetForm();
        }
      } else {
        if (!name || !email || !password) {
          throw new Error("Please fill in all fields.");
        }

        if (!isSupabaseConfigured) {
          toast.success('Account created successfully! (Mocked)');
          const userData: User = { 
            email: email, 
            role: 'user', 
            name: name
          };
          localStorage.setItem('ftw_user', JSON.stringify(userData));
          onLoginSuccess(userData);
          resetForm();
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name: name,
            }
          }
        });

        if (error) throw error;
        
        toast.success('Account created successfully! Please check your email to verify (if enabled) or log in directly.');
        
        if (data.user && data.session) {
          const userData: User = { 
            email: data.user.email || '', 
            role: 'user', 
            name: name
          };
          localStorage.setItem('ftw_user', JSON.stringify(userData));
          onLoginSuccess(userData);
          resetForm();
        } else {
          // If no session is returned, they might need to verify their email
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      if (!isSupabaseConfigured) {
        // Mock successful Google login when Supabase is not configured
        const userData: User = { 
          email: 'googleuser@example.com', 
          role: 'user', 
          name: 'Google User' 
        };
        localStorage.setItem('ftw_user', JSON.stringify(userData));
        onLoginSuccess(userData);
        resetForm();
        return;
      }
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (err: any) {
      const errorMsg = err.message || err.msg || (typeof err === 'string' ? err : JSON.stringify(err)) || "";
      if (errorMsg.includes('provider is not enabled') || errorMsg.includes('Unsupported provider')) {
        toast('Google login is not enabled in your Supabase project. Using a mock login for preview.', { icon: '⚠️' });
        const userData: User = { 
          email: 'googleuser@example.com', 
          role: 'user', 
          name: 'Google User' 
        };
        localStorage.setItem('ftw_user', JSON.stringify(userData));
        onLoginSuccess(userData);
        resetForm();
      } else {
        setError(typeof err === 'string' ? err : (err.message || err.msg || "Could not authenticate with Google."));
      }
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setIsLogin(true);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-dark-text/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 overflow-y-auto max-h-[90vh] z-10"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-dark-text/50 hover:text-dark-text transition-colors"
            >
              <X size={24} />
            </button>
            
            <div className="text-center mb-8">
              <img src="/logo.png" alt="FTW" className="h-16 mx-auto mb-3 object-contain" />
              <h2 className="font-playfair text-3xl font-bold text-dark-text">
                {isLogin ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="font-inter text-sm text-dark-text/60 mt-2">
                {isLogin ? 'Sign in to access your dashboard and designs.' : 'Join us and start wearing the Word.'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm font-inter text-center">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleAuth}>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block font-inter text-sm font-medium text-dark-text mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-sky-blue focus:border-teal-primary focus:ring-1 focus:ring-teal-primary outline-none transition-all font-inter"
                    placeholder="Grace Osei"
                    required={!isLogin}
                  />
                </motion.div>
              )}
              <div>
                <label className="block font-inter text-sm font-medium text-dark-text mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-sky-blue focus:border-teal-primary focus:ring-1 focus:ring-teal-primary outline-none transition-all font-inter"
                  placeholder="hello@fortheword.com"
                  required
                />
              </div>
              <div>
                <label className="block font-inter text-sm font-medium text-dark-text mb-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-sky-blue focus:border-teal-primary focus:ring-1 focus:ring-teal-primary outline-none transition-all font-inter pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-text/50 hover:text-dark-text"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-sky-blue text-teal-primary focus:ring-teal-primary cursor-pointer accent-teal-primary" />
                  <span className="font-inter text-sm text-dark-text/70 group-hover:text-dark-text transition-colors">Remember me</span>
                </label>
                {isLogin && (
                  <button type="button" className="font-inter text-sm text-teal-primary hover:underline">
                    Forgot password?
                  </button>
                )}
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-teal-primary text-white font-inter font-bold py-3.5 rounded-lg hover:bg-dark-teal transition-colors mt-2 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {isLogin ? 'Login' : 'Create Account'}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-sky-blue flex-1"></div>
              <span className="font-inter text-xs text-dark-text/50 uppercase tracking-wider">or</span>
              <div className="h-px bg-sky-blue flex-1"></div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="w-full bg-white border border-gray-300 text-dark-text font-inter font-medium py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <p className="mt-8 text-center font-inter text-sm text-dark-text/70">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button 
                className="text-teal-primary font-medium hover:underline"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

