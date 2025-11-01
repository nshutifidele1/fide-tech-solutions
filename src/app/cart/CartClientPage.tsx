'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Plus, Minus } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function CartClientPage() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  if (cartCount === 0) {
    return (
      <div className="text-center">
        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map(({ product, quantity }) => (
          <Card key={product.id}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border">
                <Image
                  src={product.image.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="flex-grow">
                <Link href={`/products/${product.slug}`} className="font-semibold hover:underline">
                  {product.name}
                </Link>
                <p className="text-sm text-muted-foreground">{product.brand}</p>
                <p className="mt-2 font-bold">${product.price.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center border rounded-md">
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity - 1)}>
                    <Minus className="h-4 w-4"/>
                  </Button>
                  <Input type="number" value={quantity} readOnly className="h-8 w-12 border-0 text-center" />
                   <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(product.id, quantity + 1)}>
                    <Plus className="h-4 w-4"/>
                  </Button>
                </div>
                 <Button variant="ghost" size="sm" onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-destructive">
                   <X className="mr-1 h-4 w-4" /> Remove
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-xl">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>Free</span>
            </div>
             <Separator />
             <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
          </CardContent>
          <CardFooter>
            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
