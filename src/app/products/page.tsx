'use client';

import { useState } from 'react';
import ProductCard from '@/components/products/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where, DocumentData } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProductsPage() {
  const firestore = useFirestore();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);

  const productsQuery = useMemoFirebase(() => {
    if (!firestore) return null;

    let q = query(collection(firestore, 'products'));

    if (selectedCategory) {
      q = query(q, where('category', '==', selectedCategory));
    }
    if (selectedBrand) {
      q = query(q, where('brand', '==', selectedBrand));
    }
    
    return q;
  }, [firestore, selectedCategory, selectedBrand]);

  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="bg-background">
      <div className="container py-16 sm:py-24">
        <div className="pb-12 text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            Our Products
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Explore our curated collection of high-performance tech and networking gear.
          </p>
        </div>

        <ProductFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
        />
        
        <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {isLoading && (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))
          )}
          {!isLoading && products?.length === 0 && (
             <p className="text-muted-foreground col-span-full text-center">No products found matching your criteria.</p>
          )}
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
