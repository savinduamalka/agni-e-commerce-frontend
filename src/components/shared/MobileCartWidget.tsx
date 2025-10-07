import { Link } from 'react-router-dom';
import { ShoppingCart, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';

interface MobileCartWidgetProps {
  onClose: () => void;
}

export function MobileCartWidget({ onClose }: MobileCartWidgetProps) {
  const { cart } = useCart();

  const handleCartClick = () => {
    onClose();
  };

  return (
    <Link
      to="/cart"
      onClick={handleCartClick}
      className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl text-white hover:from-green-600 hover:to-teal-700 transition-all duration-200 group"
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <ShoppingCart className="h-5 w-5" />
          </div>
          {cart && cart.totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center border-2 border-white">
              {cart.totalItems}
            </Badge>
          )}
        </div>
        <div>
          <p className="font-medium">My Cart</p>
          {cart && cart.totalItems > 0 ? (
            <p className="text-xs opacity-90">
              {cart.totalItems} item{cart.totalItems > 1 ? 's' : ''} • Rs{' '}
              {cart.totalPrice.toFixed(2)}
            </p>
          ) : (
            <p className="text-xs opacity-90">Empty</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
