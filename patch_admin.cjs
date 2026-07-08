const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminDashboard.tsx', 'utf8');

// Import useProducts
code = code.replace(
  `import { User } from '../types';`,
  `import { User, Product } from '../types';\nimport { useProducts } from '../hooks/useProducts';`
);

// Replace state and fetch logic
code = code.replace(
`  const [products, setProducts] = useState<any[]>([
    { id: 1, name: 'Isaiah 55:11 Tee', collection: 'Volume I', category: 'T-Shirts', price: '₦15,000', stock: 45, status: 'Active' },
    { id: 2, name: 'Hebrews 4:12 Hoodie', collection: 'Volume II', category: 'Hoodies', price: '₦28,000', stock: 12, status: 'Low Stock' },
    { id: 3, name: 'Romans 12:2 Cap', collection: 'Volume III', category: 'Accessories', price: '₦10,000', stock: 0, status: 'Out of Stock' },
  ]);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', collection: 'Volume I', category: 'T-Shirts', price: '', stock: '', status: 'Active', image: ''
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
          price: p.price_display || \`₦\${(p.price || 0).toLocaleString()}\`,
          stock: p.stock !== undefined ? p.stock : 10,
          status: p.status || 'Active',
          image: p.image || ''
        })));
      }
    } catch (err) {
      console.warn('Error fetching products:', err);
    }
  };`,
`  const { products, loading, refetch, addProduct, updateProduct, deleteProduct } = useProducts();
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: '', collection: 'Volume I', category: 'T-Shirts', price: '', stock: '', status: 'Active', image: ''
  });
  const [stats, setStats] = useState({
    revenue: 0,
    orders: 0,
    users: 0,
    aiDesigns: 0
  });`
);

code = code.replace(
`  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);`,
`  useEffect(() => {
    if (activeTab === 'overview') {
      fetchStats();
    }
  }, [activeTab]);`
);

code = code.replace(
`  const handleDeleteProduct = async (id: any) => {
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
      const priceNum = parseInt(newProduct.price.replace(/\\D/g, '')) || 0;
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
  };`,
`  const handleDeleteProduct = async (id: any) => {
    if(confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(id);
    }
  };

  const openEditModal = (product: Product) => {
    setNewProduct({
      name: product.name,
      collection: product.volume,
      category: product.category,
      price: product.priceDisplay,
      stock: '10', // Mock stock for now
      status: 'Active',
      image: product.image || ''
    });
    setEditingId(product.id);
    setIsEditMode(true);
    setIsAddProductModalOpen(true);
  };

  const openAddModal = () => {
    setNewProduct({ name: '', collection: 'Volume I', category: 'T-Shirts', price: '', stock: '10', status: 'Active', image: '' });
    setIsEditMode(false);
    setEditingId(null);
    setIsAddProductModalOpen(true);
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseInt(newProduct.price.replace(/\\D/g, '')) || 0;
    
    if (isEditMode && editingId) {
      await updateProduct(editingId, {
        name: newProduct.name,
        category: newProduct.category,
        volume: newProduct.collection,
        price: priceNum,
        priceDisplay: newProduct.price,
        image: newProduct.image
      });
    } else {
      await addProduct({
        name: newProduct.name,
        category: newProduct.category,
        volume: newProduct.collection,
        price: priceNum,
        priceDisplay: newProduct.price,
        image: newProduct.image,
        scripture: 'Core Collection',
        color: '#1A1A2E'
      });
    }
    
    setIsAddProductModalOpen(false);
    setNewProduct({ name: '', collection: 'Volume I', category: 'T-Shirts', price: '', stock: '', status: 'Active', image: '' });
  };`
);

// Update Add Product button in Products tab
code = code.replace(
`                <button onClick={() => setIsAddProductModalOpen(true)} className="bg-teal-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-dark-teal transition-colors">
                  <Plus size={16} /> Add Product
                </button>`,
`                <button onClick={openAddModal} className="bg-teal-primary text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-dark-teal transition-colors">
                  <Plus size={16} /> Add Product
                </button>`
);

// Update Delete button in Products tab table to correctly wire up delete
code = code.replace(
`                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-teal-primary hover:text-dark-teal mr-3">Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">Delete</button>
                          </td>`,
`                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => openEditModal(product)} className="text-teal-primary hover:text-dark-teal mr-3">Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">Delete</button>
                          </td>`
);

// Correct the mapping in the table to use useProducts properties
code = code.replace(
`                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded overflow-hidden">
                                {product.image ? (
                                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center font-bebas text-gray-400">FTW</div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-dark-text">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.collection}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bebas text-lg">
                            {product.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.stock}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={\`px-2 inline-flex text-xs leading-5 font-semibold rounded-full \${
                              product.status === 'Active' ? 'bg-green-100 text-green-800' :
                              product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }\`}>
                              {product.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => openEditModal(product)} className="text-teal-primary hover:text-dark-teal mr-3">Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">Delete</button>
                          </td>
                        </tr>`,
`                        <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded overflow-hidden">
                                {product.image ? (
                                  <img src={product.image} alt="" className="h-full w-full object-cover" />
                                ) : (
                                  <div className="h-full w-full flex items-center justify-center font-bebas text-gray-400">FTW</div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-dark-text">{product.name}</div>
                                <div className="text-xs text-gray-500">{product.volume}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bebas text-lg">
                            {product.priceDisplay}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            10
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              Active
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button onClick={() => openEditModal(product)} className="text-teal-primary hover:text-dark-teal mr-3">Edit</button>
                            <button onClick={() => handleDeleteProduct(product.id)} className="text-red-500 hover:text-red-700">Delete</button>
                          </td>
                        </tr>`
);

// Replace "Add New Product" in modal title if in edit mode
code = code.replace(
`              <h2 className="font-bebas text-2xl text-dark-text">Add New Product</h2>`,
`              <h2 className="font-bebas text-2xl text-dark-text">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>`
);

code = code.replace(
`                <button type="submit" className="px-5 py-2.5 bg-teal-primary text-white rounded-lg text-sm font-medium hover:bg-dark-teal transition-colors">
                  Upload Product
                </button>`,
`                <button type="submit" className="px-5 py-2.5 bg-teal-primary text-white rounded-lg text-sm font-medium hover:bg-dark-teal transition-colors">
                  {isEditMode ? 'Save Changes' : 'Upload Product'}
                </button>`
);

fs.writeFileSync('src/pages/AdminDashboard.tsx', code);
