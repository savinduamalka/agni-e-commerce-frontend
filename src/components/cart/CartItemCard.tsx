
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
    <div className="flex items-center p-4 border rounded-lg">
      <img 
        src={item.product.images[0]} 
        alt={item.product.name} 
        className="w-24 h-24 object-cover rounded-md mr-4"
      />
      <div className="flex-grow">
        <Link to={`/products/${item.productId}`} className="font-semibold text-lg hover:underline">
          {item.product.name}
        </Link>
        <p className="text-muted-foreground">${item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-4">
        <Input
          type="number"
          min="0"
          value={item.quantity}
          onChange={handleQuantityChange}
          className="w-20 text-center"
        />
        <p className="font-semibold w-24 text-right">${(item.price * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="icon" onClick={handleRemove}>
          <Trash2 className="h-5 w-5 text-destructive" />
        </Button>
      </div>
    </div>
  );
};

export default CartItemCard;
