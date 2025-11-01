import Image from 'next/image';
import { testimonials } from '@/lib/testimonials';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import StarRating from '@/components/common/StarRating';

export default function TestimonialsSection() {
  return (
    <section className="bg-background py-16 sm:py-24">
      <div className="container">
        <div className="text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Trusted by Professionals & Enthusiasts
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Here's what our customers are saying about us.
          </p>
        </div>

        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="mx-auto mt-12 w-full max-w-xs sm:max-w-2xl lg:max-w-4xl"
        >
          <CarouselContent>
            {testimonials.map((testimonial) => (
              <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="h-full">
                    <CardContent className="flex h-full flex-col justify-between p-6">
                      <div>
                        <StarRating rating={5} />
                        <p className="mt-4 text-muted-foreground">
                          "{testimonial.comment}"
                        </p>
                      </div>
                      <div className="mt-6 flex items-center gap-4">
                        <Image
                          src={testimonial.avatar.imageUrl}
                          alt={`Avatar of ${testimonial.name}`}
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                          data-ai-hint={testimonial.avatar.imageHint}
                        />
                        <div>
                          <p className="font-semibold text-foreground">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  );
}
