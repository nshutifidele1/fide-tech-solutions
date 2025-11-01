import type { Testimonial } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string) => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  if (!image) {
    throw new Error(`Image with id "${id}" not found.`);
  }
  return image;
};

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah L.',
    role: 'IT Manager, Innovate Corp',
    avatar: findImage('testimonial-1'),
    comment:
      "NetTech Solutions is our go-to for all our networking hardware. Their product selection is top-notch, and the expert advice we received was invaluable in upgrading our office infrastructure. Delivery is always prompt.",
  },
  {
    id: '2',
    name: 'Mike R.',
    role: 'Freelance Video Editor',
    avatar: findImage('testimonial-2'),
    comment:
      "I bought my main editing rig from NetTech, and the performance is incredible. The pre-built configurations are thoughtfully put together for professionals, saving me the headache of building it myself.",
  },
  {
    id: '3',
    name: 'Jessica Chen',
    role: 'Small Business Owner',
    avatar: findImage('testimonial-3'),
    comment:
      "As someone who isn't a tech expert, the clear specifications and helpful customer service made setting up my small business network a breeze. The checkout process was simple and secure. Highly recommended!",
  },
];
