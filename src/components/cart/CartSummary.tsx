
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import type { Cart } from '../../lib/cartTypes';

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 pb-3 sm:pb-6">
        <div className="flex justify-between text-sm sm:text-base">
          <span>Subtotal</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm sm:text-base">
          <span>Shipping</span>
          <span className="text-green-600">Free</span>
        </div>
        <div className="border-t pt-3">
          <div className="flex justify-between font-bold text-base sm:text-lg">
            <span>Total</span>
            <span>${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 sm:pt-6">
        <Button className="w-full h-10 sm:h-11 text-sm sm:text-base">
          Proceed to Checkout
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
