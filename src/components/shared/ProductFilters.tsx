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

export const ProductFilters = () => {
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
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700">
            Search
          </label>
          <Input
            id="search"
            name="search"
            placeholder="Search products..."
            defaultValue={searchParams.get('search') || ''}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
            Brand
          </label>
          <Input
            id="brand"
            name="brand"
            placeholder="Enter brand"
            defaultValue={searchParams.get('brand') || ''}
            onChange={handleInputChange}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
              Min Price
            </label>
            <Input
              id="minPrice"
              name="minPrice"
              type="number"
              placeholder="0"
              defaultValue={searchParams.get('minPrice') || ''}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
              Max Price
            </label>
            <Input
              id="maxPrice"
              name="maxPrice"
              type="number"
              placeholder="Any"
              defaultValue={searchParams.get('maxPrice') || ''}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
            Sort by
          </label>
          <Select
            onValueChange={handleSortChange}
            defaultValue={`${searchParams.get('sortBy') || 'createdAt'}-${
              searchParams.get('sortOrder') || 'desc'
            }`}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleApplyFilters} className="w-full">
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};
