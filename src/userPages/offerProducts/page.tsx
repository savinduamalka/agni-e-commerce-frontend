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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Filter, LayoutGrid, List, Zap, SlidersHorizontal } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

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

const OfferProductsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
        setTotalProducts(data.totalProducts);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      const [sortBy, sortOrder] = value.split('-');
      newSearchParams.set('sortBy', sortBy);
      newSearchParams.set('sortOrder', sortOrder);
      newSearchParams.set('page', '1');
    }
    navigate({ search: newSearchParams.toString() });
  };

  const activeFiltersCount = () => {
    let count = 0;
    if (searchParams.get('minDiscount')) {
      count++;
    }
    if (searchParams.get('maxDiscount')) {
      count++;
    }
    return count;
  };

  return (
    <>
      <Toaster richColors />
      <Header />

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Toolbar - Filters, Sort, View Options */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden relative border-2 hover:border-red-500 transition-colors"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {activeFiltersCount() > 0 && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {activeFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[88vw] max-h-[90vh] max-w-sm overflow-hidden rounded-r-[2.5rem] border-none bg-white p-0 shadow-2xl sm:w-[360px]"
              >
                <div className="flex h-full flex-col">
                  <SheetHeader className="px-6 pt-6">
                    <SheetTitle className="flex items-center gap-2 text-lg font-semibold text-slate-900">
                      <Filter className="h-5 w-5 text-red-500" />
                      Filter Offers
                    </SheetTitle>
                  </SheetHeader>
                  <Separator className="mt-4 border-slate-100" />
                  <div className="flex-1 overflow-y-auto px-6 pb-6">
                    <OfferProductFilters
                      onClose={() => setIsFilterOpen(false)}
                    />
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Results Count */}
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-500 animate-pulse" />
              <div className="text-sm text-gray-600">
                {loading ? (
                  <span className="animate-pulse">Loading offers...</span>
                ) : (
                  <span className="font-medium">
                    {totalProducts > 0 ? (
                      <>
                        <span className="text-red-600 font-bold">
                          {totalProducts}
                        </span>{' '}
                        special {totalProducts === 1 ? 'offer' : 'offers'}
                      </>
                    ) : (
                      'No offers found'
                    )}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <Select
              onValueChange={handleSortChange}
              defaultValue={`${
                searchParams.get('sortBy') || 'offerPercentage'
              }-${searchParams.get('sortOrder') || 'desc'}`}
            >
              <SelectTrigger className="w-[200px] border-2 hover:border-red-500 transition-colors">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="offerPercentage-desc">
                  🔥 Best Deals First
                </SelectItem>
                <SelectItem value="offerPercentage-asc">
                  💰 Lowest Discount First
                </SelectItem>
                <SelectItem value="price-asc">💵 Price: Low to High</SelectItem>
                <SelectItem value="price-desc">
                  💎 Price: High to Low
                </SelectItem>
                <SelectItem value="createdAt-desc">✨ Newest First</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur sm:gap-2">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                className={`h-9 w-9 rounded-full text-slate-500 transition-colors ${
                  view === 'grid'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'hover:text-red-600'
                }`}
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                className={`h-9 w-9 rounded-full text-slate-500 transition-colors ${
                  view === 'list'
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'hover:text-red-600'
                }`}
                aria-label="List view"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Products Grid with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-8">
              <OfferProductFilters />
            </div>
          </aside>

          {/* Products Content */}
          <main className="lg:col-span-4">
            {loading ? (
              <div
                className={`grid gap-6 ${
                  view === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'
                    : 'grid-cols-1'
                }`}
              >
                {Array.from({ length: 12 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="text-red-500 text-lg font-medium mb-2">
                  ⚠️ {error}
                </div>
                <p className="text-gray-500">Please try again later</p>
              </div>
            ) : products.length > 0 ? (
              <>
                <ProductGrid products={products} view={view} />
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Offers Available
                </h3>
                <p className="text-gray-500 mb-6">
                  Check back soon for amazing deals!
                </p>
                <Button
                  onClick={() => navigate('/products')}
                  className="bg-red-500 hover:bg-red-600"
                >
                  Browse All Products
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default OfferProductsPage;
