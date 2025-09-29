import { Product } from '../types/product';

export const products: Product[] = [
  {
    id: 'coconut-citrus',
    name: 'Coconut Citrus',
    category: 'Electrolytes',
    price: 10,
    rating: 4.9,
    reviewsCount: 1247,
    caffeineMg: 0,
    servings: 15,
    summary: 'Tropical blend with natural coconut and citrus flavors for refreshing hydration.',
    images: ['/Zelyte_COCONUT.webp'],
    badges: ['No Artificial Flavors', 'Sugar-Free', 'Natural'],
    description: 'Experience the perfect tropical escape with our Coconut Citrus electrolyte blend. This refreshing combination of natural coconut and citrus flavors delivers premium hydration with a taste that transports you to paradise. Each serving provides essential electrolytes without any artificial ingredients, making it perfect for any time of day.',
    benefits: [
      'Rapid hydration with optimal electrolyte balance',
      'Natural coconut and citrus flavors',
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
      'Natural Coconut Flavor',
      'Natural Citrus Flavor',
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
    slug: 'coconut-citrus'
  },
  {
    id: 'peppermint',
    name: 'Peppermint',
    category: 'Electrolytes',
    price: 10,
    rating: 4.8,
    reviewsCount: 902,
    caffeineMg: 0,
    servings: 15,
    summary: 'Cool peppermint for clean, crisp hydration that refreshes and revitalizes.',
    images: ['/ZelytePeppermintImage .png'],
    badges: ['No Artificial Flavors', 'Sugar-Free', 'Natural'],
    description: 'Refresh and revitalize with our crisp Peppermint electrolyte blend. This cooling flavor provides a clean, invigorating taste that\'s perfect for any time of day. The natural peppermint flavor delivers a refreshing experience while providing essential electrolytes for optimal hydration.',
    benefits: [
      'Cooling and refreshing peppermint flavor',
      'Essential electrolytes for hydration',
      'Natural ingredients only',
      'No artificial additives',
      'Perfect for morning or evening',
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
      'Natural Peppermint Flavor',
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
    slug: 'peppermint'
  },
  {
    id: 'lemon-lime',
    name: 'Lemon Lime',
    category: 'Electrolytes + Caffeine',
    price: 10,
    rating: 4.9,
    reviewsCount: 1156,
    caffeineMg: 40,
    servings: 15,
    summary: 'Classic citrus with a focused kick - energizing hydration for peak performance.',
    images: ['/Zelyte_Lemon_Lime.png'],
    badges: ['No Artificial Flavors', 'Sugar-Free', 'Natural Caffeine'],
    description: 'Power up your day with our Lemon Lime electrolyte blend enhanced with natural caffeine. This classic citrus combination delivers both hydration and energy, perfect for workouts, study sessions, or any time you need a focused boost. The natural caffeine provides sustained energy without the crash.',
    benefits: [
      '40mg natural caffeine for sustained energy',
      'Classic lemon-lime flavor',
      'Essential electrolytes plus energy',
      'No artificial stimulants',
      'Perfect for workouts and focus',
      '15 servings per tin'
    ],
    howToUse: [
      'Add 1 scoop to 8-12 oz of water',
      'Stir or shake until fully dissolved',
      'Enjoy immediately for best taste',
      'Best consumed in the morning or before workouts'
    ],
    ingredients: [
      'Sodium Citrate',
      'Potassium Citrate',
      'Magnesium Citrate',
      'Natural Lemon Flavor',
      'Natural Lime Flavor',
      'Natural Caffeine',
      'Stevia Leaf Extract',
      'Sea Salt'
    ],
    nutritionFacts: {
      'Sodium': '380mg',
      'Potassium': '95mg',
      'Magnesium': '60mg',
      'Caffeine': '40mg',
      'Calories': '5',
      'Total Carbohydrates': '1g',
      'Servings per container': '15'
    },
    slug: 'lemon-lime'
  },
  {
    id: 'wintergreen',
    name: 'Wintergreen',
    category: 'Electrolytes + Caffeine',
    price: 10,
    rating: 4.7,
    reviewsCount: 743,
    caffeineMg: 40,
    servings: 15,
    summary: 'Refreshing wintergreen with smooth energy for a crisp, energizing experience.',
    images: ['/Zelyte_COCONUT.webp'], // TODO: Add actual wintergreen image
    badges: ['No Artificial Flavors', 'Sugar-Free', 'Natural Caffeine'],
    description: 'Experience the crisp, refreshing taste of wintergreen enhanced with natural caffeine. This unique flavor combination delivers both hydration and energy in a smooth, refreshing way. Perfect for those who want a clean, energizing boost without overwhelming sweetness.',
    benefits: [
      '40mg natural caffeine for smooth energy',
      'Refreshing wintergreen flavor',
      'Essential electrolytes plus energy',
      'No artificial stimulants',
      'Smooth, non-jittery energy',
      '15 servings per tin'
    ],
    howToUse: [
      'Add 1 scoop to 8-12 oz of water',
      'Stir or shake until fully dissolved',
      'Enjoy immediately for best taste',
      'Best consumed in the morning or before activities'
    ],
    ingredients: [
      'Sodium Citrate',
      'Potassium Citrate',
      'Magnesium Citrate',
      'Natural Wintergreen Flavor',
      'Natural Caffeine',
      'Stevia Leaf Extract',
      'Sea Salt'
    ],
    nutritionFacts: {
      'Sodium': '380mg',
      'Potassium': '95mg',
      'Magnesium': '60mg',
      'Caffeine': '40mg',
      'Calories': '5',
      'Total Carbohydrates': '1g',
      'Servings per container': '15'
    },
    slug: 'wintergreen'
  }
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(product => product.slug === slug);
}

export function getAllProducts(): Product[] {
  return products;
}

export function getRelatedProducts(currentProduct: Product, limit: number = 3): Product[] {
  return products
    .filter(product => product.slug !== currentProduct.slug)
    .slice(0, limit);
}
