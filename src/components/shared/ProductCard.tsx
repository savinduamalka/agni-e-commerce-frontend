import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      <CardHeader className="p-0">
        <Link to={`/products/${product.id}`}>
          <img
            src={product.images[0] || '/placeholder-product.svg'}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold mb-2 truncate">
          <Link to={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-xl font-bold text-primary">${product.price.toFixed(2)}</p>
          {product.stock > 0 ? (
            <Badge variant="outline">In Stock</Badge>
          ) : (
            <Badge variant="destructive">Out of Stock</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
