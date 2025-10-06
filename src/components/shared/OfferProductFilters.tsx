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
  Percent,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface OfferProductFiltersProps {
  onClose?: () => void;
}

export const OfferProductFilters = ({ onClose }: OfferProductFiltersProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    discount: true,
  });

  // Filter values
  const [minDiscount, setMinDiscount] = useState(
    searchParams.get('minDiscount') || ''
  );
  const [maxDiscount, setMaxDiscount] = useState(
    searchParams.get('maxDiscount') || ''
  );

  // Sync with URL params
  useEffect(() => {
    setMinDiscount(searchParams.get('minDiscount') || '');
    setMaxDiscount(searchParams.get('maxDiscount') || '');
  }, [searchParams]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const applyFilters = () => {
    const newSearchParams = new URLSearchParams(searchParams);

    // Apply discount filters
    if (minDiscount) {
      newSearchParams.set('minDiscount', minDiscount);
    } else {
      newSearchParams.delete('minDiscount');
    }

    if (maxDiscount) {
      newSearchParams.set('maxDiscount', maxDiscount);
    } else {
      newSearchParams.delete('maxDiscount');
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
    setMinDiscount('');
    setMaxDiscount('');

    // Clear all filter params but keep sort params
    const newSearchParams = new URLSearchParams();
    const sortBy = searchParams.get('sortBy');
    const sortOrder = searchParams.get('sortOrder');

    if (sortBy) {
      newSearchParams.set('sortBy', sortBy);
    }
    if (sortOrder) {
      newSearchParams.set('sortOrder', sortOrder);
    }
    newSearchParams.set('page', '1');

    navigate({ search: newSearchParams.toString() });

    if (onClose) {
      onClose();
    }
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (minDiscount) {
      count++;
    }
    if (maxDiscount) {
      count++;
    }
    return count;
  };

  const activeCount = getActiveFiltersCount();

  // Quick discount presets
  const discountPresets = [
    { label: '10% & Above', min: 10, max: null },
    { label: '25% & Above', min: 25, max: null },
    { label: '50% & Above', min: 50, max: null },
    { label: '75% & Above', min: 75, max: null },
  ];

  const applyPreset = (min: number, max: number | null) => {
    setMinDiscount(String(min));
    setMaxDiscount(max ? String(max) : '');

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('minDiscount', String(min));
    if (max) {
      newSearchParams.set('maxDiscount', String(max));
    } else {
      newSearchParams.delete('maxDiscount');
    }
    newSearchParams.set('page', '1');
    navigate({ search: newSearchParams.toString() });
  };

  return (
    <Card className="rounded-[2rem] border border-red-100 bg-white shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold text-red-600">
            <Zap className="h-5 w-5 text-red-500" />
            Offer Filters
            {activeCount > 0 && (
              <Badge className="ml-2 rounded-full bg-red-500 px-2.5 py-[3px] text-[11px] font-semibold uppercase tracking-wide text-white">
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
        {/* Quick Presets */}
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Zap className="h-4 w-4 text-red-500" />
            Quick Filters
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {discountPresets.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyPreset(preset.min, preset.max)}
                className="rounded-xl border border-red-200 px-3 py-2 text-xs font-semibold text-slate-700 transition-all hover:border-red-500 hover:bg-red-50 hover:text-red-600"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <Separator className="border-red-100" />

        {/* Discount Range Filter */}
        <div>
          <button
            onClick={() => toggleSection('discount')}
            className="flex w-full items-center justify-between py-2 text-sm font-semibold uppercase tracking-wide text-slate-700 transition-colors hover:text-red-500"
            aria-expanded={expandedSections.discount}
          >
            <span className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Discount Range
            </span>
            {expandedSections.discount ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {expandedSections.discount && (
            <div className="mt-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="minDiscount"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Min (%)
                  </label>
                  <Input
                    id="minDiscount"
                    type="number"
                    placeholder="0"
                    value={minDiscount}
                    onChange={(e) => setMinDiscount(e.target.value)}
                    className="rounded-xl border border-red-100 text-sm transition-colors focus:border-red-500"
                    min="0"
                    max="100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters();
                      }
                    }}
                  />
                </div>
                <div>
                  <label
                    htmlFor="maxDiscount"
                    className="mb-1 block text-xs font-medium text-slate-500"
                  >
                    Max (%)
                  </label>
                  <Input
                    id="maxDiscount"
                    type="number"
                    placeholder="100"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="rounded-xl border border-red-100 text-sm transition-colors focus:border-red-500"
                    min="0"
                    max="100"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        applyFilters();
                      }
                    }}
                  />
                </div>
              </div>
              {(minDiscount || maxDiscount) && (
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    Discount: {minDiscount || '0'}% - {maxDiscount || '100'}%
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setMinDiscount('');
                      setMaxDiscount('');
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

        <Separator className="border-red-100" />

        {/* Info Box */}
        <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
          <div className="flex items-start gap-2">
            <Zap className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
            <div>
              <h4 className="mb-1 text-sm font-semibold text-red-600">
                Hot Deals Alert! 🔥
              </h4>
              <p className="text-xs text-red-500">
                Filter by discount percentage to find the best offers. Higher
                discounts mean bigger savings!
              </p>
            </div>
          </div>
        </div>

        {/* Apply Filters Button */}
        <Button
          onClick={applyFilters}
          className="h-11 w-full rounded-full bg-red-500 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg"
        >
          <Zap className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};
