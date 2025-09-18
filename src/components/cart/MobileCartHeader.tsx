import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';

interface MobileCartHeaderProps {
  itemCount: number;
}

const MobileCartHeader = ({ itemCount }: MobileCartHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-4 sm:hidden">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/products">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Your Cart</h1>
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileCartHeader;
