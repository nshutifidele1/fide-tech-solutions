import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-1');

  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] bg-primary/10">
      {heroImage && (
         <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      <div className="relative container mx-auto flex h-full items-end pb-12 md:pb-24 text-center md:text-left">
        <div className="max-w-2xl">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl md:text-6xl">
            Powering Your Digital World
          </h1>
          <p className="mt-6 text-lg leading-8 text-foreground/80">
            From high-performance gaming rigs to robust networking gear, NetTech Solutions delivers cutting-edge technology to fuel your passion and profession.
          </p>
          <div className="mt-10 flex items-center justify-center md:justify-start gap-x-6">
            <Button asChild size="lg">
              <Link href="/products">
                Shop Now <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="link" size="lg">
              <Link href="/about">
                Learn More <span aria-hidden="true">→</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
