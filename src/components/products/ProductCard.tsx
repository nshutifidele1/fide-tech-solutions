'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import StarRating from '@/components/common/StarRating';
import AddToCartButton from './AddToCartButton';
import { Badge } from '@/components/ui/badge';

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-xl">
      <div className="relative overflow-hidden bg-gray-200">
        <Link href={`/products/${product.slug}`} className="block aspect-square">
          <Image
            src={product.image.imageUrl}
            alt={product.name}
            fill
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={product.image.imageHint}
          />
        </Link>
        <div className="absolute bottom-2 left-2">
            <Badge variant="secondary">{product.category}</Badge>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-headline text-lg font-semibold text-foreground">
          <Link href={`/products/${product.slug}`}>
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        
        <div className="mt-4 flex flex-1 items-end justify-between gap-4">
           <div>
            <div className="flex items-center gap-1">
              <StarRating rating={product.rating} />
              <span className="text-xs text-muted-foreground">
                ({product.reviewsCount})
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
       <div className="p-4 pt-0">
         <AddToCartButton product={product} className="w-full" />
      </div>
    </div>
  );
}