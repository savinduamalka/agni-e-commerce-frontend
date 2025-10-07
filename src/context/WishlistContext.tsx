import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Category, Product } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from './AuthContext';

type WishlistContextValue = {
  wishlist: Product[];
  isWishlisted: (productId: string) => boolean;
  toggleWishlist: (product: Product) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  clearWishlist: () => Promise<void>;
  refreshWishlist: () => Promise<void>;
  loading: boolean;
};

const WishlistContext = createContext<WishlistContextValue | undefined>(
  undefined
);

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL;

const createFallbackCategory = (): Category => ({
  _id: '',
  id: '',
  name: 'General',
  slug: 'general',
  description: '',
  image: '',
  parent: null,
  ancestors: [],
  isActive: true,
  isFeatured: false,
  createdAt: new Date(0).toISOString(),
  updatedAt: new Date(0).toISOString(),
});

const normalizeProduct = (item: any): Product | null => {
  const product = item?.product ?? {};
  const id = product.id ?? item?.productId;

  if (!id) {
    return null;
  }

  const images = Array.isArray(product.images) ? product.images : [];

  return {
    _id: product._id ?? id,
    id,
    name: product.name ?? 'Unnamed product',
    description: product.description ?? '',
    category: product.category ?? createFallbackCategory(),
    categoryId: product.categoryId ?? product.category?.id ?? '',
    price: typeof product.price === 'number' ? product.price : 0,
    labeledPrice:
      typeof product.labeledPrice === 'number'
        ? product.labeledPrice
        : typeof product.price === 'number'
        ? product.price
        : 0,
    stock: typeof product.stock === 'number' ? product.stock : 0,
    images,
    isActive: product.isActive ?? true,
    isHot: product.isHot ?? false,
    isOffer: product.isOffer ?? false,
    offerPercentage: product.offerPercentage,
    salesCount: product.salesCount,
    brand: product.brand,
    features: Array.isArray(product.features) ? product.features : [],
    specifications:
      product.specifications && typeof product.specifications === 'object'
        ? product.specifications
        : {},
    reviews: Array.isArray(product.reviews) ? product.reviews : [],
    averageRating:
      typeof product.averageRating === 'number' ? product.averageRating : 0,
    totalReviews:
      typeof product.totalReviews === 'number' ? product.totalReviews : 0,
  };
};

const extractProductsFromResponse = (wishlistPayload: any): Product[] => {
  const items = Array.isArray(wishlistPayload?.items)
    ? wishlistPayload.items
    : [];

  return (items as unknown[]).reduce((acc: Product[], item: unknown) => {
    const normalized = normalizeProduct(item);
    if (normalized) {
      acc.push(normalized);
    }
    return acc;
  }, []);
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const getToken = () =>
    typeof window === 'undefined' ? null : localStorage.getItem('token');

  const ensureAuthenticated = useCallback(() => {
    if (!isAuthenticated) {
      toast.error('Please sign in to manage your wishlist.');
      return false;
    }
    if (!API_BASE_URL) {
      toast.error('Wishlist service is unavailable. Please try again later.');
      return false;
    }
    return true;
  }, [isAuthenticated]);

  const request = useCallback(
    async (path: string, options: RequestInit = {}) => {
      const token = getToken();

      if (!token) {
        throw new Error('Authentication token missing. Please sign in again.');
      }

      const response = await fetch(`${API_BASE_URL}/wishlist${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          ...(options.headers ?? {}),
        },
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data?.message ?? 'Unable to complete wishlist request');
      }

      return data;
    },
    []
  );

  const refreshWishlist = useCallback(async () => {
    if (!isAuthenticated || !API_BASE_URL) {
      setWishlist([]);
      return;
    }

    setLoading(true);
    try {
      const data = await request('', { method: 'GET' });
      const products = extractProductsFromResponse(data?.wishlist);
      setWishlist(products);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to load wishlist'
      );
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, request]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      setWishlist([]);
      return;
    }

    void refreshWishlist();
  }, [authLoading, isAuthenticated, refreshWishlist]);

  const isWishlisted = useCallback(
    (productId: string) =>
      wishlist.some(
        (product) => product.id === productId || product._id === productId
      ),
    [wishlist]
  );

  const toggleWishlist = useCallback(
    async (product: Product) => {
      if (!ensureAuthenticated()) {
        return;
      }

      try {
        const data = await request('', {
          method: 'POST',
          body: JSON.stringify({ productId: product.id }),
        });

        const products = extractProductsFromResponse(data?.wishlist);
        setWishlist(products);

        const action = data?.action as 'added' | 'removed' | undefined;
        const message =
          data?.message ??
          (action === 'added'
            ? 'Product added to wishlist successfully'
            : action === 'removed'
            ? 'Product removed from wishlist successfully'
            : 'Wishlist updated successfully');
        toast.success(message);
      } catch (error) {
        console.error('Toggle wishlist failed:', error);
        toast.error(
          error instanceof Error ? error.message : 'Could not update wishlist'
        );
      }
    },
    [ensureAuthenticated, request]
  );

  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!ensureAuthenticated()) {
        return;
      }

      try {
        const data = await request(`/${productId}`, { method: 'DELETE' });
        const products = extractProductsFromResponse(data?.wishlist);
        setWishlist(products);
        toast.success(
          data?.message ?? 'Product removed from wishlist successfully'
        );
      } catch (error) {
        console.error('Remove wishlist item failed:', error);
        toast.error(
          error instanceof Error
            ? error.message
            : 'Could not remove wishlist item'
        );
      }
    },
    [ensureAuthenticated, request]
  );

  const clearWishlist = useCallback(async () => {
    if (!ensureAuthenticated()) {
      return;
    }

    try {
      const data = await request('', { method: 'DELETE' });
      const products = extractProductsFromResponse(data?.wishlist);
      setWishlist(products);
      toast.success(data?.message ?? 'Wishlist cleared successfully');
    } catch (error) {
      console.error('Clear wishlist failed:', error);
      toast.error(
        error instanceof Error ? error.message : 'Could not clear wishlist'
      );
    }
  }, [ensureAuthenticated, request]);

  const value = useMemo(
    () => ({
      wishlist,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      refreshWishlist,
      loading,
    }),
    [
      wishlist,
      isWishlisted,
      toggleWishlist,
      removeFromWishlist,
      clearWishlist,
      refreshWishlist,
      loading,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
