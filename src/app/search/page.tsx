import { Suspense } from 'react';
import { intelligentProductSearch } from '@/ai/flows/intelligent-product-search';
import ProductCard from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { collection, getDocs, query, where, DocumentData, or } from 'firebase/firestore';
import { initializeFirebase } from '@/firebase';
import type { Product } from '@/lib/types';


export const metadata = {
  title: 'Search Results - Fide Tech Solutions',
};

type SearchPageProps = {
  searchParams: {
    q?: string;
  };
};

async function SearchResults({ query: searchQuery }: { query: string }) {
  const { firestore } = initializeFirebase();
  let foundProducts: Product[] = [];
  let searchStrategy = 'full-text';

  // --- Strategy 1: Match Brand or Category ---
  const brandsRef = collection(firestore, 'brands');
  const categoriesRef = collection(firestore, 'categories');
  const normalizedQuery = searchQuery.toLowerCase();

  const [brandsSnapshot, categoriesSnapshot] = await Promise.all([
    getDocs(brandsRef),
    getDocs(categoriesRef)
  ]);

  const matchedBrand = brandsSnapshot.docs.find(doc => doc.data().name.toLowerCase() === normalizedQuery);
  const matchedCategory = categoriesSnapshot.docs.find(doc => doc.data().name.toLowerCase() === normalizedQuery);
  
  const productsRef = collection(firestore, 'products');

  if (matchedBrand) {
    searchStrategy = 'brand';
    const q = query(productsRef, where('brand', '==', matchedBrand.data().name));
    const querySnapshot = await getDocs(q);
    foundProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  } else if (matchedCategory) {
    searchStrategy = 'category';
    const q = query(productsRef, where('category', '==', matchedCategory.data().name));
    const querySnapshot = await getDocs(q);
    foundProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }
  
  // --- Strategy 2: AI-powered search (if no brand/category match) ---
  if (foundProducts.length === 0) {
    searchStrategy = 'ai';
    let productNames: string[] = [];
    try {
      const result = await intelligentProductSearch({ query: searchQuery });
      productNames = result.products;
    } catch (error) {
      console.error('AI search failed:', error);
    }
    
    if (productNames.length > 0) {
       // Firestore 'in' query is limited to 30 elements.
       const q = query(productsRef, where('name', 'in', productNames.slice(0, 30)));
       const querySnapshot = await getDocs(q);
       foundProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    }
  }
  
    // --- Strategy 3: Fallback full-text search (if other strategies yield no results) ---
   if (foundProducts.length === 0) {
    searchStrategy = 'fallback';
    // This is a simple case-insensitive prefix search. For a real app, a dedicated search service like Algolia or Elasticsearch is better.
    const q = query(productsRef, where('name', '>=', searchQuery), where('name', '<=', searchQuery + '\uf8ff'));
    const querySnapshot = await getDocs(q);
    foundProducts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  if (foundProducts.length === 0) {
    return <p className="text-center text-muted-foreground">No products found for "{searchQuery}". Try a different search.</p>;
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
