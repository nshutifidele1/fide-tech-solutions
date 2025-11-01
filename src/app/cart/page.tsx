import CartClientPage from './CartClientPage';

export const metadata = {
  title: 'Your Cart - NetTech Solutions',
  description: 'Review items in your shopping cart and proceed to checkout.',
};

export default function CartPage() {
  return (
    <div className="container py-12 md:py-20">
      <h1 className="font-headline text-3xl font-bold tracking-tight text-center md:text-4xl">
        Your Shopping Cart
      </h1>
      <div className="mt-12">
        <CartClientPage />
      </div>
    </div>
  );
}
