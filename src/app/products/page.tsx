import { getProducts } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';

export const metadata = {
  title: 'All Products - NetTech Solutions',
  description: 'Browse our full catalog of computers, routers, switches, and more.',
};

export default function ProductsPage() {
  const products = getProducts();

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
        
        {/* TODO: Add filtering component here */}

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
