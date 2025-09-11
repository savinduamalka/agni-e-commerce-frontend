'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const productData = await getProductById(id);
        setProduct(productData);
        if (productData.images.length > 0) {
          setSelectedImage(productData.images[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        toast.error(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePrevious = () => {
    if (!product) return;
    const newIndex = currentIndex === 0 ? product.images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(product.images[newIndex]);
  };

  const handleNext = () => {
    if (!product) return;
    const newIndex = currentIndex === product.images.length - 1 ? 0 : currentIndex + 1;
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

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-1">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="flex justify-center gap-2 mt-4">
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
              <Skeleton className="w-20 h-20 rounded-lg" />
            </div>
          </div>
          <div className="md:col-span-1 space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-10 w-1/2" />
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
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold text-destructive">Error</h2>
          <p className="mt-4 text-muted-foreground">{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <p className="mt-4 text-muted-foreground">
            The product you are looking for does not exist.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  const productUrl = window.location.href;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="relative w-full h-[400px] border rounded-lg overflow-hidden">
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
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                className="h-8 w-8"
                disabled={product.images.length <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedImage(img);
                    setCurrentIndex(index);
                  }}
                  className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === img ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                className="h-8 w-8"
                disabled={product.images.length <= 1}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{product.name}</h1>
              <div className="flex items-center mt-2">
                <a href="#reviews" className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(product.averageRating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-muted-foreground hover:underline">
                    ({product.totalReviews} reviews)
                  </span>
                </a>
              </div>
            </div>

            <p className="text-3xl font-bold">
              ${product.price.toFixed(2)}
              {product.isOffer && product.labeledPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through ml-2">
                  ${product.labeledPrice.toFixed(2)}
                </span>
              )}
            </p>

            <p className="text-muted-foreground">{product.description}</p>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-lg font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={incrementQuantity}
                  disabled={!product || quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product || product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <Share2 className="mr-2 h-4 w-4" /> Share
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto">
                  <div className="flex gap-2 p-2">
                    <FacebookShareButton url={productUrl}>
                      <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <EmailShareButton url={productUrl}>
                      <EmailIcon size={32} round />
                    </EmailShareButton>
                    <WhatsappShareButton url={productUrl}>
                      <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(productUrl);
                        toast.success('Link copied to clipboard!');
                      }}
                    >
                      <LinkIcon className="h-5 w-5" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Separator />

            <div>
              <p>
                <span className="font-semibold">Brand:</span> {product.brand}
              </p>
              <p>
                <span className="font-semibold">Category:</span>{' '}
                {product.category.name}
              </p>
              <p
                className={`font-semibold ${
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs / Review Section */}
        <div id="reviews" className="mt-12">
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
      <Footer />
    </>
  );
};

export default ProductDetailPage;
