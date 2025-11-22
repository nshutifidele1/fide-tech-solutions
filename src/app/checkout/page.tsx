'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import { useCart } from '@/hooks/use-cart';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Use a placeholder for your Stripe publishable key
const stripePromise = loadStripe('YOUR_STRIPE_PUBLISHABLE_KEY');

// Use PayPal's "test" client ID for development and testing.
// You will need to replace this with your actual client ID for production.
const paypalInitialOptions = {
  'client-id': 'test',
  currency: 'USD',
  intent: 'capture',
};

export default function CheckoutPage() {
  const { cartTotal, cartCount, cartItems } = useCart();
  
  if (cartCount === 0) {
    return (
      <div className="container py-12 md:py-20 text-center">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground mt-2">Add some products before you can check out.</p>
        <Button asChild className="mt-6">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-center font-headline text-3xl font-bold tracking-tight md:text-4xl">
          Checkout
        </h1>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {cartItems.map(item => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-4">{item.product.name} x {item.quantity}</span>
                      <span className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold mb-2 text-lg">Pay with Credit Card</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Securely enter your card details. We do not store your card information.
                    </p>
                    <Elements stripe={stripePromise}>
                      <CheckoutForm paymentMethod="stripe" totalAmount={cartTotal} />
                    </Elements>
                </div>
                <Separator />
                <div>
                   <h3 className="font-semibold mb-2 text-lg">Pay with PayPal</h3>
                   <p className="text-sm text-muted-foreground mb-4">
                      Checkout securely using your PayPal account.
                    </p>
                  <PayPalScriptProvider options={paypalInitialOptions}>
                    <CheckoutForm paymentMethod="paypal" totalAmount={cartTotal} />
                  </PayPalScriptProvider>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
