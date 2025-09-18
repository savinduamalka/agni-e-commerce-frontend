import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MobileSearchProps {
  onClose: () => void;
}

export function MobileSearch({ onClose }: MobileSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchQuery);
      // Navigate to search results page
      onClose();
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsExpanded(false);
  };

  return (
    <div className="mb-4">
      {!isExpanded ? (
        <Button
          onClick={() => setIsExpanded(true)}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl p-4 flex items-center justify-center space-x-2 transition-all duration-200"
        >
          <Search className="h-5 w-5" />
          <span className="font-medium">Search Products</span>
        </Button>
      ) : (
        <form onSubmit={handleSearch} className="bg-white dark:bg-gray-800 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-700">
          <div className="flex items-center space-x-2 mb-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="pl-10 pr-4 py-2 w-full border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                autoFocus
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-lg"
            disabled={!searchQuery.trim()}
          >
            Search
          </Button>
        </form>
      )}
    </div>
  );
}
