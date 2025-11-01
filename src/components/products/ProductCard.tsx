import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import StarRating from '@/components/common/StarRating';
import { Button } from '@/components/ui/button';
import AddToCartButton from './AddToCartButton';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-shadow hover:shadow-md">
      <div className="aspect-h-1 aspect-w-1 bg-gray-200">
        <Link href={`/products/${product.slug}`} className="block">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            width={400}
            height={400}
            className="h-full w-full object-cover object-center transition-opacity group-hover:opacity-80"
            data-ai-hint={product.image.imageHint}
          />
        </Link>
      </div>
      <div className="flex flex-1 flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-foreground">
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <div className="flex flex-1 items-end justify-between">
          <div>
            <p className="text-lg font-semibold text-foreground">
              ${product.price.toFixed(2)}
            </p>
            <div className="mt-1 flex items-center">
              <StarRating rating={product.rating} />
              <span className="ml-2 text-xs text-muted-foreground">
                ({product.reviewsCount})
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
