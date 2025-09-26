// Product Service for managing Shopify products
import { ShopifyService } from './shopifyService';
import { ShopifyProduct, ShopifyProductVariant } from '../types/shopify';
import { Product } from '../types/product';

// Map Shopify products to local Product format
export function mapShopifyProductToLocal(shopifyProduct: ShopifyProduct): Product {
  const firstImage = shopifyProduct.images.edges[0]?.node;
  const firstVariant = shopifyProduct.variants.edges[0]?.node;
  
  return {
    id: shopifyProduct.handle,
    name: shopifyProduct.title,
    category: shopifyProduct.productType || 'Electrolytes',
    price: parseFloat(firstVariant?.price.amount || '0'),
    rating: 4.8, // Default rating - you could store this as metafields
    reviewsCount: 100, // Default reviews - you could store this as metafields
    caffeineMg: 0, // Default - you could determine this from variants or metafields
    servings: 15, // Default - you could store this as metafields
    summary: shopifyProduct.description,
    images: shopifyProduct.images.edges.map(edge => edge.node.url),
    badges: ['No Artificial Flavors', 'Sugar-Free', 'Natural'], // Default badges
    description: shopifyProduct.description,
    benefits: [
      'Rapid hydration with optimal electrolyte balance',
      'Natural flavors',
      'No artificial colors, flavors, or preservatives',
      'Perfect for pre, during, or post-workout',
      'Suitable for any time of day',
      '15 servings per tin'
    ],
    howToUse: [
      'Add 1 scoop to 8-12 oz of water',
      'Stir or shake until fully dissolved',
      'Enjoy immediately for best taste',
      'Consume within 24 hours of mixing'
    ],
    ingredients: [
      'Sodium Citrate',
      'Potassium Citrate',
      'Magnesium Citrate',
      'Natural Flavors',
      'Stevia Leaf Extract',
      'Sea Salt'
    ],
    nutritionFacts: {
      'Sodium': '380mg',
      'Potassium': '95mg',
      'Magnesium': '60mg',
      'Calories': '5',
      'Total Carbohydrates': '1g',
      'Servings per container': '15'
    },
    slug: shopifyProduct.handle
  };
}

// Get all products from Shopify
export async function getAllShopifyProducts(): Promise<Product[]> {
  try {
    const shopifyProducts = await ShopifyService.getProducts(50);
    return shopifyProducts.map(mapShopifyProductToLocal);
  } catch (error) {
    console.error('Error fetching products from Shopify:', error);
    // Return empty array on error
    return [];
  }
}

// Get a single product by handle
export async function getShopifyProductByHandle(handle: string): Promise<Product | null> {
  try {
    const shopifyProduct = await ShopifyService.getProduct(handle);
    if (!shopifyProduct) return null;
    return mapShopifyProductToLocal(shopifyProduct);
  } catch (error) {
    console.error('Error fetching product from Shopify:', error);
    return null;
  }
}

// Find variant by flavor/option
export function findVariantByFlavor(product: ShopifyProduct, flavor: string): ShopifyProductVariant | null {
  return ShopifyService.findVariantByFlavor(product, flavor);
}

// Convert local cart item to Shopify-compatible format
export function createCartItemFromProduct(
  product: Product, 
  variant?: ShopifyProductVariant,
  flavor?: string
): {
  id: string;
  name: string;
  price: number;
  flavor?: string;
  variantId?: string;
  productId?: string;
  handle?: string;
  image?: string;
} {
  return {
    id: variant?.id || product.id,
    name: product.name,
    price: product.price,
    flavor: flavor || variant?.title,
    variantId: variant?.id,
    productId: `gid://shopify/Product/${product.id}`,
    handle: product.slug,
    image: product.images[0]
  };
}
