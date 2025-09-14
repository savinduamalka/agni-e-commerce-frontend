import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star, Heart, Eye, ArrowRight, TrendingUp, Gift, Truck, Shield, Headphones } from 'lucide-react';
import Header from '@/components/shared/header';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Footer from '@/components/shared/footer';
import type { Category } from '@/lib/types';

// Search Component
function Search() {
  return (
    <div className="relative max-w-2xl w-full">
      <Input
        type="text"
        placeholder="Search for products, brands and more..."
        className="w-full px-6 py-4 text-lg rounded-full focus:outline-none shadow-lg"
      />
      <Button variant="default" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3 rounded-full transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </Button>
    </div>
  );
}

// Hero Banner Component
function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      title: "Summer Sale is Here!",
      subtitle: "Up to 70% off on all electronics",
      bg: "bg-gradient-to-r from-orange-400 to-pink-500",
      image: "📱"
    },
    {
      title: "Fashion Week Special",
      subtitle: "New arrivals with 50% discount",
      bg: "bg-gradient-to-r from-purple-500 to-indigo-600",
      image: "👗"
    },
    {
      title: "Home & Garden Sale",
      subtitle: "Transform your space with 40% off",
      bg: "bg-gradient-to-r from-green-400 to-blue-500",
      image: "🏡"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-12">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 ${slide.bg} transition-transform duration-500 ${
            index === currentSlide ? 'translate-x-0' : 
            index < currentSlide ? '-translate-x-full' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between h-full px-6 md:px-12">
            <div className="text-white space-y-2 md:space-y-4">
              <h2 className="text-2xl md:text-5xl font-bold">{slide.title}</h2>
              <p className="text-base md:text-xl opacity-90">{slide.subtitle}</p>
              <Button variant="secondary" size="lg" className="rounded-full">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
            <div className="text-6xl md:text-9xl opacity-20">{slide.image}</div>
          </div>
        </div>
      ))}
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

// Offer Banners Component
function OfferBanners() {
  const offers = [
    {
      title: "Flash Sale",
      subtitle: "24 Hours Only!",
      discount: "80% OFF",
      bg: "bg-gradient-to-br from-red-500 to-orange-500",
      icon: "⚡"
    },
    {
      title: "Free Shipping",
      subtitle: "On orders over $50",
      discount: "FREE",
      bg: "bg-gradient-to-br from-blue-500 to-cyan-500",
      icon: "🚚"
    },
    {
      title: "New User",
      subtitle: "Special discount",
      discount: "25% OFF",
      bg: "bg-gradient-to-br from-green-500 to-emerald-500",
      icon: "🎁"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
      {offers.map((offer, index) => (
        <Card key={index} className={`${offer.bg} text-white transform hover:scale-105 transition-transform cursor-pointer`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg md:text-xl mb-1">{offer.title}</CardTitle>
                <p className="opacity-90 text-xs md:text-sm">{offer.subtitle}</p>
                <div className="mt-3 text-xl md:text-2xl font-black">{offer.discount}</div>
              </div>
              <div className="text-3xl md:text-4xl opacity-70">{offer.icon}</div>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

type Product = {
    id: number;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    image: string;
    discount?: number;
  };

// Product Card Component
function ProductCard({ product }: { product: Product }) {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <Card className="group overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden">
          <div className="bg-gray-100 h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
            {product.image}
          </div>
          <div className="absolute top-3 right-3 flex flex-col space-y-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={`rounded-full ${
                isLiked ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <Heart className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="bg-white/80 text-gray-600 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
              <Eye className="w-4 h-4" />
            </Button>
          </div>
          {product.discount && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              -{product.discount}%
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
        <div className="flex items-center space-x-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center space-x-2">
          <span className="text-xl font-bold text-gray-800">${product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
          )}
        </div>
        <Button size="icon">
          <ShoppingCart className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

// Features Section
function Features() {
  const features = [
    { icon: Truck, title: "Free Shipping", desc: "On orders over $50" },
    { icon: Shield, title: "Secure Payment", desc: "100% protected" },
    { icon: Headphones, title: "24/7 Support", desc: "Always here to help" },
    { icon: Gift, title: "Gift Cards", desc: "Perfect for everyone" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card key={index} className="text-center">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
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
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/categories`);
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const categoriesData = data.data.categories;
        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          throw new Error("Unexpected data format from API");
        }
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold">Shop by Category</h2>
        <Link to="/categories">
          <Button variant="outline" className="rounded-full">
            <span>View All</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
      {loading ? (
        <div className="text-center">Loading categories...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((category) => (
            <Card key={category._id} className="flex flex-col items-center justify-center p-4 aspect-square text-center hover:bg-gray-50 transition-colors cursor-pointer">
              <img src={category.image} alt={category.name} className="w-16 h-16 object-contain mb-2" />
              <h3 className="font-semibold text-gray-700">{category.name}</h3>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// Featured Products Component
const featuredProducts: Product[] = [
  { id: 1, name: "Wireless Headphones", price: 79.99, originalPrice: 99.99, rating: 4, reviews: 124, image: "🎧", discount: 20 },
  { id: 2, name: "Smart Watch", price: 199.99, originalPrice: 299.99, rating: 5, reviews: 89, image: "⌚", discount: 33 },
  { id: 3, name: "Laptop Backpack", price: 49.99, rating: 4, reviews: 67, image: "🎒" },
  { id: 4, name: "Bluetooth Speaker", price: 39.99, originalPrice: 59.99, rating: 4, reviews: 156, image: "🔊", discount: 33 },
  { id: 5, name: "Fitness Tracker", price: 89.99, rating: 5, reviews: 203, image: "📱" },
  { id: 6, name: "Gaming Mouse", price: 29.99, originalPrice: 49.99, rating: 4, reviews: 78, image: "🖱️", discount: 40 },
  { id: 7, name: "USB-C Hub", price: 34.99, rating: 4, reviews: 92, image: "🔌" },
  { id: 8, name: "Desk Organizer", price: 24.99, originalPrice: 34.99, rating: 5, reviews: 45, image: "📚", discount: 29 }
];

export default function HomePage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4">Welcome to Agni Store</h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            Your one-stop shop for everything you need.
          </p>
          <div className="flex justify-center mb-12">
            <Search />
          </div>
        </section>

        {/* Hero Banner */}
        <HeroBanner />

        {/* Offer Banners */}
        <OfferBanners />

        {/* Categories Section */}
        <ShopByCategory />

        {/* Features */}
        <Features />

        {/* Trending Products */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              Trending Products
            </h2>
            <Button variant="link" className="text-blue-600 hover:text-blue-700 font-semibold">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}