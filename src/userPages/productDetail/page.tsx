'use client';

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  Minus,
  Plus,
  Share2,
  ShoppingCart,
  Star,
  Link as LinkIcon,
  Truck,
  Shield,
  RotateCcw,
  Check,
  Package,
  Clock,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Home,
} from 'lucide-react';
import ReactImageMagnify from 'react-image-magnify';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  WhatsappShareButton,
  WhatsappIcon,
} from 'react-share';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import ProductReviews from '@/components/shared/ProductReviews';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { useCart } from '../../context/CartContext';

const getProductById = async (id: string): Promise<Product> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/products/${id}`
  );
  if (!response.ok) {
    throw new Error('Product not found');
  }
  const data = await response.json();
  return data.product;
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showDetailsSection, setShowDetailsSection] = useState({
    description: true,
    specifications: false,
    shipping: false,
  });
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        return;
      }
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        if (productData.images.length > 0) {
          setSelectedImage(productData.images[0]);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred'
        );
        toast.error(
          err instanceof Error ? err.message : 'Failed to fetch product'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePrevious = () => {
    if (!product) {
      return;
    }
    const newIndex =
      currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  const handleNext = () => {
    if (!product) {
      return;
    }
    const newIndex =
      currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  const handleAddToCart = async () => {
    if (product) {
      const success = await addToCart(product.id, quantity);
      if (success) {
        toast.success(`${quantity} x ${product.name} added to cart!`);
      }
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const toggleSection = (section: keyof typeof showDetailsSection) => {
    setShowDetailsSection((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const discountPercentage =
    product?.isOffer && product?.labeledPrice > product?.price
      ? Math.round(
          ((product.labeledPrice - product.price) / product.labeledPrice) * 100
        )
      : 0;

  if (loading) {
    return (
      <>
        <Header />
        <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
          <div className="container mx-auto px-4 py-6">
            {/* Breadcrumb Skeleton */}
            <Skeleton className="h-4 w-64 mb-6" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Gallery Skeleton */}
              <div className="space-y-4">
                <Skeleton className="w-full aspect-square rounded-2xl" />
                <div className="flex gap-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                  ))}
                </div>
              </div>

              {/* Product Info Skeleton */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-10 w-3/4" />
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-8 w-1/3" />
                </div>

                <Skeleton className="h-24 w-full" />

                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <div className="flex gap-3">
                    <Skeleton className="h-14 flex-1" />
                    <Skeleton className="h-14 w-14" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-red-600" />
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Oops! Something went wrong
            </h2>
            <p className="text-muted-foreground mb-8">{error}</p>
            <Link to="/products">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Home className="mr-2 h-4 w-4" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="h-10 w-10 text-gray-400" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Product Not Found</h2>
            <p className="text-muted-foreground mb-8">
              The product you are looking for does not exist or has been
              removed.
            </p>
            <Link to="/products">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Home className="mr-2 h-4 w-4" />
                Explore Products
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const productUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareTitle = `${product.name} • Agni Online Store`;
  const formattedPrice = `$${product.price.toFixed(2)}`;
  const savingsLine =
    discountPercentage > 0
      ? `Now ${formattedPrice} (${discountPercentage}% off the original price).`
      : `Only ${formattedPrice} right now.`;
  const shareMessage = `${product.name}: ${savingsLine}`;
  const shareFooter = 'Free delivery on orders $50+ and easy 30-day returns.';
  const shareBody = `${shareMessage}\n${shareFooter}\n\nShop now: ${productUrl}`;
  const shareData = {
    title: shareTitle,
    text: `${shareMessage} ${shareFooter}`,
    url: productUrl,
  };
  const facebookShareProps = {
    quote: `${shareMessage} ${shareFooter}`,
    hashtag: '#AgniOnlineStore',
  };
  const canUseWebShare =
    typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleSmartShare = async () => {
    try {
      if (canUseWebShare) {
        await navigator.share(shareData);
        toast.success('Shared using your device options');
      } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareBody);
        toast.success('Sharable product details copied!');
      }
    } catch (error) {
      const isAbort =
        error instanceof DOMException && error.name === 'AbortError';
      if (!isAbort) {
        console.error('Product share failed', error);
        toast.error('We could not share the product. Please try again.');
      }
    }
  };

  const handleCopyShareInfo = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareBody);
        toast.success('Sharable product details copied!');
      }
    } catch (error) {
      console.error('Copy share details failed', error);
      toast.error('Unable to copy right now. Please try again.');
    }
  };

  return (
    <>
      <Header />

      {/* Main Content */}
      <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link
              to="/"
              className="hover:text-teal-600 transition-colors flex items-center gap-1"
            >
              <Home className="h-4 w-4" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to="/products"
              className="hover:text-teal-600 transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              to={`/categories/${product.category.id}`}
              className="hover:text-teal-600 transition-colors"
            >
              {product.category.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium truncate max-w-[200px]">
              {product.name}
            </span>
          </nav>

          {/* Product Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Left Column - Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                <div className="aspect-square">
                  <ReactImageMagnify
                    {...{
                      smallImage: {
                        alt: product.name,
                        isFluidWidth: true,
                        src: selectedImage,
                      },
                      largeImage: {
                        src: selectedImage,
                        width: 1200,
                        height: 1200,
                      },
                      enlargedImageContainerDimensions: {
                        width: '150%',
                        height: '120%',
                      },
                    }}
                  />
                </div>

                {/* Discount Badge */}
                {discountPercentage > 0 && (
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white text-base px-3 py-1">
                      -{discountPercentage}% OFF
                    </Badge>
                  </div>
                )}

                {/* Navigation Arrows for Mobile */}
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevious}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all lg:hidden"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all lg:hidden"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrevious}
                    className="h-10 w-10 shrink-0 hidden lg:flex"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-2 flex-1 overflow-x-auto">
                    {product.images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedImage(img);
                          setCurrentIndex(index);
                        }}
                        className={`relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                          selectedImage === img
                            ? 'border-teal-600 ring-2 ring-teal-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    className="h-10 w-10 shrink-0 hidden lg:flex"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              {/* Brand */}
              <div>
                <Link
                  to={`/products?brand=${encodeURIComponent(
                    product.brand || ''
                  )}`}
                  className="inline-block text-sm font-semibold text-teal-600 hover:text-teal-700 transition-colors"
                >
                  {product.brand}
                </Link>
              </div>

              {/* Product Title */}
              <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-4">
                <a href="#reviews" className="flex items-center gap-2 group">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(product.averageRating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium group-hover:text-teal-600 transition-colors">
                    {product.averageRating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground group-hover:underline">
                    ({product.totalReviews} reviews)
                  </span>
                </a>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-xl p-6 border border-teal-100">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold text-teal-700">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.isOffer && product.labeledPrice > product.price && (
                    <>
                      <span className="text-xl text-gray-500 line-through">
                        ${product.labeledPrice.toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="text-sm">
                        Save $
                        {(product.labeledPrice - product.price).toFixed(2)}
                      </Badge>
                    </>
                  )}
                </div>

                {/* Stock Status */}
                <div className="mt-3 flex items-center gap-2">
                  {product.stock > 0 ? (
                    <>
                      <Check className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">
                        In Stock ({product.stock} available)
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-semibold text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Quantity and Add to Cart */}
              <div className="space-y-4">
                {/* Quantity Selector */}
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-700">
                    Quantity:
                  </span>
                  <div className="flex items-center border-2 border-gray-200 rounded-lg">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 1}
                      className="h-10 w-10 hover:bg-gray-100"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="px-6 text-lg font-semibold min-w-[60px] text-center">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={!product || quantity >= product.stock}
                      className="h-10 w-10 hover:bg-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                    className="flex-1 h-14 text-base font-semibold bg-teal-600 hover:bg-teal-700 text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={toggleWishlist}
                    className={`h-14 w-14 border-2 transition-all ${
                      isWishlisted
                        ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        isWishlisted ? 'fill-current' : ''
                      }`}
                    />
                  </Button>
                </div>
              </div>

              {/* Share Button */}
              <div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full border-2">
                      <Share2 className="mr-2 h-4 w-4" />
                      Share this product
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] rounded-3xl border border-slate-200 p-4 shadow-lg">
                    <div className="space-y-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Share via
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <FacebookShareButton
                          url={productUrl}
                          {...(facebookShareProps as any)}
                        >
                          <FacebookIcon size={44} round />
                        </FacebookShareButton>
                        <WhatsappShareButton
                          url={productUrl}
                          title={`${shareMessage}\n${shareFooter}`}
                          separator="\n"
                        >
                          <WhatsappIcon size={44} round />
                        </WhatsappShareButton>
                        <EmailShareButton
                          url={productUrl}
                          subject={shareTitle}
                          body={shareBody}
                        >
                          <EmailIcon size={44} round />
                        </EmailShareButton>
                      </div>
                      <Button
                        onClick={handleSmartShare}
                        className="w-full rounded-full bg-teal-500 text-sm font-semibold text-white hover:bg-teal-600"
                      >
                        Share using device options
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCopyShareInfo}
                        className="w-full rounded-full border border-slate-200 text-sm font-semibold hover:border-teal-500 hover:text-teal-600"
                      >
                        <LinkIcon className="mr-2 h-4 w-4" /> Copy share message
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <Separator />

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 text-center hover:shadow-md transition-shadow border-gray-200">
                  <Truck className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                  <p className="text-xs font-semibold">Free Delivery</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    On orders $50+
                  </p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow border-gray-200">
                  <Shield className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                  <p className="text-xs font-semibold">Secure Payment</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    100% protected
                  </p>
                </Card>
                <Card className="p-4 text-center hover:shadow-md transition-shadow border-gray-200">
                  <RotateCcw className="h-6 w-6 mx-auto mb-2 text-teal-600" />
                  <p className="text-xs font-semibold">Easy Returns</p>
                  <p className="text-[10px] text-muted-foreground mt-1">
                    30-day policy
                  </p>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="bg-gray-50 rounded-xl p-5 space-y-3 border border-gray-100">
                <div className="flex items-center gap-3 text-sm">
                  <Package className="h-5 w-5 text-gray-500 shrink-0" />
                  <div>
                    <span className="font-semibold">Category:</span>
                    <Link
                      to={`/categories/${product.category.id}`}
                      className="ml-2 text-teal-600 hover:underline"
                    >
                      {product.category.name}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-5 w-5 text-gray-500 shrink-0" />
                  <div>
                    <span className="font-semibold">Delivery:</span>
                    <span className="ml-2 text-muted-foreground">
                      3-5 business days
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <CreditCard className="h-5 w-5 text-gray-500 shrink-0" />
                  <div>
                    <span className="font-semibold">Payment:</span>
                    <span className="ml-2 text-muted-foreground">
                      All major cards accepted
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Accordion */}
          <div className="mt-16 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Product Information</h2>
            <div className="space-y-3">
              {/* Description Section */}
              <Card className="overflow-hidden border-gray-200">
                <button
                  onClick={() => toggleSection('description')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg">
                    Full Description
                  </span>
                  {showDetailsSection.description ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {showDetailsSection.description && (
                  <div className="px-6 py-4 border-t bg-gray-50">
                    <p className="text-muted-foreground leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                )}
              </Card>

              {/* Specifications Section */}
              <Card className="overflow-hidden border-gray-200">
                <button
                  onClick={() => toggleSection('specifications')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg">Specifications</span>
                  {showDetailsSection.specifications ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {showDetailsSection.specifications && (
                  <div className="px-6 py-4 border-t bg-gray-50">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <dt className="font-semibold text-sm text-gray-600">
                          Brand
                        </dt>
                        <dd className="mt-1">{product.brand}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-sm text-gray-600">
                          Category
                        </dt>
                        <dd className="mt-1">{product.category.name}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-sm text-gray-600">
                          Stock Status
                        </dt>
                        <dd className="mt-1">
                          {product.stock > 0 ? (
                            <span className="text-green-600 font-medium">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-red-600 font-medium">
                              Out of Stock
                            </span>
                          )}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-sm text-gray-600">
                          Product ID
                        </dt>
                        <dd className="mt-1 text-muted-foreground text-sm">
                          {product.id}
                        </dd>
                      </div>
                    </dl>
                  </div>
                )}
              </Card>

              {/* Shipping Section */}
              <Card className="overflow-hidden border-gray-200">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-lg">
                    Shipping & Returns
                  </span>
                  {showDetailsSection.shipping ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {showDetailsSection.shipping && (
                  <div className="px-6 py-4 border-t bg-gray-50 space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <Truck className="h-4 w-4 text-teal-600" />
                        Shipping Information
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Free standard shipping on orders over $50</li>
                        <li>Express shipping available at checkout</li>
                        <li>Delivery within 3-5 business days</li>
                        <li>International shipping available</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <RotateCcw className="h-4 w-4 text-teal-600" />
                        Return Policy
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>30-day return policy</li>
                        <li>Items must be in original condition</li>
                        <li>Free return shipping on defective items</li>
                        <li>Refund processed within 5-7 business days</li>
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>

          {/* Reviews Section */}
          <div id="reviews" className="mt-16">
            <ProductReviews
              productId={product.id}
              initialReviews={product.reviews}
              initialPagination={{
                currentPage: 1,
                totalPages: Math.ceil(product.totalReviews / 5),
                totalReviews: product.totalReviews,
                hasNext: product.reviews.length < product.totalReviews,
                hasPrev: false,
                pageSize: 5,
                sortBy: 'createdAt',
                sortOrder: 'desc',
              }}
              averageRating={product.averageRating}
              totalReviews={product.totalReviews}
            />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailPage;
