import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export const metadata = {
  title: 'About Us - Fide Tech Solutions',
  description: 'Learn about Fide Tech Solutions, our mission, and our commitment to quality.',
};

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find((p) => p.id === 'about-1');

  return (
    <div className="bg-background">
      <div className="container py-16 sm:py-24">
        <div className="text-center">
          <h1 className="font-headline text-4xl font-bold tracking-tight text-primary sm:text-5xl">
            About Fide Tech Solutions
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            We are a team of passionate technologists dedicated to providing the best hardware and networking solutions.
          </p>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          {aboutImage && (
             <div className="aspect-video relative w-full overflow-hidden rounded-lg">
                <Image
                  src={aboutImage.imageUrl}
                  alt={aboutImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={aboutImage.imageHint}
                />
            </div>
          )}
          
          <div className="mt-8 prose prose-lg max-w-none text-foreground/80">
            <h2 className="font-headline text-2xl font-bold text-foreground">Our Mission</h2>
            <p>
              At Fide Tech Solutions, our mission is to empower individuals and businesses by providing reliable, high-performance technology. We believe that the right tools can unlock immense potential, whether you're a gamer pushing the limits of virtual worlds, a creative professional bringing ideas to life, or a business building a robust digital infrastructure. We meticulously curate our product catalog to ensure every item meets our high standards for quality, performance, and value.
            </p>
            <h2 className="font-headline text-2xl font-bold text-foreground">Our Story</h2>
            <p>
              Founded in a garage by a group of tech enthusiasts, Fide Tech Solutions was born from a shared frustration: the difficulty of finding high-quality, reliable computer components and networking gear without navigating a sea of confusing options and jargon. We set out to create a better experience—a place where customers could find expertly-vetted products, clear information, and genuine support.
            </p>
            <p>
              Today, we've grown into a trusted online retailer, but our core values remain the same. We're still that team of geeks, tinkerers, and professionals who get genuinely excited about new technology and love helping others build their perfect setup.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
