export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  created_at: string;
}

export interface Order {
  order_id: number;
  product_name: string;
  category: string;
  quantity: number;
  total_price: number;
  status: string;
  created_at: string;
}

export interface Review {
  id: number;
  reviewer: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}