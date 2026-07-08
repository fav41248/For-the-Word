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
}

export interface User {
  email: string;
  role: string;
  name: string;
}
