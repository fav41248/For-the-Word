import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Product } from '../types';
import { PRODUCTS as STATIC_PRODUCTS } from '../pages/CollectionsPage';

const LOCAL_STORAGE_KEY = 'ftw_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setProducts(JSON.parse(saved));
      } else {
        setProducts(STATIC_PRODUCTS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(STATIC_PRODUCTS));
      }
      setLoading(false);
      return;
    }
    
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase products fetch failed, using local fallback:', error.message);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        setProducts(saved ? JSON.parse(saved) : STATIC_PRODUCTS);
        return;
      }
      if (data && data.length > 0) {
        const mappedProducts = data.map(p => ({
          id: p.id,
          name: p.name,
          scripture: p.scripture || p.volume || '',
          price: p.price,
          priceDisplay: p.price_display || `₦${(p.price || 0).toLocaleString()}`,
          category: p.category || '',
          volume: p.volume || '',
          color: p.color || '#1A1A2E',
          isNew: p.is_new,
          image: p.image
        }));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.warn('Error fetching products from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    const newId = Math.random().toString(36).substring(2, 9);
    const newProduct = { ...product, id: newId };
    
    if (!isSupabaseConfigured) {
      const updated = [newProduct, ...products];
      setProducts(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return newProduct;
    }
    
    try {
      // Supabase implementation... assuming a simple insert works. For robust it needs mapping.
      const { data, error } = await supabase.from('products').insert({
        name: newProduct.name,
        price: newProduct.price,
        price_display: newProduct.priceDisplay,
        category: newProduct.category,
        volume: newProduct.volume,
        image: newProduct.image,
        scripture: newProduct.scripture,
        is_new: newProduct.isNew
      }).select().single();
      
      if (!error && data) {
        fetchProducts();
      }
    } catch (e) {}
    
    return newProduct;
  };

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    if (!isSupabaseConfigured) {
      const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
      setProducts(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return;
    }
    
    // Supabase implementaton...
    try {
      await supabase.from('products').update({
        name: updates.name,
        price: updates.price,
        price_display: updates.priceDisplay,
        category: updates.category,
        volume: updates.volume,
        image: updates.image,
        scripture: updates.scripture,
        is_new: updates.isNew
      }).eq('id', id);
      fetchProducts();
    } catch (e) {}
  };

  const deleteProduct = async (id: string) => {
    if (!isSupabaseConfigured) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      return;
    }
    
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchProducts();
    } catch (e) {}
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return { products, loading, refetch: fetchProducts, addProduct, updateProduct, deleteProduct };
}
