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
    <Card className="border-2 border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <Tag className="h-5 w-5 text-teal-500" />
            Filters
            {activeCount > 0 && (
              <Badge className="bg-teal-500 text-white ml-2">
                {activeCount}
              </Badge>
            )}
          </CardTitle>
          {activeCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 -mr-2"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Brand Filter */}
        <div>
          <button
            onClick={() => toggleSection('brand')}
            className="w-full flex items-center justify-between py-2 hover:text-teal-500 transition-colors"
            aria-expanded={expandedSections.brand}
          >
            <span className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
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
                className="border-2 focus:border-teal-500 transition-colors"
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
                  className="text-xs text-gray-500 hover:text-red-500 -ml-2"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear brand
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Price Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('price')}
            className="w-full flex items-center justify-between py-2 hover:text-teal-500 transition-colors"
            aria-expanded={expandedSections.price}
          >
            <span className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
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
                    className="text-xs text-gray-500 mb-1 block"
                  >
                    Min ($)
                  </label>
                  <Input
                    id="minPrice"
                    type="number"
                    placeholder="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="border-2 focus:border-teal-500 transition-colors"
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
                    className="text-xs text-gray-500 mb-1 block"
                  >
                    Max ($)
                  </label>
                  <Input
                    id="maxPrice"
                    type="number"
                    placeholder="Any"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="border-2 focus:border-teal-500 transition-colors"
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
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">
                    Range: ${minPrice || '0'} - ${maxPrice || '∞'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMinPrice('');
                      setMaxPrice('');
                    }}
                    className="text-xs text-gray-500 hover:text-red-500 h-6 px-2"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Rating Filter */}
        <div>
          <button
            onClick={() => toggleSection('rating')}
            className="w-full flex items-center justify-between py-2 hover:text-teal-500 transition-colors"
            aria-expanded={expandedSections.rating}
          >
            <span className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
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
                  className={`w-full flex items-center gap-2 p-2 rounded-lg border-2 transition-all ${
                    selectedRating === rating
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-gray-300'
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
                  <span className="text-sm font-medium">& Up</span>
                </button>
              ))}
              {selectedRating !== null && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRating(null)}
                  className="text-xs text-gray-500 hover:text-red-500 w-full"
                >
                  <X className="h-3 w-3 mr-1" />
                  Clear rating
                </Button>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Apply Filters Button */}
        <Button
          onClick={applyFilters}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold h-11 shadow-md hover:shadow-lg transition-all duration-200"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};
