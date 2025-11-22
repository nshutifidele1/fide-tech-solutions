import Link from 'next/link';
import { Twitter, Facebook, Instagram, Linkedin } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { NAV_LINKS } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <Logo />
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for computers, networking, and tech devices.
            </p>
          </div>

          <div className="md:col-span-3">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="font-headline text-sm font-semibold tracking-wider text-foreground">
                  Shop
                </h3>
                <ul className="mt-4 space-y-2">
                  <li>
                    <Link href="/products?category=Computers" className="text-sm text-muted-foreground hover:text-foreground">
                      Computers
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=Routers" className="text-sm text-muted-foreground hover:text-foreground">
                      Routers
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=Switches" className="text-sm text-muted-foreground hover:text-foreground">
                      Switches
                    </Link>
                  </li>
                  <li>
                    <Link href="/products?category=Gadgets" className="text-sm text-muted-foreground hover:text-foreground">
                      Gadgets
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-headline text-sm font-semibold tracking-wider text-foreground">
                  About
                </h3>
                <ul className="mt-4 space-y-2">
                  {NAV_LINKS.slice(2).map((link) => (
                     <li key={link.href}>
                       <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
                         {link.label}
                       </Link>
                     </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 sm:col-span-1">
                 <h3 className="font-headline text-sm font-semibold tracking-wider text-foreground">
                  Join our Newsletter
                </h3>
                <p className="mt-4 text-sm text-muted-foreground">
                  Get updates on new products, deals, and industry news.
                </p>
                <form className="mt-4 flex w-full max-w-sm items-center space-x-2">
                  <Input type="email" placeholder="Email" className="flex-1" />
                  <Button type="submit">Subscribe</Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fide Tech Solutions. All Rights Reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Facebook className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Instagram className="h-5 w-5" />
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
