
import { ShoppingCart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { Badge } from '../ui/badge';

const CartIcon = () => {
  const { cart } = useCart();
  const itemCount = cart?.totalItems || 0;

  return (
    <Link to="/cart" className="relative">
      <ShoppingCart className="h-6 w-6" />
      {itemCount > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full flex items-center justify-center text-xs"
        >
          {itemCount}
        </Badge>
      )}
    </Link>
  );
};

export default CartIcon;
