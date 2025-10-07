import { useState, useEffect, useCallback, type SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Star,
  Heart,
  ArrowRight,
  Truck,
  Shield,
  Headphones,
  Search as SearchIcon,
  Sparkles,
  Tag,
} from 'lucide-react';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category, Product } from '@/lib/types';
import { toast } from 'sonner';
import { useCart } from '../../context/CartContext';
import banner1 from '@/assets/banner1.png';
import banner2 from '@/assets/banner2.png';
import banner3 from '@/assets/banner3.png';

const createPlaceholderDataUri = (text: string, size = 200) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>
      <rect width='100%' height='100%' fill='#f3f4f6'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='${Math.max(
        14,
        size / 8
      )}' fill='#9ca3af'>${text}</text>
    </svg>
  `)}`;

const FALLBACK_PRODUCT_IMAGE = createPlaceholderDataUri('Product image', 320);
const FALLBACK_CATEGORY_IMAGE = createPlaceholderDataUri('Category', 160);
const FALLBACK_HERO_IMAGE = createPlaceholderDataUri('Agni Store', 560);

const HERO_SLIDES = [
  {
    id: 'grand-opening',
    title: 'Grand opening specials are live',
    subtitle:
      'Celebrate our new space with exclusive bundles and early bird savings.',
    image: banner1,
    ctaLabel: 'Shop the launch edit',
    ctaHref: '/products',
  },
  {
    id: 'lifestyle-refresh',
    title: 'Refresh your workspace & routine',
    subtitle:
      'Minimal gear, mindful stationery, and everyday tech that keeps pace.',
    image: banner2,
    ctaLabel: 'Browse lifestyle picks',
    ctaHref: '/categories',
  },
  {
    id: 'member-perks',
    title: 'Member-only offers drop weekly',
    subtitle:
      'Unlock bonus points, surprise drops, and free delivery on featured lines.',
    image: banner3,
    ctaLabel: 'See weekly offers',
    ctaHref: '/offers',
  },
];

const setFallbackImage = (
  event: SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc: string
) => {
  const img = event.currentTarget;
  if (img.src === fallbackSrc) {
    return;
  }
  img.onerror = null;
  img.src = fallbackSrc;
};

