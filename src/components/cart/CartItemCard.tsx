import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Trash2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import type { CartItem } from '../../lib/cartTypes';

interface CartItemCardProps {
  item: CartItem;
}

const CartItemCard = ({ item }: CartItemCardProps) => {
  const { updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value, 10);
    if (!isNaN(quantity) && quantity >= 0) {
      updateCartItem(item.productId, quantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  return (
    <div className="p-4 border rounded-lg cart-item">
      {/* Mobile Layout */}
      <div className="flex flex-col sm:hidden space-y-3">
        <div className="flex gap-3">
          <img
            src={item.product.images[0]}
            alt={item.product.name}
            className="w-20 h-20 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-grow min-w-0">
            <Link
              to={`/products/${item.productId}`}
              className="font-semibold text-base hover:underline block truncate"
            >
              {item.product.name}
            </Link>
            <p className="text-muted-foreground text-sm">
              Rs {item.price.toFixed(2)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="flex-shrink-0 h-8 w-8"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Qty:</span>
            <Input
              type="number"
              min="0"
              value={item.quantity}
              onChange={handleQuantityChange}
              className="w-16 h-8 text-center text-sm"
            />
          </div>
          <p className="font-semibold text-lg">
            Rs {(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden sm:flex items-center gap-4">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-24 h-24 object-cover rounded-md flex-shrink-0"
        />
        <div className="flex-grow min-w-0">
          <Link
            to={`/products/${item.productId}`}
            className="font-semibold text-lg hover:underline block"
          >
            {item.product.name}
          </Link>
          <p className="text-muted-foreground">Rs {item.price.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <Input
            type="number"
            min="0"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-20 text-center"
          />
          <p className="font-semibold w-24 text-right">
            Rs {(item.price * item.quantity).toFixed(2)}
          </p>
          <Button variant="ghost" size="icon" onClick={handleRemove}>
            <Trash2 className="h-5 w-5 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItemCard;
