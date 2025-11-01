'use client';
import Link from 'next/link';
import {
  Bell,
  Home,
  Package,
  ShoppingCart,
  Users,
  LineChart,
  Settings,
  History,
  FileText,
  MessageSquare,
  LifeBuoy,
  Users2,
  MoreHorizontal
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUserRole } from '@/hooks/use-user-role';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import Logo from '../common/Logo';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: Home },
  { href: '/admin/invoices', label: 'Invoice', icon: FileText },
  { href: '/admin/transactions', label: 'Transactions', icon: LineChart },
  { href: '/admin/payment', label: 'Payment', icon: ShoppingCart },
  { href: '/admin/inbox', label: 'Inbox', icon: MessageSquare },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
  { href: '/admin/history', label: 'History', icon: History },
];

const helpLinks = [
    { href: '/admin/support', label: 'Support', icon: LifeBuoy },
    { href: '/admin/community', label: 'Community', icon: Users2 },
]

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUserRole();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-background">
      <div className="p-4">
        <Logo />
      </div>
      <div className="p-4 mb-4 border-y">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'Admin'} />
            <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.displayName || 'James Robert'}</p>
            <p className="text-xs text-muted-foreground">{user?.email || 'jamesrobert@gmail.com'}</p>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2">
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
      <div className="mt-auto p-4 space-y-2">
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
