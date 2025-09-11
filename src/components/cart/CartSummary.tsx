
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import type { Cart } from '../../lib/cartTypes';

interface CartSummaryProps {
  cart: Cart;
}

const CartSummary = ({ cart }: CartSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${cart.totalPrice.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Proceed to Checkout</Button>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
