'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { PayPalButtons, OnApproveData, OnApproveActions } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/common/icons';
import { useFirestore, useUser } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useCart } from '@/hooks/use-cart';

interface CheckoutFormProps {
  paymentMethod: 'stripe' | 'paypal';
  totalAmount: number;
}

const cardElementOptions = {
  style: {
    base: {
      color: 'hsl(var(--foreground))',
      fontFamily: '"Inter", sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: 'hsl(var(--muted-foreground))',
      },
    },
    invalid: {
      color: 'hsl(var(--destructive))',
      iconColor: 'hsl(var(--destructive))',
    },
  },
  classes: {
    base: 'border border-input bg-background rounded-md p-3',
    focus: 'ring-2 ring-ring ring-offset-2',
  }
};

const StripePaymentForm = ({ totalAmount }: { totalAmount: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { user } = useUser();
  const firestore = useFirestore();
  const { clearCart, cartItems } = useCart();

  const handleStripeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !firestore) return;
    setIsLoading(true);
    setErrorMessage(null);

    if (!stripe || !elements) {
      setErrorMessage("Stripe has not loaded yet. Please try again in a moment.");
      setIsLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
       setErrorMessage("Card details could not be found. Please try again.");
       setIsLoading(false);
       return;
    }

    const { error, token } = await stripe.createToken(cardElement);

    if (error) {
      setErrorMessage(error.message || "An unexpected error occurred.");
      setIsLoading(false);
    } else {
      console.log('Stripe Token:', token);
      
      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        orderDate: serverTimestamp(),
        totalAmount: totalAmount,
        shippingAddress: '123 Main St', // Placeholder
        orderStatus: 'Processing',
      };
      
      await addDoc(collection(firestore, 'orders'), orderData);
      
      clearCart();
      toast({
        title: 'Payment Successful!',
        description: 'Your order has been placed.',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleStripeSubmit} className="space-y-4">
      <CardElement options={cardElementOptions} />
      {errorMessage && <p className="text-sm font-medium text-destructive">{errorMessage}</p>}
      <Button type="submit" className="w-full" disabled={!stripe || isLoading}>
        {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : null}
        Pay ${totalAmount.toFixed(2)}
      </Button>
    </form>
  );
};


const CheckoutForm = ({ paymentMethod, totalAmount }: CheckoutFormProps) => {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();
  const { clearCart } = useCart();

  const handlePayPalCreateOrder = (data: Record<string, unknown>, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Your order from Fide Tech Solutions",
          amount: {
            value: totalAmount.toFixed(2),
            currency_code: 'USD',
          },
        },
      ],
    });
  };

  const handlePayPalApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    if (!actions.order || !user || !firestore) {
        toast({ variant: 'destructive', title: 'Error', description: 'PayPal order could not be processed.' });
        return;
    }
    const details = await actions.order.capture();

     const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        orderDate: serverTimestamp(),
        totalAmount: totalAmount,
        shippingAddress: `${details.payer.name?.given_name} ${details.payer.name?.surname}, ${details.payer.address.address_line_1}`,
        orderStatus: 'Processing',
        paymentMethod: 'PayPal',
        transactionId: details.id,
      };

    await addDoc(collection(firestore, 'orders'), orderData);
    
    clearCart();

    console.log('PayPal Order Details:', details);
    toast({
        title: 'Payment Successful!',
        description: `Order ${details.id} has been placed.`,
    });
  };

  const handlePayPalError = (err: any) => {
    console.error("PayPal Error:", err);
    toast({ variant: 'destructive', title: 'PayPal Error', description: 'An error occurred during the PayPal transaction.' });
  };

  if (paymentMethod === 'stripe') {
    return <StripePaymentForm totalAmount={totalAmount} />;
  }

  if (paymentMethod === 'paypal') {
    return (
        <PayPalButtons
            style={{ layout: 'vertical', color: 'blue', shape: 'rect', label: 'pay' }}
            createOrder={handlePayPalCreateOrder}
            onApprove={handlePayPalApprove}
            onError={handlePayPalError}
        />
    );
  }

  return null;
};

export default CheckoutForm;
