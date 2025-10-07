import { Button } from '../ui/button';
import type { Cart } from '../../lib/cartTypes';

interface MobileCheckoutBarProps {
  cart: Cart;
}

const MobileCheckoutBar = ({ cart }: MobileCheckoutBarProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4 sm:hidden z-50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-lg font-bold">Rs {cart.totalPrice.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">
            {cart.totalItems} items
          </p>
          <p className="text-sm text-green-600">Free shipping</p>
        </div>
      </div>
      <Button className="w-full h-12 text-base font-semibold">
        Proceed to Checkout
      </Button>
    </div>
  );
};

export default MobileCheckoutBar;
