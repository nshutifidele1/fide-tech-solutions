import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getProductBySlug, getProducts, getReviewsForProduct } from '@/lib/products';
import StarRating from '@/components/common/StarRating';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AddToCartButton from '@/components/products/AddToCartButton';
import { Separator } from '@/components/ui/separator';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  const products = getProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return { title: 'Product Not Found' };
  }
  return {
    title: `${product.name} - NetTech Solutions`,
    description: product.description,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);
  const reviews = getReviewsForProduct(product?.id || '');

  if (!product) {
    notFound();
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        <div>
          <div className="aspect-square relative w-full overflow-hidden rounded-lg border">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              data-ai-hint={product.image.imageHint}
            />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
             {product.gallery.map((img) => (
               <div key={img.id} className="aspect-square relative w-full overflow-hidden rounded-md border">
                 <Image src={img.imageUrl} alt={img.description} fill className="object-cover" data-ai-hint={img.imageHint} />
               </div>
             ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="outline">{product.category}</Badge>
            <h1 className="mt-2 font-headline text-3xl font-bold tracking-tight lg:text-4xl">
              {product.name}
            </h1>
            <p className="mt-2 text-3xl font-bold">${product.price.toFixed(2)}</p>
            <div className="mt-4 flex items-center gap-2">
              <StarRating rating={product.rating} />
              <span className="text-sm text-muted-foreground">({product.reviewsCount} reviews)</span>
            </div>
          </div>
          <p className="text-base text-muted-foreground">{product.description}</p>

          <div className="flex items-center gap-4">
            <AddToCartButton product={product} className="w-full sm:w-auto" />
            <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-xl">Specifications</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key} className="flex justify-between">
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-medium text-right">{value}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="font-headline text-2xl font-bold tracking-tight">Customer Reviews</h2>
        <div className="mt-6 space-y-8">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
              <div key={review.id}>
                <div className="flex items-center gap-4">
                  <Image src={review.avatar} alt={review.author} width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold">{review.author}</p>
                    <StarRating rating={review.rating} />
                  </div>
                </div>
                <h3 className="mt-4 font-semibold">{review.title}</h3>
                <p className="mt-1 text-muted-foreground">{review.comment}</p>
                {index < reviews.length - 1 && <Separator className="mt-8" />}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>
          )}
        </div>
      </div>
    </div>
  );
}
