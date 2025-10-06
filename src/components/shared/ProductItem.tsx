import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import type { Product } from '@/lib/types';

interface ProductItemProps {
  product: Product;
}

export const ProductItem = ({ product }: ProductItemProps) => {
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-teal-500 hover:shadow-lg sm:p-5">
      <Link
        to={`/products/${product.id}`}
        className="relative flex h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-slate-100 sm:h-28 sm:w-28"
      >
        <img
          src={product.images[0] || '/placeholder-product.svg'}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        {product.isOffer && product.offerPercentage && (
          <span className="absolute left-2 top-2 rounded-full bg-teal-500 px-2 py-[2px] text-[11px] font-semibold text-white shadow-sm">
            {product.offerPercentage.toFixed(0)}% OFF
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col gap-3">
        <div>
          {product.brand && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-teal-600">
              {product.brand}
            </p>
          )}
          <Link to={`/products/${product.id}`}>
            <h3 className="mt-1 line-clamp-2 text-base font-semibold text-slate-900 transition-colors hover:text-teal-600">
              {product.name}
            </h3>
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-xl font-bold text-slate-900">
            ${product.price.toFixed(2)}
          </span>
          {product.isOffer && product.offerPercentage && (
            <span className="rounded-full bg-teal-50 px-2.5 py-[3px] text-xs font-semibold text-teal-600">
              Save {product.offerPercentage.toFixed(0)}%
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Product ID: {product.id}</span>
        </div>
      </div>
      <Button
        asChild
        variant="outline"
        className="h-11 shrink-0 rounded-full border border-slate-200 px-5 text-sm font-semibold hover:border-teal-500 hover:text-teal-600"
      >
        <Link to={`/products/${product.id}`}>View</Link>
      </Button>
    </div>
  );
};
