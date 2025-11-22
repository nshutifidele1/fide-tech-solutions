import Link from 'next/link';
import { Package } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="rounded-full bg-primary p-2">
         <Package className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-headline text-xl font-bold text-foreground">
        Fide Tech
      </span>
    </Link>
  );
}
