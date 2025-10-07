'use client';

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductCard } from '@/components/shared/ProductCard';
import { ProductCardSkeleton } from '@/components/shared/ProductCardSkeleton';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/lib/types';
import {
  Heart,
  LayoutGrid,
  List,
  Package,
  ShoppingCart,
  Trash2,
  Sparkles,
  MoveRight,
} from 'lucide-react';
import { toast } from 'sonner';

const FALLBACK_IMAGE = '/placeholder-product.svg';

const WishlistListItem = ({ product }: { product: Product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleAddToCart = async () => {
    if (product.stock === 0) {
      toast.error('This product is currently out of stock.');
      return;
    }

    setIsAdding(true);
    const success = await addToCart(product.id, 1);
    setIsAdding(false);
    if (success) {
      toast.success(`${product.name} added to cart`);
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    await toggleWishlist(product);
    setIsRemoving(false);
  };

  const displayedPrice =
    product.isOffer && product.offerPercentage
      ? product.price * (1 - product.offerPercentage / 100)
      : product.price;

  return (
    <div className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-500 hover:shadow-lg md:flex-row md:items-center md:gap-6 md:p-5">
      <Link
        to={`/products/${product.id}`}
        className="flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100 md:h-36 md:w-36"
      >
        <img
          src={product.images?.[0] || FALLBACK_IMAGE}
          alt={product.name}
          className="h-28 w-28 object-cover md:h-full md:w-full"
          loading="lazy"
          onError={(event) => {
            const img = event.currentTarget;
            if (img.src !== FALLBACK_IMAGE) {
              img.src = FALLBACK_IMAGE;
            }
          }}
        />
      </Link>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            {product.brand && (
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-600">
                {product.brand}
              </p>
            )}
            <Link to={`/products/${product.id}`}>
              <h3 className="text-lg font-semibold text-slate-900 transition-colors hover:text-teal-600">
                {product.name}
              </h3>
            </Link>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
              <span>{product.category?.name ?? 'General'}</span>
              <span className="h-1 w-1 rounded-full bg-slate-300" />
              <span>
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : 'Out of stock'}
              </span>
              {product.offerPercentage && product.offerPercentage > 0 && (
                <Badge className="rounded-full bg-teal-100 px-2.5 py-[3px] text-[11px] font-semibold text-teal-700">
                  Save {product.offerPercentage}%
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-slate-900">
              ${displayedPrice.toFixed(2)}
            </p>
            {product.offerPercentage && product.offerPercentage > 0 && (
              <p className="text-xs text-slate-400 line-through">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
            <Heart className="mr-2 h-4 w-4 text-teal-500" />
            Loved item
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
            <Package className="mr-2 h-4 w-4 text-slate-500" />
            Ships in 2-4 days
          </span>
        </div>

        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <Button
            onClick={handleAddToCart}
            disabled={isAdding || product.stock === 0}
            className="h-11 w-full rounded-full bg-teal-500 text-sm font-semibold text-white shadow-md transition hover:bg-teal-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isAdding ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Move to cart
              </span>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={handleRemove}
            disabled={isRemoving}
            className="h-11 w-full rounded-full border border-slate-200 text-sm font-semibold text-slate-600 transition hover:border-red-300 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isRemoving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Removing...
              </span>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" /> Remove
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const WishlistLoadingSkeleton = () => {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <Skeleton className="h-8 w-32 rounded-full" />
                <Skeleton className="h-12 w-full max-w-xl rounded-3xl" />
                <Skeleton className="h-4 w-full max-w-2xl" />
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3"
                    >
                      <Skeleton className="h-3 w-20 rounded-full" />
                      <Skeleton className="mt-2 h-6 w-16" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Skeleton className="h-11 w-44 rounded-full" />
                <Skeleton className="h-11 w-44 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-9 w-24 rounded-full" />
          </div>

          <Separator className="mb-8 border-slate-100" />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

const WishlistPage = () => {
  const { wishlist, clearWishlist, loading } = useWishlist();
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isClearing, setIsClearing] = useState(false);

  const totalValue = useMemo(
    () => wishlist.reduce((sum, product) => sum + product.price, 0),
    [wishlist]
  );

  const hasItems = wishlist.length > 0;

  const handleClearWishlist = async () => {
    if (!hasItems) {
      return;
    }

    setIsClearing(true);
    try {
      await clearWishlist();
    } finally {
      setIsClearing(false);
    }
  };

  if (loading) {
    return <WishlistLoadingSkeleton />;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <section className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur-sm md:p-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-4">
                <Badge className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-teal-600">
                  <Sparkles className="h-3.5 w-3.5" />
                  Wishlist
                </Badge>
                <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl lg:text-5xl">
                  Your saved items, ready when you are
                </h1>
                <p className="max-w-2xl text-sm text-slate-600 sm:text-base">
                  Keep track of curated finds across devices. Add them to your
                  cart when you&apos;re ready or keep them pinned for
                  inspiration.
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                      Items saved
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      {wishlist.length}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                      Potential total
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      ${totalValue.toFixed(2)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-slate-400">
                      Status
                    </p>
                    <p className="text-2xl font-semibold text-slate-900">
                      {hasItems ? 'Ready to review' : 'Awaiting picks'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  variant="outline"
                  className="h-11 rounded-full border border-slate-200 text-sm font-semibold hover:border-teal-500 hover:text-teal-600"
                >
                  <Link to="/products" className="flex items-center gap-2">
                    Continue shopping <MoveRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  onClick={handleClearWishlist}
                  disabled={!hasItems || isClearing}
                  className="h-11 rounded-full bg-slate-900 text-sm font-semibold text-white shadow-md hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isClearing ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Clearing...
                    </span>
                  ) : (
                    'Clear wishlist'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
                {hasItems ? 'Saved products' : 'No favourites saved yet'}
              </h2>
              <p className="text-sm text-slate-500">
                {hasItems
                  ? 'Switch between list and grid views to curate your selection.'
                  : 'Start adding items to your wishlist to keep them at hand.'}
              </p>
            </div>

            {hasItems && (
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 p-1 shadow-sm backdrop-blur">
                <Button
                  size="icon"
                  variant={view === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setView('grid')}
                  className={`h-9 w-9 rounded-full text-slate-500 transition ${
                    view === 'grid'
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'hover:text-teal-600'
                  }`}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={view === 'list' ? 'default' : 'ghost'}
                  onClick={() => setView('list')}
                  className={`h-9 w-9 rounded-full text-slate-500 transition ${
                    view === 'list'
                      ? 'bg-teal-500 text-white hover:bg-teal-600'
                      : 'hover:text-teal-600'
                  }`}
                  aria-label="List view"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator className="mb-8 border-slate-100" />

          {!hasItems ? (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-slate-200 bg-white/70 px-6 py-16 text-center shadow-inner">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-teal-50 text-teal-500">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900">
                Your wishlist is feeling a little light
              </h3>
              <p className="mt-3 max-w-md text-sm text-slate-600">
                Browse collections and tap the heart icon on products you love.
                We&apos;ll save them all here for a quick return.
              </p>
              <Button
                asChild
                className="mt-6 rounded-full bg-teal-500 px-6 py-2 text-sm font-semibold text-white hover:bg-teal-600"
              >
                <Link to="/products">Discover products</Link>
              </Button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {wishlist.map((product) => (
                <ProductCard
                  key={product._id ?? product.id}
                  product={product}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {wishlist.map((product) => (
                <WishlistListItem
                  key={product._id ?? product.id}
                  product={product}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
};

export default WishlistPage;
