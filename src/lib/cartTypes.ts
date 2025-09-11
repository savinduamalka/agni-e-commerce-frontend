import type { Product } from './types';

export interface CartItem {
  product: Product;
  productId: string;
  quantity: number;
  price: number;
  addedAt: string;
}

export interface Cart {
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  lastUpdated: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartSummary {
    totalItems: number;
    totalPrice: number;
    itemCount: number;
    lastUpdated?: string;
}
