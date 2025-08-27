import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const OfferProductFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      newSearchParams.set(name, value);
    } else {
      newSearchParams.delete(name);
    }
    setSearchParams(newSearchParams);
  };

  const handleSortChange = (value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (value) {
      const [sortBy, sortOrder] = value.split('-');
      newSearchParams.set('sortBy', sortBy);
      newSearchParams.set('sortOrder', sortOrder);
    } else {
      newSearchParams.delete('sortBy');
      newSearchParams.delete('sortOrder');
    }
    setSearchParams(newSearchParams);
  };

  const handleApplyFilters = () => {
    navigate({ search: searchParams.toString() });
  };

  return (
    <Card className="bg-gray-50 border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">
          Filter Offers
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="minDiscount"
              className="block text-sm font-medium text-gray-700"
            >
              Min Discount %
            </label>
            <Input
              id="minDiscount"
              name="minDiscount"
              type="number"
              placeholder="0"
              defaultValue={searchParams.get('minDiscount') || ''}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          <div>
            <label
              htmlFor="maxDiscount"
              className="block text-sm font-medium text-gray-700"
            >
              Max Discount %
            </label>
            <Input
              id="maxDiscount"
              name="maxDiscount"
              type="number"
              placeholder="100"
              defaultValue={searchParams.get('maxDiscount') || ''}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700"
          >
            Sort by
          </label>
          <Select
            onValueChange={handleSortChange}
            defaultValue={`${
              searchParams.get('sortBy') || 'offerPercentage'
            }-${searchParams.get('sortOrder') || 'desc'}`}
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="offerPercentage-desc">
                Discount: High to Low
              </SelectItem>
              <SelectItem value="offerPercentage-asc">
                Discount: Low to High
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          onClick={handleApplyFilters}
          className="w-full bg-red-500 hover:bg-red-600 text-white"
        >
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};
