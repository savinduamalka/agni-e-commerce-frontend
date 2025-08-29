'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Star,
  Truck,
  Share2,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Toaster, toast } from 'sonner';
import type { Product } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import ReactImageMagnify from 'react-image-magnify';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share';

interface ProductResponse {
  message: string;
  product: Product;
}

const getProductById = async (id: string): Promise<ProductResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/products/${id}`
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || 'An error occurred while fetching the product.'
    );
  }
  return response.json();
};

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getProductById(id);
        setProduct(data.product);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handlePrevImage = () => {
    if (!product) return;
    setCurrentImageIndex(
      (prevIndex) =>
        (prevIndex - 1 + product.images.length) % product.images.length
    );
  };

  const handleNextImage = () => {
    if (!product) return;
    setCurrentImageIndex(
      (prevIndex) => (prevIndex + 1) % product.images.length
    );
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Skeleton for Image */}
            <div className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-96 w-full"></div>
              <div className="flex justify-center mt-4 space-x-2">
                <div className="bg-gray-200 h-16 w-16 rounded-md"></div>
                <div className="bg-gray-200 h-16 w-16 rounded-md"></div>
                <div className="bg-gray-200 h-16 w-16 rounded-md"></div>
              </div>
            </div>
            {/* Skeleton for Details */}
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-20 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3"></div>
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
        <div className="container mx-auto text-center py-20">
          <h2 className="text-2xl font-bold text-red-500">Error</h2>
          <p>{error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <div className="container mx-auto text-center py-20">
          <h2 className="text-2xl font-bold">Product not found</h2>
        </div>
        <Footer />
      </>
    );
  }

  const discountPercentage =
    product.labeledPrice > product.price
      ? Math.round(
          ((product.labeledPrice - product.price) / product.labeledPrice) * 100
        )
      : 0;

  const productUrl = window.location.href;
  const shareTitle = `Check out this product: ${product?.name}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(productUrl);
    toast.success('Link copied to clipboard!');
  };

  return (
    <>
      <Toaster richColors />
      <Header />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2 gap-x-8">
            {/* Image Gallery */}
            <div className="p-4">
              <div className="relative group">
                <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: product.name,
                      isFluidWidth: true,
                      src: product.images[currentImageIndex],
                    },
                    largeImage: {
                      src: product.images[currentImageIndex],
                      width: 1200,
                      height: 1200,
                    },
                    enlargedImageContainerDimensions: {
                      width: '150%',
                      height: '120%',
                    },
                    isHintEnabled: true,
                  }}
                />

                {product.images.length > 1 && (
                  <>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={handlePrevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={handleNextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex justify-center mt-4 space-x-2 overflow-x-auto">
                {product.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    className={`h-16 w-16 object-cover rounded-md cursor-pointer border-2 ${
                      index === currentImageIndex
                        ? 'border-primary'
                        : 'border-transparent'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  />
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="p-6 flex flex-col">
              <CardHeader className="p-0">
                <div className="flex justify-between items-start">
                  {product.brand && (
                    <p className="text-sm text-muted-foreground">
                      {product.brand}
                    </p>
                  )}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto">
                      <div className="flex gap-2">
                        <FacebookShareButton url={productUrl} title={shareTitle}>
                          <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton url={productUrl} title={shareTitle}>
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton url={productUrl} title={shareTitle}>
                          <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <EmailShareButton url={productUrl} subject={shareTitle}>
                          <EmailIcon size={32} round />
                        </EmailShareButton>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleCopyLink}
                          className="rounded-full"
                        >
                          <LinkIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                <CardTitle className="text-3xl font-bold tracking-tight mt-2">
                  {product.name}
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-5 w-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    (5.0)
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-0 mt-4 flex-grow">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {discountPercentage > 0 && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.labeledPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {discountPercentage > 0 && (
                  <Badge variant="destructive" className="mt-2">
                    {discountPercentage}% OFF
                  </Badge>
                )}

                <p className="text-muted-foreground mt-4">
                  {product.description}
                </p>

                <div className="mt-6">
                  <h4 className="font-semibold">Availability</h4>
                  <p
                    className={`text-sm ${
                      product.stock > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} items in stock`
                      : 'Out of Stock'}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4 text-sm text-muted-foreground">
                  <Truck className="h-5 w-5" />
                  <span>Free standard shipping</span>
                </div>
              </CardContent>

              <CardFooter className="p-0 mt-6">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              </CardFooter>
            </div>
          </div>

          {/* Specifications and Features */}
          <div className="px-6 py-8">
            <Separator />
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Specifications</h3>
                {product.specifications &&
                Object.keys(product.specifications).length > 0 ? (
                  <Table>
                    <TableBody>
                      {Object.entries(product.specifications).map(
                        ([key, value]) => (
                          <TableRow key={key}>
                            <TableCell className="font-medium capitalize">
                              {key}
                            </TableCell>
                            <TableCell>{String(value)}</TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                ) : (
                  <p>No specifications available.</p>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Features</h3>
                {product.features && product.features.length > 0 ? (
                  <ul className="list-disc list-inside space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No features listed.</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
