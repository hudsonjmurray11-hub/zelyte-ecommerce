// Shopify Storefront API Types

export interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface ShopifyPrice {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyPrice;
  compareAtPrice?: ShopifyPrice;
  availableForSale: boolean;
  selectedOptions: Array<{
    name: string;
    value: string;
  }>;
  image?: ShopifyImage;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml?: string;
  vendor: string;
  productType: string;
  tags: string[];
  priceRange: {
    minVariantPrice: ShopifyPrice;
  };
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyProductVariant;
    }>;
  };
  options?: Array<{
    id: string;
    name: string;
    values: string[];
  }>;
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: ShopifyPrice;
  };
  merchandise: {
    id: string;
    title: string;
    price: ShopifyPrice;
    product: {
      id: string;
      title: string;
      handle: string;
      images: {
        edges: Array<{
          node: ShopifyImage;
        }>;
      };
    };
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: {
    totalAmount: ShopifyPrice;
    subtotalAmount: ShopifyPrice;
    totalTaxAmount: ShopifyPrice;
  };
  lines: {
    edges: Array<{
      node: ShopifyCartLine;
    }>;
  };
}

export interface ShopifyUserError {
  field: string[];
  message: string;
}

// Local cart item interface (compatible with existing code)
export interface LocalCartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  flavor?: string;
  bundleType?: string;
  image?: string;
  variantId?: string;
  productId?: string;
  handle?: string;
}
