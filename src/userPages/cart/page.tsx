
import { useCart } from '../../context/CartContext';
import CartItemCard from '../../components/cart/CartItemCard';
import CartSummary from '../../components/cart/CartSummary';
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
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-lg mb-8">Looks like you haven't added anything to your cart yet.</p>
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItemCard key={item.productId} item={item} />
            ))}
          </div>
        </div>
        <div>
          <CartSummary cart={cart} />
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default CartPage;
