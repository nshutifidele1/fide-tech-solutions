import type { ImagePlaceholder } from './placeholder-images';

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: 'Computers' | 'Routers' | 'Switches' | 'Networking' | 'Gadgets';
  brand: string;
  price: number;
  stock: number;
  rating: number;
  reviewsCount: number;
  specifications: { [key: string]: string };
  features: string[];
  image: ImagePlaceholder;
  gallery: ImagePlaceholder[];
};

export type Review = {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  avatar: ImagePlaceholder;
  comment: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};
