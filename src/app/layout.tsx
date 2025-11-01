import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CartProvider } from '@/hooks/use-cart';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'Setso',
  description: 'Your one-stop shop for computers, networking, and tech devices.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <FirebaseClientProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </CartProvider>
          </FirebaseClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
