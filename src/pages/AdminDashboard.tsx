import React, { useState, useEffect, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { 
  LayoutDashboard, ShoppingBag, Package, Users, Layers, 
  Sparkles, Settings, LogOut, Plus, Search, Filter, MoreVertical, X, Upload, Trash2 
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { User, Product } from '../types';
import { useProducts } from '../hooks/useProducts';
import { useOrders } from '../hooks/useOrders';

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const ORDER_STATUS_DATA = [
  { name: 'Pending', value: 25 },
  { name: 'Processing', value: 18 },
  { name: 'Shipped', value: 45 },
  { name: 'Delivered', value: 54 },
];
const STATUS_COLORS = ['#FBBF24', '#A78BFA', '#60A5FA', '#34D399'];

export function AdminDashboard({ user, onLogout }: AdminDashboardProps) {
  const { orders, loading: ordersLoading, updateOrderStatus } = useOrders();
  const isEditMode = false;
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<any[]>([
    { id: 1, name: 'Isaiah 55:11 Tee', collection: 'Volume I', category: 'T-Shirts', price: '₦15,000', stock: 45, status: 'Active' },
    { id: 2, name: 'Hebrews 4:12 Hoodie', collection: 'Volume II', category: 'Hoodies', price: '₦28,000', stock: 12, status: 'Low Stock' },
    { id: 3, name: 'Romans 12:2 Cap', collection: 'Volume III', category: 'Accessories', price: '₦10,000', stock: 0, status: 'Out of Stock' },
  ]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', collection: 'Volume I', category: 'T-Shirts', price: '', stock: '', status: 'Active', image: '', scripture: '', isNew: false
  });

  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    aiDesigns: 0
  });

  const fetchProducts = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (error) {
        console.warn('Supabase products fetch failed:', error.message);
        return;
      }
      if (data && data.length > 0) {
        setProducts(data.map(p => ({
          id: p.id,
          name: p.name,
          collection: p.volume || 'Volume I',
          category: p.category || 'T-Shirts',
          price: p.price_display || `₦${(p.price || 0).toLocaleString()}`,
          stock: p.stock !== undefined ? p.stock : 10,
          status: p.status || 'Active',
          image: p.image || ''
        })));
      }
    } catch (err) {
      console.warn('Error fetching products:', err);
    }
  };

  const fetchStats = async () => {
    if (!isSupabaseConfigured) return;
    try {
      // Try fetching profiles count
      const { count: usersCount, error: usersErr } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      
      // Try fetching orders and calculating revenue
      const { data: ordersData, error: ordersErr } = await supabase.from('orders').select('total_amount');
      const revenue = ordersData?.reduce((sum, order) => sum + (Number(order.total_amount) || 0), 0) || 0;
      const ordersCount = ordersData?.length || 0;

      // Try fetching AI designs
      const { count: aiCount, error: aiErr } = await supabase.from('ai_designs').select('*', { count: 'exact', head: true });

      setStats({
        revenue: ordersErr ? 2450000 : revenue,
        orders: ordersErr ? 142 : ordersCount,
        users: usersErr ? 389 : (usersCount || 0),
        aiDesigns: aiErr ? 1247 : (aiCount || 0)
      });
    } catch (err) {
      console.warn('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);

  const handleDeleteProduct = async (id: any) => {
    setProducts(products.filter(p => p.id !== id));
    if (!isSupabaseConfigured) return;
    try {
      await supabase.from('products').delete().eq('id', id);
    } catch (err) {
      console.warn('Error deleting product:', err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const status = parseInt(newProduct.stock) > 15 ? 'Active' : parseInt(newProduct.stock) > 0 ? 'Low Stock' : 'Out of Stock';
    const tempId = Date.now().toString();
    setProducts([
      { ...newProduct, id: tempId, status },
      ...products
    ]);
    setIsAddProductModalOpen(false);
    
    if (!isSupabaseConfigured) {
      setNewProduct({ name: '', collection: 'Volume I', category: 'T-Shirts', price: '', stock: '', status: 'Active', image: '' });
      return;
    }

    try {
      const priceNum = parseInt(newProduct.price.replace(/\D/g, '')) || 0;
      await supabase.from('products').insert({
        name: newProduct.name,
        category: newProduct.category,
        volume: newProduct.collection,
        price: priceNum,
        price_display: newProduct.price,
        stock: parseInt(newProduct.stock) || 0,
        status: status,
        image: newProduct.image || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop'
      });
      fetchProducts(); // Refresh to get proper UUID
    } catch (err) {
      console.warn('Error adding product:', err);
    }

    setNewProduct({ name: '', collection: 'Volume I', category: 'T-Shirts', price: '', stock: '', status: 'Active', image: '' });
  };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (activeTab === 'overview' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);

      const width = rect.width;
      const height = rect.height;

      // Mock Data
      const data = [120, 150, 180, 140, 210, 245];
      const labels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const maxVal = 250;

      ctx.clearRect(0, 0, width, height);

      const padding = 40;
      const chartWidth = width - padding * 2;
      const chartHeight = height - padding * 2;

      // Draw bars
      const barWidth = chartWidth / data.length - 20;
      
      data.forEach((val, i) => {
        const barHeight = (val / maxVal) * chartHeight;
        const x = padding + i * (chartWidth / data.length) + 10;
        const y = height - padding - barHeight;

        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, height - padding);
        gradient.addColorStop(0, '#567C8D');
        gradient.addColorStop(1, '#C8D9E6');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
        ctx.fill();

        // Label
        ctx.fillStyle = '#666';
        ctx.font = '12px Inter';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barWidth / 2, height - padding + 20);
      });
    }
  }, [activeTab]);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag size={20} /> },
    { id: 'products', label: 'Products', icon: <Package size={20} /> },
    { id: 'users', label: 'Users', icon: <Users size={20} /> },
    { id: 'collections', label: 'Collections', icon: <Layers size={20} /> },
    { id: 'ai-designs', label: 'AI Designs', icon: <Sparkles size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-inter text-dark-text">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A2E] text-white flex flex-col h-full shrink-0">
        <div className="p-6">
          <div className="flex items-center">
            <img src="https://res.cloudinary.com/duwpkzkg1/image/upload/v1783580279/LOGO-3_wmie0y.png" alt="FTW" className="h-8 mr-2 object-contain" />
            <span className="font-bebas text-teal-primary tracking-[0.2em] text-lg mt-1">ADMIN</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                activeTab === item.id 
                  ? 'bg-teal-primary text-white' 
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-teal-primary flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-white/50 truncate">Administrator</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full mt-2 flex items-center gap-3 px-4 py-3 rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-20 flex items-center px-8 shrink-0">
          <h1 className="font-playfair text-3xl font-bold text-dark-text capitalize">
            {activeTab.replace('-', ' ')}
          </h1>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Revenue', value: stats.revenue ? `₦${stats.revenue.toLocaleString()}` : '₦2,450,000', icon: '💰' },
                  { title: 'Total Orders', value: stats.orders || '142', icon: '🛍️' },
                  { title: 'Registered Users', value: stats.users || '389', icon: '👥' },
                  { title: 'AI Designs Generated', value: stats.aiDesigns || '1,247', icon: '🎨' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-500 font-medium mb-1">{stat.title}</p>
                      <p className="font-bebas text-3xl text-dark-text tracking-wide">{stat.value}</p>
                    </div>
                    <div className="text-2xl bg-gray-50 w-10 h-10 rounded-lg flex items-center justify-center">
                      {stat.icon}
                    </div>
                  </div>
                ))}
              </div>

              {/* Charts & Recent Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 flex flex-col gap-8">
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="font-inter font-bold text-lg mb-6">Revenue Overview (Last 6 Months)</h2>
                    <div className="w-full h-64">
                      <canvas ref={canvasRef} className="w-full h-full" />
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-inter font-bold text-lg">Recent Orders</h2>
                      <button className="text-sm text-teal-primary font-medium hover:underline" onClick={() => setActiveTab('orders')}>View All</button>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                      <div className="space-y-4">
                        {[
                          { id: '#FTW-1105', user: 'David O.', status: 'Pending', total: '₦15,000' },
                          { id: '#FTW-1104', user: 'Sarah M.', status: 'Shipped', total: '₦43,000' },
                          { id: '#FTW-1103', user: 'Emmanuel K.', status: 'Delivered', total: '₦28,000' },
                        ].map((order, i) => (
                          <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100">
                            <div>
                              <p className="font-medium text-sm text-dark-text">{order.id}</p>
                              <p className="text-xs text-gray-500">{order.user}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bebas text-lg">{order.total}</p>
                              <p className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' : 
                                'bg-yellow-100 text-yellow-700'
                              }`}>
                                {order.status}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-[350px] lg:h-auto">
                  <h2 className="font-inter font-bold text-lg mb-6">Order Statuses</h2>
                  <div className="flex-1 w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ORDER_STATUS_DATA}
                          cx="50%"
                          cy="50%"
                          innerRadius={80}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {ORDER_STATUS_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-wrap gap-2">
                  {['All', 'Pending', 'Processing', 'Shipped', 'Delivered'].map(f => (
                    <button key={f} className={`px-4 py-1.5 rounded-full text-sm font-medium border ${f === 'All' ? 'bg-teal-primary text-white border-teal-primary' : 'bg-white text-gray-600 border-gray-300 hover:border-teal-primary hover:text-teal-primary'}`}>
                      {f}
                    </button>
                  ))}
                </div>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search orders..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary w-full sm:w-64" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-medium">Order ID</th>
                      <th className="p-4 font-medium">Customer</th>
                      <th className="p-4 font-medium">Date</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium">Total</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {ordersLoading ? (
                      <tr><td colSpan={6} className="text-center p-4">Loading orders...</td></tr>
                    ) : orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-teal-primary">#{order.id.toUpperCase()}</td>
                        <td className="p-4 text-dark-text">{order.user_email}</td>
                        <td className="p-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-4">
                          <select 
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                            className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border-0 cursor-pointer focus:ring-0 ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                            order.status === 'processing' ? 'bg-purple-100 text-purple-700' : 
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                        <td className="p-4 font-bebas text-lg">₦{(order.total || 0).toLocaleString()}</td>
                        <td className="p-4 text-right">
                          <button className="text-gray-400 hover:text-dark-text"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search products..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary w-64" />
                </div>
                <button 
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="bg-teal-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-dark-teal transition-colors"
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Collection</th>
                      <th className="p-4 font-medium">Category</th>
                      <th className="p-4 font-medium">Price</th>
                      <th className="p-4 font-medium">Stock</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-dark-text">{product.name}</td>
                        <td className="p-4 text-gray-500">{product.collection}</td>
                        <td className="p-4 text-gray-500">{product.category}</td>
                        <td className="p-4 font-bebas text-lg">{product.price}</td>
                        <td className="p-4 text-dark-text">{product.stock} units</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                            product.status === 'Active' ? 'bg-green-100 text-green-700' : 
                            product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-3">
                          <button className="text-teal-primary hover:underline text-sm font-medium">Edit</button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:underline text-sm font-medium">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search users..." className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-teal-primary focus:ring-1 focus:ring-teal-primary w-64" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="p-4 font-medium">Name</th>
                      <th className="p-4 font-medium">Email</th>
                      <th className="p-4 font-medium">Role</th>
                      <th className="p-4 font-medium">Date Joined</th>
                      <th className="p-4 font-medium">Orders</th>
                      <th className="p-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {[
                      { name: 'David O.', email: 'david@example.com', role: 'User', date: 'Oct 12, 2023', orders: 3 },
                      { name: 'Sarah M.', email: 'sarah@example.com', role: 'User', date: 'Sep 05, 2023', orders: 7 },
                      { name: 'Admin', email: 'admin@ftw.com', role: 'Admin', date: 'Jan 01, 2023', orders: 0 },
                    ].map((u, i) => (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="p-4 font-medium text-dark-text">{u.name}</td>
                        <td className="p-4 text-gray-500">{u.email}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                            u.role === 'Admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 text-gray-500">{u.date}</td>
                        <td className="p-4 font-medium">{u.orders}</td>
                        <td className="p-4 text-right space-x-3">
                          <button className="text-teal-primary hover:underline text-sm font-medium">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'collections' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="font-bebas text-2xl text-dark-text">Scripture Volumes</h2>
                <button className="bg-teal-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-dark-teal transition-colors">
                  <Plus size={16} /> Add Collection
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { name: 'Volume I: The Foundation', count: 12, status: 'Active' },
                  { name: 'Volume II: The Journey', count: 8, status: 'Active' },
                  { name: 'Volume III: The Promise', count: 4, status: 'Draft' },
                ].map((col, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 flex flex-col h-48 justify-between hover:border-teal-primary transition-colors cursor-pointer group">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bebas text-xl text-dark-text">{col.name}</span>
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          col.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {col.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{col.count} Products</p>
                    </div>
                    <div className="flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-sm text-teal-primary font-medium hover:underline">Edit Collection</button>
                      <button className="text-sm text-red-500 font-medium hover:underline">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholders for other tabs */}
          {['ai-designs', 'settings'].includes(activeTab) && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings size={32} />
              </div>
              <h2 className="text-xl font-bold text-dark-text mb-2 capitalize">{activeTab.replace('-', ' ')} Management</h2>
              <p className="text-gray-500 max-w-md mx-auto">This module is currently being configured and will be available in the next system update.</p>
            </div>
          )}
        </div>
      </main>

      {/* Add Product Modal */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 bg-dark-text/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="font-bebas text-2xl text-dark-text">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsAddProductModalOpen(false)} className="text-gray-400 hover:text-dark-text transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleAddProduct} className="p-6 space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-teal-primary hover:bg-teal-primary/5 transition-colors cursor-pointer group">
                <Upload className="mx-auto h-10 w-10 text-gray-400 group-hover:text-teal-primary transition-colors mb-3" />
                <p className="text-sm font-medium text-gray-600">Click to upload product image or drag and drop</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG or WEBP (max. 10MB)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-text">Product Name</label>
                  <input required type="text" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-primary focus:border-teal-primary outline-none" placeholder="e.g. Genesis 1:1 Tee" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-text">Image URL</label>
                  <input type="text" value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-primary focus:border-teal-primary outline-none" placeholder="https://image..." />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-text">Price</label>
                  <input required type="text" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-primary focus:border-teal-primary outline-none" placeholder="e.g. ₦15,000" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-text">Category</label>
                  <select value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-primary focus:border-teal-primary outline-none bg-white">
                    <option>T-Shirts</option>
                    <option>Hoodies</option>
                    <option>Accessories</option>
                    <option>Custom Canvas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-text">Scripture</label>
                  <input type="text" value={newProduct.scripture} onChange={(e) => setNewProduct({...newProduct, scripture: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-primary focus:border-teal-primary outline-none" placeholder="e.g. Genesis 1:1" />
                </div>
                <div className="space-y-2 flex items-center mt-6">
                  <input type="checkbox" id="isNew" checked={newProduct.isNew} onChange={(e) => setNewProduct({...newProduct, isNew: e.target.checked})} className="mr-2" />
                  <label htmlFor="isNew" className="text-sm font-medium text-dark-text">Mark as New Drop</label>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-text">Collection</label>
                  <select value={newProduct.collection} onChange={(e) => setNewProduct({...newProduct, collection: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-primary focus:border-teal-primary outline-none bg-white">
                    <option>Volume I</option>
                    <option>Volume II</option>
                    <option>Volume III</option>
                    <option>None</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-dark-text">Initial Stock</label>
                  <input required type="number" min="0" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-teal-primary focus:border-teal-primary outline-none" placeholder="0" />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200 mt-8">
                <button type="button" onClick={() => setIsAddProductModalOpen(false)} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-teal-primary text-white rounded-lg text-sm font-medium hover:bg-dark-teal transition-colors">
                  {isEditMode ? 'Save Changes' : 'Upload Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
