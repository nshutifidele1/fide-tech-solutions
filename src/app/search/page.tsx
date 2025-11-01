import { Suspense } from 'react';
import { intelligentProductSearch } from '@/ai/flows/intelligent-product-search';
import { getProducts } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';

export const metadata = {
  title: 'Search Results - Setso',
};

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

async function SearchResults({ query }: { query: string }) {
  const allProducts = getProducts();
  let productNames: string[] = [];

  try {
    const result = await intelligentProductSearch({ query });
    productNames = result.products;
  } catch (error) {
    console.error('AI search failed:', error);
    // Fallback or error message could be handled here
  }

  const foundProducts = allProducts.filter((p) =>
    productNames.some(name => p.name.toLowerCase().includes(name.toLowerCase()))
  );

  if (foundProducts.length === 0) {
    return <p className="text-center text-muted-foreground">No products found for "{query}". Try a different search.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {foundProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="space-y-4">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';

  return (
    <div className="container py-16 sm:py-24">
      <div className="pb-12">
        <h1 className="font-headline text-3xl font-bold tracking-tight text-center md:text-4xl">
          Search Results
        </h1>
        {query && (
           <p className="mt-4 text-center text-lg text-muted-foreground">
            Showing results for: <span className="text-foreground font-semibold">"{query}"</span>
          </p>
        )}
      </div>
      
      {query ? (
         <Suspense fallback={<SearchSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      ) : (
         <p className="text-center text-muted-foreground">Please enter a search query to see results.</p>
      )}
    </div>
  );
}
