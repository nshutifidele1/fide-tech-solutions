'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';
import { useCart } from '@/hooks/use-cart';
import Logo from '@/components/common/Logo';
import { Button } from '@/components/ui/button';
import SearchController from '@/components/search/SearchController';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import { ThemeToggle } from './ThemeToggle';
import { useAuth, useUser } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { getAuth } from 'firebase/auth';
import { useUserRole } from '@/hooks/use-user-role';

export default function Header() {
  const { cartCount } = useCart();
  const { user, isUserLoading } = useUser();
  const { isAdmin } = useUserRole();
  const auth = useAuth();

  const handleLogout = () => {
    if (auth) {
      auth.signOut();
    }
  };
  
  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'U';
    return email.substring(0, 2).toUpperCase();
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <div className="mx-[-0.65rem] flex flex-col p-2">
                <div className="mb-4 ml-2">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => (
                    <SheetClose asChild key={link.href}>
                      <Link
                        href={link.href}
                        className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        {link.label}
                      </Link>
                    </SheetClose>
                  ))}
                   {isAdmin && (
                     <SheetClose asChild>
                      <Link
                        href="/admin"
                        className="rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        Admin
                      </Link>
                    </SheetClose>
                  )}
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex flex-1 items-center justify-between gap-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchController />
          </div>

          <nav className="hidden items-center gap-4 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
             {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground flex items-center gap-1"
              >
                <Shield size={16} />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute right-0 top-0 -mr-1 -mt-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Shopping Cart</span>
              </Link>
            </Button>
             {isUserLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                   <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || ''} alt={user.displayName || 'User'} />
                        <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                      </Avatar>
                   </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
