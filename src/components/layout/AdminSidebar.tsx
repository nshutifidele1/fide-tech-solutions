'use client';
import Link from 'next/link';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Settings,
  LifeBuoy,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Logo from '../common/Logo';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/analytics', label: 'Analytics', icon: LineChart },
];

const helpLinks = [
    { href: '/admin/settings', label: 'Settings', icon: Settings },
    { href: '/admin/support', label: 'Support', icon: LifeBuoy },
]

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-background">
      <div className="h-16 flex items-center px-6 border-b">
        <Logo />
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
              pathname === link.href && 'bg-primary/10 text-primary font-semibold'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4 space-y-1 border-t">
         {helpLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-primary/10',
              pathname === link.href && 'bg-primary/10 text-primary font-semibold'
            )}
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
