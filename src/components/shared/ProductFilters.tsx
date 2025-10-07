import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  ChevronDown,
  ChevronUp,
  X,
  DollarSign,
  Tag,
  Star,
  RotateCcw,
} from 'lucide-react';

interface ProductFiltersProps {
  onClose?: () => void;
}

export const ProductFilters = ({ onClose }: ProductFiltersProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    brand: true,
    price: true,
    rating: true,
  });

  // Filter values
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [selectedRating, setSelectedRating] = useState<number | null>(
    searchParams.get('rating') ? Number(searchParams.get('rating')) : null
  );

  // Sync with URL params
  useEffect(() => {
    setBrand(searchParams.get('brand') || '');
    setMinPrice(searchParams.get('minPrice') || '');
    setMaxPrice(searchParams.get('maxPrice') || '');
    setSelectedRating(
      searchParams.get('rating') ? Number(searchParams.get('rating')) : null
    );
  }, [searchParams]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Apply brand filter
    if (brand.trim()) {
      newSearchParams.set('brand', brand.trim());
    } else {
      newSearchParams.delete('brand');
    }

    // Apply price filters
    if (minPrice) {
      newSearchParams.set('minPrice', minPrice);
    } else {
      newSearchParams.delete('minPrice');
    }

    if (maxPrice) {
      newSearchParams.set('maxPrice', maxPrice);
    } else {
      newSearchParams.delete('maxPrice');
    }

    // Apply rating filter (Note: Backend needs to support this)
    if (selectedRating !== null) {
      newSearchParams.set('rating', String(selectedRating));
    } else {
      newSearchParams.delete('rating');
    }

    // Reset to first page when applying filters
    newSearchParams.set('page', '1');

    navigate({ search: newSearchParams.toString() });

    // Close mobile filter sheet
    if (onClose) {
      onClose();
    }
  };

  const clearAllFilters = () => {
    setBrand('');
    setMinPrice('');
    setMaxPrice('');
    setSelectedRating(null);

    // Clear all filter params but keep sort params
    const newSearchParams = new URLSearchParams();
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');
    const search = searchParams.get('search');

    if (sortBy) {
      newSearchParams.set('sortBy', sortBy);
    }
    if (sortOrder) {
      newSearchParams.set('sortOrder', sortOrder);
    }
    if (search) {
      newSearchParams.set('search', search);
    }
    newSearchParams.set('page', '1');

    navigate({ search: newSearchParams.toString() });

    if (onClose) {
      onClose();
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (brand) {
      count++;
    }
    if (minPrice) {
      count++;
    }
    if (maxPrice) {
      count++;
    }
    if (selectedRating !== null) {
      count++;
    }
    return count;
  };

  const activeCount = getActiveFiltersCount();

  return (
    <Card className="rounded-[2rem] border border-slate-200 bg-white shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
            <Tag className="h-5 w-5 text-teal-500" />
            Filters
            {activeCount > 0 && (
              <Badge className="ml-2 rounded-full bg-teal-500 px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-wide text-white">
                {activeCount}
              </Badge>
            )}
          </CardTitle>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="-mr-2 text-xs font-semibold text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Brand Filter */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-colors hover:text-teal-500"
            aria-expanded={expandedSections.brand}
          >
            <span className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Brand
            </span>
            {expandedSections.brand ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.brand && (
            <div className="mt-3 space-y-2">
              <Input
                id="brand"
                placeholder="e.g., Nike, Apple, Samsung"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="rounded-xl border border-slate-200 text-sm transition-colors focus:border-teal-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    applyFilters();
                  }
                }}
              />
              {brand && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setBrand('')}
                  className="-ml-2 text-xs text-slate-400 transition-colors hover:text-red-500"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear brand
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator className="border-slate-100" />

        {/* Price Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-colors hover:text-teal-500"
            aria-expanded={expandedSections.price}
          >
            <span className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Price Range
            </span>
            {expandedSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.price && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="minPrice"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Min (Rs)
                  </label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="rounded-xl border border-slate-200 text-sm transition-colors focus:border-teal-500"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters();
                      }
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxPrice"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Max (Rs)
                  </label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="rounded-xl border border-slate-200 text-sm transition-colors focus:border-teal-500"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters();
                      }
                    }}
                  />
                </div>
              </div>
              {(minPrice || maxPrice) && (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Range: Rs {minPrice || '0'} - Rs {maxPrice || '∞'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="h-6 px-2 text-xs text-slate-400 transition-colors hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator className="border-slate-100" />

        {/* Rating Filter */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-colors hover:text-teal-500"
            aria-expanded={expandedSections.rating}
          >
            <span className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              Rating
            </span>
            {expandedSections.rating ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.rating && (
            <div className="mt-3 space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    setSelectedRating(rating === selectedRating ? null : rating)
                  }
                  className={`flex w-full items-center gap-2 rounded-xl border border-slate-200 p-2.5 text-sm transition-all ${
                    selectedRating === rating
                      ? 'border-teal-500 bg-teal-50'
                      : 'hover:border-teal-200 hover:bg-teal-50/60'
                  }`}
                  aria-pressed={selectedRating === rating}
                >
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">& Up</span>
                </button>
              ))}
              {selectedRating !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                  className="w-full text-xs text-slate-400 transition-colors hover:text-red-500"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear rating
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator className="border-slate-100" />

        {/* Apply Filters Button */}
        <Button
          onClick={applyFilters}
          className="h-11 w-full rounded-full bg-teal-500 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-600 hover:shadow-lg"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};
