import { useState, useEffect } from 'react';
import { ShoppingCart, Star, Heart, Eye, ArrowRight, TrendingUp, Gift, Truck, Shield, Headphones } from 'lucide-react';
import Header from '@/components/shared/header';

// Search Component
function Search() {
  return (
    <div className="relative max-w-2xl w-full">
      <input
        type="text"
        placeholder="Search for products, brands and more..."
        className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full focus:border-blue-500 focus:outline-none shadow-lg"
      />
      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
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
              <button className="bg-white text-gray-800 px-4 py-2 md:px-8 md:py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors flex items-center space-x-2 text-sm md:text-base">
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
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
        <div
          key={index}
          className={`${offer.bg} rounded-2xl p-6 text-white transform hover:scale-105 transition-transform cursor-pointer`}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg md:text-xl mb-1">{offer.title}</h3>
              <p className="opacity-90 text-xs md:text-sm">{offer.subtitle}</p>
              <div className="mt-3 text-xl md:text-2xl font-black">{offer.discount}</div>
            </div>
            <div className="text-3xl md:text-4xl opacity-70">{offer.icon}</div>
          </div>
        </div>
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
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow group overflow-hidden">
      <div className="relative overflow-hidden">
        <div className="bg-gray-100 h-48 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
          {product.image}
        </div>
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2 rounded-full transition-colors ${
              isLiked ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart className="w-4 h-4" />
          </button>
          <button className="p-2 bg-white/80 text-gray-600 rounded-full hover:bg-blue-500 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>
        {product.discount && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            -{product.discount}%
          </div>
        )}
      </div>
      
      <div className="p-4">
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
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-gray-800">${product.price}</span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">${product.originalPrice}</span>
            )}
          </div>
          <button className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors">
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
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
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-50 rounded-2xl p-8 mb-12">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        return (
          <div key={index} className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.desc}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function HomePage() {
  const trendingProducts = [
    { id: 1, name: "Wireless Headphones", price: 79.99, originalPrice: 99.99, rating: 4, reviews: 124, image: "🎧", discount: 20 },
    { id: 2, name: "Smart Watch", price: 199.99, originalPrice: 299.99, rating: 5, reviews: 89, image: "⌚", discount: 33 },
    { id: 3, name: "Laptop Backpack", price: 49.99, rating: 4, reviews: 67, image: "🎒" },
    { id: 4, name: "Bluetooth Speaker", price: 39.99, originalPrice: 59.99, rating: 4, reviews: 156, image: "🔊", discount: 33 },
    { id: 5, name: "Fitness Tracker", price: 89.99, rating: 5, reviews: 203, image: "📱" },
    { id: 6, name: "Gaming Mouse", price: 29.99, originalPrice: 49.99, rating: 4, reviews: 78, image: "🖱️", discount: 40 },
    { id: 7, name: "USB-C Hub", price: 34.99, rating: 4, reviews: 92, image: "🔌" },
    { id: 8, name: "Desk Organizer", price: 24.99, originalPrice: 34.99, rating: 5, reviews: 45, image: "📚", discount: 29 }
  ];

  const categories = [
    { name: "Electronics", icon: "📱", count: "2.5k+ items" },
    { name: "Fashion", icon: "👕", count: "1.8k+ items" },
    { name: "Home & Garden", icon: "🏠", count: "950+ items" },
    { name: "Sports", icon: "⚽", count: "650+ items" },
    { name: "Books", icon: "📚", count: "1.2k+ items" },
    { name: "Beauty", icon: "💄", count: "800+ items" }
  ];

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
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 md:p-6 text-center hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition-transform">{category.icon}</div>
                <h3 className="font-semibold text-gray-800 mb-1 text-sm md:text-base">{category.name}</h3>
                <p className="text-xs md:text-sm text-gray-500">{category.count}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <Features />

        {/* Trending Products */}
        <section className="mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 flex items-center mb-4 md:mb-0">
              <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
              Trending Products
            </h2>
            <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated with Our Latest Offers</h2>
          <p className="text-lg md:text-xl opacity-90 mb-8">Get exclusive deals and new product updates directly to your inbox</p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-t-full sm:rounded-l-full sm:rounded-r-none text-gray-800 focus:outline-none mb-2 sm:mb-0"
            />
            <button className="bg-yellow-400 text-gray-800 px-8 py-3 rounded-b-full sm:rounded-r-full sm:rounded-l-none font-semibold hover:bg-yellow-300 transition-colors">
              Subscribe
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-4">Agni Store</h3>
              <p className="text-gray-300">Your trusted partner for all shopping needs. Quality products, great prices, exceptional service.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Shipping</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white">Electronics</a></li>
                <li><a href="#" className="hover:text-white">Fashion</a></li>
                <li><a href="#" className="hover:text-white">Home & Garden</a></li>
                <li><a href="#" className="hover:text-white">Sports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <button className="bg-blue-600 p-2 rounded-full hover:bg-blue-700">📘</button>
                <button className="bg-pink-600 p-2 rounded-full hover:bg-pink-700">📷</button>
                <button className="bg-blue-400 p-2 rounded-full hover:bg-blue-500">🐦</button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Agni Store. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}