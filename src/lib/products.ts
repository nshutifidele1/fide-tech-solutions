import type { Product, Review } from './types';
import { PlaceHolderImages } from './placeholder-images';

const findImage = (id: string, fallbackId: string = 'computer-1') => {
  const image = PlaceHolderImages.find((img) => img.id === id);
  // Return a fallback image if the requested one isn't found
  return image || PlaceHolderImages.find((img) => img.id === fallbackId) || PlaceHolderImages[0];
};

export const products: Product[] = [];
export const productReviews: { [productId: string]: Review[] } = {};

// getProducts is now deprecated and will be removed.
// Data should be fetched from Firestore.
export const getProducts = (): Product[] => products;
export const getProductBySlug = (slug: string): Product | undefined => products.find((p) => p.slug === slug);
export const getFeaturedProducts = (): Product[] => products.slice(0, 4);
export const getReviewsForProduct = (productId: string): Review[] => productReviews[productId] || [];
