'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { ProductFilters } from '@/components/shared/ProductFilters';
import { Pagination } from '@/components/shared/Pagination';
import type { Product, ProductsResponse } from '@/lib/types';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Toaster, toast } from 'sonner';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Filter, LayoutGrid, List } from 'lucide-react';

interface GetActiveProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

const getActiveProducts = async (
  params: GetActiveProductsParams
): Promise<ProductsResponse> => {
  try {
    const filteredParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        filteredParams[key] = String(value);
      }
    }

    const query = new URLSearchParams(filteredParams).toString();
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products?${query}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Network response was not ok',
      }));
      throw new Error(
        errorData.message || 'An error occurred while fetching products.'
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching active products:', error);
    throw error;
  }
};

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const page = parseInt(searchParams.get('page') || '1', 10);
        setCurrentPage(page);

        const sortOrderParam = searchParams.get('sortOrder');
        const sortOrder =
          sortOrderParam === 'asc' || sortOrderParam === 'desc'
            ? sortOrderParam
            : 'desc';

        const params: GetActiveProductsParams = {
          page: page,
          limit: 12,
          category: searchParams.get('category') || undefined,
          brand: searchParams.get('brand') || undefined,
          minPrice: searchParams.get('minPrice')
            ? Number(searchParams.get('minPrice'))
            : undefined,
          maxPrice: searchParams.get('maxPrice')
            ? Number(searchParams.get('maxPrice'))
            : undefined,
          search: searchParams.get('search') || undefined,
          sortBy: searchParams.get('sortBy') || 'createdAt',
          sortOrder: sortOrder,
        };
        const data = await getActiveProducts(params);
        setProducts(data.products);
        setTotalPages(data.totalPages);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(page));
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <>
      <Toaster richColors />
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Products
          </h1>
          <div className="flex items-center gap-2">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setView('grid')}
              className="hidden sm:flex"
            >
              <LayoutGrid className="h-5 w-5" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => setView('list')}
              className="hidden sm:flex"
            >
              <List className="h-5 w-5" />
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden">
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <ProductFilters />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters />
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} view={view} />
                <div className="mt-8">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-gray-500">No products found.</div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductsPage;