function Search() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    navigate(`/products?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="flex items-center gap-3 rounded-full border border-slate-200 bg-white p-2 shadow-sm"
    >
      <SearchIcon className="ml-1 h-5 w-5 text-slate-400" />
      <Input
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search for products, brands, and more"
        className="h-10 flex-1 border-none bg-transparent px-0 text-sm focus-visible:ring-0"
      />
      <Button
        type="submit"
        className="rounded-full bg-teal-600 px-5 text-sm font-semibold text-white hover:bg-teal-700"
      >
        Search
      </Button>
    </form>
  );
}

function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="pt-10 pb-16 sm:pt-12">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <Badge className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-50 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-teal-700">
          <Sparkles className="h-4 w-4" />
          Fresh arrivals weekly
        </Badge>
        <h1 className="text-4xl font-semibold leading-tight text-slate-900 md:text-5xl">
          Your trusted destination
        </h1>
        <p className="mt-4 text-base text-slate-600 md:text-lg">
          for quality products at competitive prices. Shop with confidence.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/products">
            <Button className="rounded-full bg-teal-600 px-7 py-2 text-sm font-semibold text-white hover:bg-teal-700">
              Browse collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/offers">
            <Button
              variant="outline"
              className="rounded-full border-teal-600 px-7 py-2 text-sm font-semibold text-teal-600 hover:bg-teal-50"
            >
              View offers
            </Button>
          </Link>
        </div>
        <div className="mt-8 w-full max-w-xl">
          <Search />
        </div>
      </div>

      <div className="relative mx-auto mt-12 w-full max-w-5xl">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-lg">
          <div className="relative aspect-[16/7] w-full">
            {HERO_SLIDES.map((slide, index) => (
              <article
                key={slide.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === currentSlide
                    ? 'opacity-100 blur-0'
                    : 'pointer-events-none opacity-0 blur-sm'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                  onError={(event) =>
                    setFallbackImage(event, FALLBACK_HERO_IMAGE)
                  }
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-left text-white md:p-12">
                  <p className="text-xs uppercase tracking-[0.3em] text-teal-200">
                    Agni Picks
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                    {slide.title}
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-white/85 md:text-base">
                    {slide.subtitle}
                  </p>
                  <Link
                    to={slide.ctaHref}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-white"
                  >
                    {slide.ctaLabel}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="absolute -bottom-10 left-1/2 flex -translate-x-1/2 gap-2">
          {HERO_SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 w-8 rounded-full transition-colors ${
                index === currentSlide
                  ? 'bg-teal-600'
                  : 'bg-slate-300 hover:bg-teal-400'
              }`}
              aria-label={`Show slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <div className="flex items-center gap-3 rounded-2xl border border-teal-100 bg-white px-6 py-4 text-sm text-slate-600 shadow-sm">
          <span className="font-semibold text-teal-600">Same-day dispatch</span>
          <span className="hidden h-4 w-px bg-slate-200 md:block" />
          <span>Order before 2PM and we ship today</span>
        </div>
      </div>
    </section>
  );
}

function ServiceHighlights() {
  const items = [
    {
      icon: Truck,
      title: 'Fast delivery',
      description: 'Trackable shipping across the island',
    },
    {
      icon: Shield,
      title: 'Protected payments',
      description: 'Secure gateways with buyer protection',
    },
    {
      icon: Headphones,
      title: 'Thoughtful support',
      description: 'Dedicated agents by chat or phone',
    },
  ];

  return (
    <section className="grid gap-4 rounded-3xl border border-slate-200 bg-slate-50/60 p-6 md:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.title}
            className="flex items-start gap-4 rounded-2xl bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-100 text-teal-700">
              <Icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-semibold text-slate-900">{item.title}</p>
              <p className="text-sm text-slate-600">{item.description}</p>
            </div>
          </div>
        );
      })}
    </section>
  );
}

function OfferProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();

  const primaryImage = product.images?.[0] ?? FALLBACK_PRODUCT_IMAGE;
  const labeledPrice = Number(product.labeledPrice) || 0;
  const discountPercentage =
    product.isOffer && labeledPrice > product.price
      ? Math.round(((labeledPrice - product.price) / labeledPrice) * 100)
      : 0;
  const averageRating = Number(product.averageRating) || 0;
  const totalReviews = Number(product.totalReviews) || 0;

  const handleAddToCart = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (product.stock === 0) {
      toast.error('Product is out of stock');
      return;
    }

    setIsAddingToCart(true);
    const success = await addToCart(product.id, 1);
    if (success) {
      toast.success(`${product.name} added to cart`);
    }
    setIsAddingToCart(false);
  };

  const toggleWishlist = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    setIsWishlisted((prev) => {
      const next = !prev;
      toast.success(next ? 'Added to wishlist' : 'Removed from wishlist');
      return next;
    });
  };

  return (
    <Card className="group flex h-full flex-col overflow-hidden border border-slate-200 shadow-none transition-transform duration-300 hover:-translate-y-1 hover:border-teal-500 hover:shadow-md">
      <div className="relative overflow-hidden bg-white">
        <Link to={`/products/${product.id}`} className="block">
          <div className="flex aspect-square items-center justify-center">
            <img
              src={primaryImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={(event) =>
                setFallbackImage(event, FALLBACK_PRODUCT_IMAGE)
              }
            />
          </div>
          {discountPercentage > 0 && (
            <div className="absolute left-3 top-3">
              <Badge className="rounded-full bg-teal-600 px-3 py-1 text-xs font-semibold text-white">
                -{discountPercentage}%
              </Badge>
            </div>
          )}
        </Link>
        <div className="absolute right-3 top-3 opacity-0 transition-all duration-300 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleWishlist}
            className={`${
              isWishlisted
                ? 'bg-teal-600 text-white hover:bg-teal-700'
                : 'bg-white text-slate-600 hover:bg-teal-50'
            } rounded-full shadow-sm`}
          >
            <Heart
              className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`}
            />
          </Button>
        </div>
      </div>
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        {product.brand && (
          <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
            {product.brand}
          </p>
        )}
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="line-clamp-2 min-h-[2.6rem] font-semibold text-slate-900 transition-colors hover:text-teal-600">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center gap-[2px] text-yellow-400">
            {[...Array(5)].map((_, index) => (
              <Star
                key={index}
                className={`h-4 w-4 ${
                  index < Math.round(averageRating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-slate-500">({totalReviews})</span>
        </div>
        <div className="mt-auto space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span className="text-xl font-semibold text-slate-900 sm:text-2xl">
              ${product.price.toFixed(2)}
            </span>
            {discountPercentage > 0 && (
              <span className="text-xs text-slate-500 line-through sm:text-sm">
                ${labeledPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={handleAddToCart}
            disabled={product.stock === 0 || isAddingToCart}
            className="h-11 w-full flex-1 rounded-full bg-teal-600 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isAddingToCart ? (
              'Adding…'
            ) : product.stock === 0 ? (
              'Out of stock'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Add to cart
              </span>
            )}
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full flex-1 rounded-full border border-slate-200 text-sm font-semibold transition-colors hover:border-teal-500 hover:text-teal-600"
          >
            <Link
              to={`/products/${product.id}`}
              className="flex h-full w-full items-center justify-center"
            >
              View
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ShopByCategory() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/categories`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const categoriesData = data.data?.categories;
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          throw new Error('Unexpected response format');
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Something went wrong';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="space-y-6 py-12">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-slate-900">
            Shop by category
          </h2>
          <p className="text-slate-600">
            Explore new picks hand-picked by our team
          </p>
        </div>
        <Link to="/categories">
          <Button
            variant="outline"
            className="rounded-full border-teal-600 px-6 text-sm font-semibold text-teal-600 hover:bg-teal-50"
          >
            View all
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {[...Array(6)].map((_, index) => (
            <Card
              key={index}
              className="flex aspect-square flex-col items-center justify-center border border-slate-200"
            >
              <Skeleton className="h-16 w-16 rounded-full" />
              <Skeleton className="mt-4 h-4 w-24" />
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <p className="mt-2 text-sm text-red-500">
            Please try again in a moment.
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Categories will appear here once they are ready.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {categories.slice(0, 12).map((category) => (
            <Link key={category._id} to={`/categories/${category._id}`}>
              <Card className="group flex aspect-square flex-col items-center justify-center gap-4 border border-slate-200 transition-all hover:-translate-y-1 hover:border-teal-500 hover:shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-slate-100">
                  <img
                    src={category.image || FALLBACK_CATEGORY_IMAGE}
                    alt={category.name}
                    className="h-full w-full object-cover"
                    onError={(event) =>
                      setFallbackImage(event, FALLBACK_CATEGORY_IMAGE)
                    }
                  />
                </div>
                <h3 className="text-sm font-medium text-slate-700 group-hover:text-teal-600">
                  {category.name}
                </h3>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

function HotOffers() {
  const [offers, setOffers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/products?isOffer=true&limit=8`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      if (Array.isArray(data.products)) {
        setOffers(data.products);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Something went wrong';
      setError(message);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadOffers();
  }, [loadOffers]);

  return (
    <section className="space-y-8 py-12">
      <div className="flex flex-col gap-2 text-center">
        <h2 className="text-3xl font-semibold text-slate-900">
          Hot offers right now
        </h2>
        <p className="text-slate-600">
          Handpicked deals refreshed daily—grab them before they're gone.
        </p>
      </div>
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, index) => (
            <Card
              key={index}
              className="overflow-hidden border border-slate-200"
            >
              <Skeleton className="block aspect-square" />
              <div className="space-y-3 p-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
          <p className="text-sm font-semibold text-red-600">{error}</p>
          <p className="mt-2 text-sm text-red-500">Please try again shortly.</p>
          <div className="mt-4">
            <Button variant="outline" onClick={loadOffers}>
              Try again
            </Button>
          </div>
        </div>
      ) : offers.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          <Tag className="mx-auto mb-3 h-6 w-6 text-slate-400" />
          Fresh offers will appear here soon.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {offers.map((product) => (
              <OfferProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/offers">
              <Button className="rounded-full bg-teal-600 px-6 text-sm font-semibold text-white hover:bg-teal-700">
                View all offers
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </>
      )}
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="bg-white text-slate-900">
      <Header />
      <main className="mx-auto w-full max-w-[96rem] px-6 pb-20 pt-6 md:px-10 md:pt-8 lg:px-16">
        <HeroSection />
        <div className="h-10" />
        <ServiceHighlights />
        <ShopByCategory />
        <HotOffers />
      </main>
      <Footer />
    </div>
  );
}
