'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ProductGrid } from '@/components/shared/ProductGrid';
import { OfferProductFilters } from '@/components/shared/OfferProductFilters';
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
import { Filter, LayoutGrid, List, Zap } from 'lucide-react';

interface GetOfferProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minDiscount?: number;
  maxDiscount?: number;
}

const getOfferProducts = async (
  params: GetOfferProductsParams
): Promise<ProductsResponse> => {
  try {
    const filteredParams: Record<string, string> = {};
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        filteredParams[key] = String(value);
      }
    }

    const query = new URLSearchParams(filteredParams).toString();
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products/offers`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Network response was not ok',
      }));
      throw new Error(
        errorData.message || 'An error occurred while fetching offer products.'
      );
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching offer products:', error);
    throw error;
  }
};

const OfferBanner = () => (
  <div className="bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 text-white p-6 rounded-lg mb-8 text-center shadow-lg">
    <div className="flex justify-center items-center mb-2">
      <Zap size={32} className="mr-2" />
      <h2 className="text-3xl font-bold">Flash Deals & Special Offers!</h2>
    </div>
    <p className="text-lg">
      Don't miss out on our limited-time offers. Grab the best deals before
      they're gone!
    </p>
  </div>
);

const OfferProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const fetchOfferProducts = async () => {
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

        const params: GetOfferProductsParams = {
          page: page,
          limit: 12,
          minDiscount: searchParams.get('minDiscount')
            ? Number(searchParams.get('minDiscount'))
            : undefined,
          maxDiscount: searchParams.get('maxDiscount')
            ? Number(searchParams.get('maxDiscount'))
            : undefined,
          sortBy: searchParams.get('sortBy') || 'offerPercentage',
          sortOrder: sortOrder,
        };
        const data = await getOfferProducts(params);
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

    fetchOfferProducts();
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
        <OfferBanner />
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Offer Zone
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
                <OfferProductFilters />
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <OfferProductFilters />
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
              <div className="text-center text-gray-500">
                No special offers found at the moment. Check back soon!
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OfferProductsPage;
