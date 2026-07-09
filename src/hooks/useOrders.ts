import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Order } from '../types';

const LOCAL_STORAGE_KEY = 'ftw_orders';

export function useOrders(userEmail?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      let parsedOrders: Order[] = saved ? JSON.parse(saved) : [];
      if (userEmail) {
        parsedOrders = parsedOrders.filter(o => o.user_email === userEmail);
      }
      setOrders(parsedOrders.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()));
      setLoading(false);
      return;
    }

    try {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (userEmail) {
        query = query.eq('user_email', userEmail);
      }
      const { data, error } = await query;
      
      if (error) {
        console.warn('Supabase orders fetch failed, using local fallback:', error.message);
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        let parsedOrders: Order[] = saved ? JSON.parse(saved) : [];
        if (userEmail) {
            parsedOrders = parsedOrders.filter(o => o.user_email === userEmail);
        }
        setOrders(parsedOrders);
        return;
      }
      
      if (data) {
        setOrders(data as Order[]);
      }
    } catch (error) {
      console.warn('Error fetching orders from Supabase:', error);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Omit<Order, 'id' | 'created_at'>) => {
    const newOrder: Order = {
      ...orderData,
      id: Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    };

    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const allOrders = saved ? JSON.parse(saved) : [];
      const updated = [newOrder, ...allOrders];
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      fetchOrders();
      return newOrder;
    }

    try {
      const { data, error } = await supabase.from('orders').insert({
        id: newOrder.id,
        user_email: newOrder.user_email,
        items: newOrder.items,
        total: newOrder.total,
        status: newOrder.status,
        reference: newOrder.reference
      }).select().single();
      
      if (!error && data) {
        fetchOrders();
        return data as Order;
      }
    } catch (e) {
        console.warn('Error creating order:', e);
    }

    // fallback if supabase failed
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const allOrders = saved ? JSON.parse(saved) : [];
    const updated = [newOrder, ...allOrders];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    fetchOrders();
    return newOrder;
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      const allOrders: Order[] = saved ? JSON.parse(saved) : [];
      const updated = allOrders.map(o => o.id === id ? { ...o, status } : o);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      fetchOrders();
      return;
    }

    try {
      await supabase.from('orders').update({ status }).eq('id', id);
      fetchOrders();
    } catch (e) {}
  };

  useEffect(() => {
    fetchOrders();

    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userEmail]);

  return { orders, loading, fetchOrders, createOrder, updateOrderStatus };
}
