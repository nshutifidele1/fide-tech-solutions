import type { Product, Review } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string, fallbackId: string = 'computer-1') => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  // Return a fallback image if the requested one isn't found
  return image || PlaceHolderImages.find((img) => img.id === fallbackId) || PlaceHolderImages[0];
};

export const products: Product[] = [];
export const productReviews: { [productId: string]: Review[] } = {};
