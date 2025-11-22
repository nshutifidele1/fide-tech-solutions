'use client';

import React, { useState } from 'react';
import { CardElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';
import { PayPalButtons, OnApproveData, OnApproveActions } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Icons } from '@/components/common/icons';

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

  const handleStripeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
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
      // Here, you would send the token to your backend to process the payment.
      // For example:
      // await fetch('/api/charge', { method: 'POST', body: JSON.stringify({ token: token.id, amount: totalAmount }) });
      
      toast({
        title: 'Payment Successful!',
        description: 'Your order has been placed.',
      });
      // You would typically redirect to an order confirmation page here.
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

  const handlePayPalCreateOrder = (data: Record<string, unknown>, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "Your order from Setso",
          amount: {
            value: totalAmount.toFixed(2),
            currency_code: 'USD',
          },
        },
      ],
    });
  };

  const handlePayPalApprove = async (data: OnApproveData, actions: OnApproveActions) => {
    if (!actions.order) {
        toast({ variant: 'destructive', title: 'Error', description: 'PayPal order could not be processed.' });
        return;
    }
    const details = await actions.order.capture();
    console.log('PayPal Order Details:', details);
    toast({
        title: 'Payment Successful!',
        description: `Order ${details.id} has been placed.`,
    });
    // You would typically redirect to an order confirmation page here.
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
