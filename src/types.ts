export interface Product {
  id: string;
  name: string;
  scripture: string;
  price: number;
  priceDisplay: string;
  category: string;
  volume: string;
  color: string;
  isNew?: boolean;
  image?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
}

export interface User {
  email: string;
  role: string;
  name: string;
}

export interface OrderItem {
  product: Product;
  quantity: number;
  size?: string;
  price: number;
}

export interface Order {
  id: string;
  user_email: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  created_at: string;
  reference?: string;
}
