import { useCart } from '@/context/CartContext';
import CartItemCard from '@/components/cart/CartItemCard';
import CartSummary from '@/components/cart/CartSummary';
import MobileCartHeader from '@/components/cart/MobileCartHeader';
import MobileCheckoutBar from '@/components/cart/MobileCheckoutBar';
import Header from '@/components/shared/header';
import Footer from '@/components/shared/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

// Loading Skeleton Component
function CartLoadingSkeleton() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 py-8 sm:py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <Skeleton className="h-10 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-24 w-24 rounded-lg" />
                      <div className="flex-1 space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-5 w-24" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div>
              <Card>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CartPage() {
  const { cart, loading } = useCart();

  if (loading) {
    return <CartLoadingSkeleton />;
  }

  // Empty Cart State
  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto text-center">
              <div className="mb-8 flex justify-center">
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-16 w-16 text-gray-400" />
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Your Cart is Empty
              </h1>

              <p className="text-gray-600 mb-8">
                Looks like you haven't added anything yet. Start exploring our
                collection!
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  className="bg-[var(--color-teal-500)] hover:bg-[var(--color-teal-600)] text-white"
                >
                  <Link to="/products">
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Start Shopping
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/offers">View Offers</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Active Cart State
  const itemCount = cart.totalItems ?? cart.items.length;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      {/* Mobile Header */}
      <div className="lg:hidden">
        <MobileCartHeader itemCount={itemCount} />
      </div>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 sm:py-12 max-w-7xl">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="h-8 w-8 text-[var(--color-teal-500)]" />
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                  Shopping Cart
                </h1>
              </div>
              <Button asChild variant="outline" className="hidden md:flex">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
            <p className="text-gray-600 mt-2">
              {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}{' '}
              in your cart
            </p>
          </div>

          {/* Cart Items + Summary Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => (
                <CartItemCard key={item.productId} item={item} />
              ))}
            </div>

            {/* Cart Summary */}
            <div>
              <CartSummary cart={cart} />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Checkout Bar */}
      <div className="lg:hidden">
        <MobileCheckoutBar cart={cart} />
      </div>

      <Footer />
    </div>
  );
}
