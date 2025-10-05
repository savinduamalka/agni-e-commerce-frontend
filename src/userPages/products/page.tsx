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
import { Input } from '@/components/ui/input';
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
import {
  Filter,
  LayoutGrid,
  List,
  Search,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';

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
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/products?${query}`
    );

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
  const [totalProducts, setTotalProducts] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [searchInput, setSearchInput] = useState(
    searchParams.get('search') || ''
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch products whenever searchParams change
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

    fetchProducts();
  }, [searchParams]);

  // Sync search input with URL
  useEffect(() => {
    setSearchInput(searchParams.get('search') || '');
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(page));
    navigate({ search: newSearchParams.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) {
      newSearchParams.set('search', searchInput.trim());
    } else {
      newSearchParams.delete('search');
    }
    newSearchParams.set('page', '1'); // Reset to first page on search
    navigate({ search: newSearchParams.toString() });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    newSearchParams.set('page', '1');
    navigate({ search: newSearchParams.toString() });
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
    if (searchParams.get('category')) {
      count++;
    }
    if (searchParams.get('brand')) {
      count++;
    }
    if (searchParams.get('minPrice')) {
      count++;
    }
    if (searchParams.get('maxPrice')) {
      count++;
    }
    return count;
  };

  return (
    <>
      <Toaster richColors />
      <Header />

      {/* Hero Search Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white border-b border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          {/* Enhanced Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto">
            <div className="relative flex items-center group">
              <div className="absolute left-4 text-gray-400 group-focus-within:text-teal-500 transition-colors">
                <Search className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Search for products, brands, categories..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-12 pr-20 h-14 text-base border-2 border-gray-200 focus:border-teal-500 rounded-full shadow-sm hover:shadow-md transition-all duration-200"
                aria-label="Search products"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-20 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
              <Button
                type="submit"
                className="absolute right-2 rounded-full h-10 px-6 bg-teal-500 hover:bg-teal-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
              >
                Search
              </Button>
            </div>
          </form>
        </div>
      </div>

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
                  className="lg:hidden relative border-2 hover:border-teal-500 transition-colors"
                >
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Filters
                  {activeFiltersCount() > 0 && (
                    <span className="ml-2 bg-teal-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                      {activeFiltersCount()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-full sm:w-[400px] overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle className="text-xl font-bold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filter Products
                  </SheetTitle>
                </SheetHeader>
                <Separator className="my-4" />
                <ProductFilters onClose={() => setIsFilterOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <span className="font-medium">
                  {totalProducts > 0 ? (
                    <>
                      <span className="text-black font-semibold">
                        {totalProducts}
                      </span>{' '}
                      {totalProducts === 1 ? 'product' : 'products'} found
                    </>
                  ) : (
                    'No products found'
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Sort and View Controls */}
          <div className="flex items-center gap-3">
            {/* Sort Dropdown */}
            <Select
              onValueChange={handleSortChange}
              defaultValue={`${searchParams.get('sortBy') || 'createdAt'}-${
                searchParams.get('sortOrder') || 'desc'
              }`}
            >
              <SelectTrigger className="w-[180px] border-2 hover:border-teal-500 transition-colors">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center gap-1 border-2 border-gray-200 rounded-lg p-1">
              <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('grid')}
                className={
                  view === 'grid' ? 'bg-teal-500 hover:bg-teal-600' : ''
                }
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setView('list')}
                className={
                  view === 'list' ? 'bg-teal-500 hover:bg-teal-600' : ''
                }
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
              <ProductFilters />
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
                {Array.from({ length: 12 }).map((_, i) =>
                  view === 'grid' ? (
                    <ProductCardSkeleton key={i} />
                  ) : (
                    <div
                      key={i}
                      className="w-full h-32 rounded-lg bg-gray-100 animate-pulse"
                    />
                  )
                )}
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
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  No Products Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your filters or search terms
                </p>
                <Button
                  onClick={() => navigate('/products')}
                  className="bg-teal-500 hover:bg-teal-600"
                >
                  Clear All Filters
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

export default ProductsPage;
