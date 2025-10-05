import { useState } from 'react';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    try {
      const success = await addToCart(product.id, 1);
      if (success) {
        toast.success('Added to cart successfully!', {
          description: `${product.name} has been added to your cart.`,
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  // Calculate discount percentage if applicable
  const discountPercent =
    product.isOffer && product.offerPercentage ? product.offerPercentage : 0;

  const displayPrice =
    discountPercent > 0
      ? product.price * (1 - discountPercent / 100)
      : product.price;

  return (
    <Card className="group overflow-hidden border-2 border-gray-100 hover:border-teal-500 transition-all duration-300 hover:shadow-xl">
      {/* Image Section with Overlay Actions */}
      <CardHeader className="p-0 relative overflow-hidden">
        <Link to={`/products/${product.id}`} className="block relative">
          <div className="aspect-square overflow-hidden bg-gray-100">
            <img
              src={
                imageError
                  ? '/placeholder-product.svg'
                  : product.images[0] || '/placeholder-product.svg'
              }
              alt={product.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick View Button - Shows on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/90 backdrop-blur-sm hover:bg-white font-semibold"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </Link>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isHot && (
            <Badge className="bg-red-500 text-white font-semibold shadow-md">
              🔥 Hot
            </Badge>
          )}
          {product.isOffer && discountPercent > 0 && (
            <Badge className="bg-teal-500 text-white font-semibold shadow-md">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge variant="destructive" className="font-semibold shadow-md">
              Sold Out
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge className="bg-orange-500 text-white font-semibold shadow-md">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md flex items-center justify-center transition-all duration-200 hover:scale-110"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`h-5 w-5 transition-colors ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'
            }`}
          />
        </button>
      </CardHeader>

      {/* Product Info */}
      <CardContent className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs font-medium text-teal-600 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-teal-600 transition-colors min-h-[3rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.averageRating > 0
              ? product.averageRating.toFixed(1)
              : 'No reviews'}
          </span>
          {product.totalReviews > 0 && (
            <span className="text-xs text-gray-400">
              ({product.totalReviews})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl font-bold text-gray-900">
            ${displayPrice.toFixed(2)}
          </span>
          {discountPercent > 0 && (
            <span className="text-sm text-gray-400 line-through">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <Badge variant="outline" className="border-green-500 text-green-700">
            ✓ In Stock
          </Badge>
        ) : (
          <Badge variant="outline" className="border-red-500 text-red-700">
            Out of Stock
          </Badge>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="p-4 pt-0 gap-2">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isAddingToCart ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          asChild
          variant="outline"
          className="border-2 hover:border-teal-500 hover:text-teal-600 transition-colors"
        >
          <Link to={`/products/${product.id}`}>
            <Eye className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
