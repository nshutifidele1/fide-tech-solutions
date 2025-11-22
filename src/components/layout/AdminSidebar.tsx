'use client';
import Link from 'next/link';
import {
  LayoutDashboard,
  MessageSquare,
  Package
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useUser } from '@/firebase';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Logo from '../common/Logo';

const navLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/messages', label: 'Inbox', icon: MessageSquare },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const getInitials = (email: string | null | undefined) => {
    if (!email) return 'A';
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
      <div className="flex h-16 items-center border-b px-6">
        <Logo />
      </div>
      
      <div className="flex flex-1 flex-col justify-between">
        <nav className="flex-1 space-y-1 px-4 py-4">
          {user && (
             <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 mb-4">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photoURL || ''} alt="Admin" />
                  <AvatarFallback>{getInitials(user.email)}</AvatarFallback>
                </Avatar>
                <div>
                    <p className="text-sm font-semibold">{user.displayName || 'Admin User'}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary',
                pathname.startsWith(link.href) && link.href !== '/admin' ? 'bg-primary/10 text-primary font-semibold' : 
                pathname === '/admin' && link.href === '/admin' ? 'bg-primary/10 text-primary font-semibold' : ''
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
