import { useState, useEffect, useCallback, type SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';

type Category = {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  slug?: string;
};

const categoriesPerPage = 12;

const createPlaceholderDataUri = (text: string, size = 240) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
		<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
			<rect width='100%' height='100%' fill='#f5f5f5'/>
			<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='${Math.max(
        14,
        size / 9
      )}' fill='#9ca3af'>${text}</text>
		</svg>
	`)}
`;

const FALLBACK_CATEGORY_IMAGE = createPlaceholderDataUri('Category', 320);

const setFallbackImage = (
  event: SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
) => {
  const img = event.currentTarget;
  if (img.src === fallbackSrc) {
    return;
  }
  img.onerror = null;
  img.src = fallbackSrc;
};

const getCategorySummary = (category: Category) => {
  const description = category.description?.trim();
  if (!description) {
    return 'Discover curated picks selected for this collection.';
  }
  return description.length > 110
    ? `${description.slice(0, 107)}…`
    : description;
};

const buildCategoryHref = (category: Category) => {
  const key = category.slug ?? category._id;
  return `/products?category=${encodeURIComponent(key)}`;
};

const CategoryCard = ({ category }: { category: Category }) => {
  const imageSrc = category.image || FALLBACK_CATEGORY_IMAGE;
  const summary = getCategorySummary(category);

  return (
    <Link
      to={buildCategoryHref(category)}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-teal-500)] rounded-2xl"
    >
      <Card className="h-full border border-gray-200 shadow-none rounded-2xl overflow-hidden transition-all duration-200 group-hover:border-[var(--color-teal-500)] group-hover:shadow-md bg-white">
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <img
            src={imageSrc}
            alt={category.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(event) =>
              setFallbackImage(event, FALLBACK_CATEGORY_IMAGE)
            }
          />
        </div>
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {category.name}
            </h3>
            <span className="text-xs font-medium uppercase tracking-wide text-[var(--color-teal-500)]">
              Browse
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed min-h-[3.5rem]">
            {summary}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/categories`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      if (data.success) {
        setCategories(
          Array.isArray(data.data?.categories) ? data.data.categories : []
        );
      } else {
        throw new Error(data.message || 'Failed to fetch categories');
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const totalCategories = categories.length;
  const totalPages = Math.ceil(totalCategories / categoriesPerPage);
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = categories.slice(
    indexOfFirstCategory,
    indexOfLastCategory
  );

  useEffect(() => {
    if (!loading && totalPages > 0 && currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [loading, totalPages, currentPage]);

  const renderSkeletons = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: categoriesPerPage }).map((_, index) => (
        <Card
          key={`skeleton-${index}`}
          className="border border-gray-200 shadow-none rounded-2xl"
        >
          <div className="relative aspect-square overflow-hidden bg-gray-100">
            <Skeleton className="absolute inset-0" />
          </div>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderGrid = () => (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {currentCategories.map((category) => (
        <CategoryCard key={category._id} category={category} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {loading && renderSkeletons()}

          {!loading && error && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                We couldn't load the categories
              </h2>
              <p className="text-sm text-gray-600 mb-6">{error}</p>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-900 hover:border-[var(--color-teal-500)] hover:text-[var(--color-teal-500)]"
                onClick={() => void loadCategories()}
              >
                Try again
              </Button>
            </div>
          )}

          {!loading && !error && totalCategories === 0 && (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-3">
                No categories found yet
              </h2>
              <p className="text-sm text-gray-600">
                We update our catalog regularly—check back soon for new
                additions.
              </p>
            </div>
          )}

          {!loading && !error && totalCategories > 0 && renderGrid()}

          {!loading && !error && totalPages > 1 && (
            <div className="flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) => Math.max(prev - 1, 1));
                      }}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        type="button"
                        isActive={i + 1 === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(i + 1);
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage((prev) =>
                          Math.min(prev + 1, totalPages)
                        );
                      }}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
