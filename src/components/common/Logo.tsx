import Link from 'next/link';
import { Wind } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <div className="p-1.5 bg-primary rounded-full">
         <Wind className="h-5 w-5 text-primary-foreground" />
      </div>
      <span className="font-headline text-2xl font-bold text-foreground">
        Sinvoice
      </span>
    </Link>
  );
}
