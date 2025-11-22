'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, Dot } from 'lucide-react';
import type { Product } from '@/lib/types';
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, limit } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';

export default function HeroSection() {
  const firestore = useFirestore();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const featuredProductsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'products'), limit(4));
  }, [firestore]);

  const { data: featuredProducts, isLoading } = useCollection<Product>(featuredProductsQuery);


  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    api.on('select', onSelect);

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000); // Change slide every 5 seconds

    return () => {
      api.off('select', onSelect);
      clearInterval(interval);
    };
  }, [api]);

  const scrollTo = useCallback(
    (index: number) => {
      api?.scrollTo(index);
    },
    [api]
  );
  
  if (isLoading) {
    return <Skeleton className="relative w-full h-[70vh] md:h-[85vh]" />;
  }

  if (!featuredProducts || featuredProducts.length === 0) {
    return null; // Or a placeholder if no products are featured
  }

  return (
    <section className="relative w-full h-[70vh] md:h-[85vh]">
      <Carousel
        setApi={setApi}
        opts={{ loop: true }}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {featuredProducts.map((product, index) => (
            <CarouselItem key={product.id} className="h-full">
              <div className="relative w-full h-full">
                <Image
                  src={product.image.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={product.image.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                 <div className="absolute inset-0 bg-black/30" />

                <div className="relative container mx-auto flex h-full items-end pb-16 md:pb-24 text-center md:text-left">
                  <div className="max-w-2xl text-white">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
                      {product.name}
                    </h1>
                    <p className="mt-6 text-lg leading-8 text-white/90">
                      {product.description}
                    </p>
                    <div className="mt-10 flex items-center justify-center md:justify-start gap-x-6">
                      <Button asChild size="lg">
                        <Link href={`/products/${product.slug}`}>
                          Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                       <Button asChild variant="link" size="lg" className="text-white hover:text-white/80">
                        <Link href="/products">
                          View All Products <span aria-hidden="true">→</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className="p-1"
          >
            <Dot
              className={`h-6 w-6 transition-colors ${
                current === index ? 'text-primary' : 'text-white/50 hover:text-white'
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
