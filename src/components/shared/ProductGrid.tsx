import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';
import { ProductItem } from './ProductItem';

interface ProductGridProps {
  products: Product[];
  view: 'grid' | 'list';
}

export const ProductGrid = ({ products, view }: ProductGridProps) => {
  if (view === 'list') {
    return (
      <div className="space-y-4">
        {products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 sm:gap-5 lg:gap-6">
      {products.map((product) => (
        <ProductCard key={product._id ?? product.id} product={product} />
      ))}
    </div>
  );
};
