
import { useCart } from '../../context/CartContext';
import CartItemCard from '../../components/cart/CartItemCard';
import CartSummary from '../../components/cart/CartSummary';
import MobileCartHeader from '../../components/cart/MobileCartHeader';
import MobileCheckoutBar from '../../components/cart/MobileCheckoutBar';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import Header from '../../components/shared/header';
import Footer from '../../components/shared/footer';

const CartPage = () => {
  const { cart, loading } = useCart();

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading cart...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
        <>
        <Header/>
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 px-4">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
      <Footer/>
      </>
    );
  }

  return (
    <>
    <Header/>
    <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl cart-container pb-20 sm:pb-8">
      <MobileCartHeader itemCount={cart.totalItems} />
      <h1 className="hidden sm:block text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Your Cart</h1>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-8">
        <div className="lg:col-span-2 order-2 lg:order-1">
          <div className="space-y-3 sm:space-y-4">
            {cart.items.map((item) => (
              <CartItemCard key={item.productId} item={item} />
            ))}
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="sticky top-4">
            <CartSummary cart={cart} />
          </div>
        </div>
      </div>
      <MobileCheckoutBar cart={cart} />
    </div>
    <Footer/>
    </>
  );
};

export default CartPage;
