export interface Ancestor {
  _id: string;
  name: string;
  slug: string;
}

export interface Category {
  _id: string;
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | Category | null;
  ancestors?: Ancestor[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  id: string;
  name: string;
  altNames?: string[];
  description: string;
  category: Category;
  categoryId: string;
  price: number;
  labeledPrice: number;
  stock: number;
  images: string[];
  isActive: boolean;
  isHot: boolean;
  isOffer: boolean;
  offerPercentage?: number;
  salesCount?: number;
  brand?: string;
  specifications?: Record<string, any>;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  products: Product[];
  totalPages: number;
  currentPage: number;
  totalProducts: number;
}
