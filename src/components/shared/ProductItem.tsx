import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import type { Product } from '@/lib/types';

interface ProductItemProps {
  product: Product;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg">
      <Link to={`/product/${product.id}`} className="flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-24 h-24 object-cover rounded-md"
        />
      </Link>
      <div className="flex-grow">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold">{product.name}</h3>
        </Link>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <p className="text-lg font-bold mt-1">${product.price.toFixed(2)}</p>
        {product.isOffer && (
          <p className="text-sm text-red-500">
            {product.offerPercentage?.toFixed(0)}% off
          </p>
        )}
      </div>
      <Button asChild>
        <Link to={`/product/${product.id}`}>View</Link>
      </Button>
    </div>
  );
};
