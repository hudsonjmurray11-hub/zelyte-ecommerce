// Product Service for managing local products
import { Product } from '../types/product';
import { products as localProducts } from '../data/products';

// Get all products from local data
export async function getAllProducts(): Promise<Product[]> {
  return Promise.resolve(localProducts);
}

// Get a single product by handle/slug
export async function getProductByHandle(handle: string): Promise<Product | null> {
  const product = localProducts.find(p => p.slug === handle);
  return Promise.resolve(product || null);
}

// Get product by ID
export async function getProductById(id: string): Promise<Product | null> {
  const product = localProducts.find(p => p.id === id);
  return Promise.resolve(product || null);
}
