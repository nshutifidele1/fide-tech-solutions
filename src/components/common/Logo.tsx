import Link from 'next/link';
import { Network } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Network className="h-7 w-7 text-primary" />
      <span className="font-headline text-2xl font-bold text-primary">
        NetTech
      </span>
      <span className="font-headline text-2xl font-light text-foreground">
        Solutions
      </span>
    </Link>
  );
}
