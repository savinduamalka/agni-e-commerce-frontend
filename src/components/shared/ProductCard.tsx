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
    <Card className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-teal-500 hover:shadow-xl">
      {/* Image Section with Overlay Actions */}
      <CardHeader className="relative overflow-hidden p-0">
        <Link to={`/products/${product.id}`} className="relative block">
          <div className="aspect-square overflow-hidden bg-slate-100">
            <img
              src={
                imageError
                  ? '/placeholder-product.svg'
                  : product.images[0] || '/placeholder-product.svg'
              }
              alt={product.name}
              onError={() => setImageError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.08]"
              loading="lazy"
            />
          </div>

          {/* Overlay gradient on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick View Button - Shows on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <Button
              variant="secondary"
              size="sm"
              className="rounded-full bg-white/90 px-4 py-2 font-semibold text-xs uppercase tracking-wide shadow-sm backdrop-blur-sm hover:bg-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              Quick View
            </Button>
          </div>
        </Link>

        {/* Top Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.isHot && (
            <Badge className="bg-red-500 text-[11px] font-semibold text-white shadow-md">
              🔥 Hot
            </Badge>
          )}
          {product.isOffer && discountPercent > 0 && (
            <Badge className="bg-teal-500 text-[11px] font-semibold text-white shadow-md">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.stock === 0 && (
            <Badge
              variant="destructive"
              className="text-[11px] font-semibold shadow-md"
            >
              Sold Out
            </Badge>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <Badge className="bg-orange-500 text-[11px] font-semibold text-white shadow-md">
              Only {product.stock} left
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-md transition-all duration-200 hover:scale-110 hover:bg-white"
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
      <CardContent className="space-y-3 p-3 sm:p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-600">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <Link to={`/products/${product.id}`}>
          <h3 className="min-h-[2.5rem] text-sm font-semibold text-slate-900 transition-colors hover:text-teal-600 sm:min-h-[3rem] sm:text-base">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <div className="flex items-center gap-0.5 text-teal-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                  i < Math.floor(product.averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span>
            {product.averageRating > 0
              ? product.averageRating.toFixed(1)
              : 'No reviews'}
          </span>
          {product.totalReviews > 0 && (
            <span className="text-[11px] text-gray-400">
              ({product.totalReviews})
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900 sm:text-2xl">
            ${displayPrice.toFixed(2)}
          </span>
          {discountPercent > 0 && (
            <span className="text-xs text-gray-400 line-through sm:text-sm">
              ${product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Stock Status */}
        {product.stock > 0 ? (
          <Badge
            variant="outline"
            className="border-green-500 text-[11px] font-semibold uppercase tracking-wide text-green-600"
          >
            ✓ In Stock
          </Badge>
        ) : (
          <Badge
            variant="outline"
            className="border-red-500 text-[11px] font-semibold uppercase tracking-wide text-red-600"
          >
            Out of Stock
          </Badge>
        )}
      </CardContent>

      {/* Action Buttons */}
      <CardFooter className="flex flex-col gap-2 border-t border-slate-100 p-3 pt-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className="h-11 w-full flex-1 rounded-full bg-teal-500 text-sm font-semibold text-white shadow-md transition-all duration-200 hover:bg-teal-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:h-11"
        >
          {isAddingToCart ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          asChild
          variant="outline"
          className="h-11 w-full rounded-full border border-slate-200 text-sm font-semibold transition-colors hover:border-teal-500 hover:text-teal-600 sm:w-auto"
        >
          <Link
            to={`/products/${product.id}`}
            className="flex h-full w-full items-center justify-center"
          >
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
