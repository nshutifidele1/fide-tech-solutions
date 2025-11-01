'use client';

import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/use-cart';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import type { Product } from '@/lib/types';

type AddToCartButtonProps = {
  product: Product;
  quantity?: number;
  className?: string;
};

export default function AddToCartButton({ product, quantity = 1, className }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();

  const handleAddToCart = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You need to be logged in to add items to your cart.',
      });
      router.push('/login');
      return;
    }
    
    addToCart(product, quantity);
    toast({
      title: 'Added to cart',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Button onClick={handleAddToCart} className={className} disabled={product.stock <= 0}>
      <ShoppingCart className="mr-2 h-4 w-4" />
      {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
    </Button>
  );
}
