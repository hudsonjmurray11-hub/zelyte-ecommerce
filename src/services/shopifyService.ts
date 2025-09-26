// Shopify Storefront API Service
import { shopifyRequest, CART_STORAGE_KEY } from '../config/shopify';
import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_QUERY,
  CREATE_CART_MUTATION,
  GET_CART_QUERY,
  ADD_TO_CART_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
} from '../graphql/queries';
import {
  ShopifyProduct,
  ShopifyCart,
  ShopifyProductVariant,
  ShopifyUserError,
  LocalCartItem,
} from '../types/shopify';

export class ShopifyService {
  // Get all products
  static async getProducts(first: number = 50): Promise<ShopifyProduct[]> {
    try {
      const data = await shopifyRequest(GET_PRODUCTS_QUERY, { first });
      return data.products.edges.map((edge: any) => edge.node);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  // Get a single product by handle
  static async getProduct(handle: string): Promise<ShopifyProduct | null> {
    try {
      const data = await shopifyRequest(GET_PRODUCT_QUERY, { handle });
      return data.productByHandle;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  }

  // Create a new cart
  static async createCart(): Promise<ShopifyCart> {
    try {
      const data = await shopifyRequest(CREATE_CART_MUTATION, {
        input: { lines: [] }
      });
      
      if (data.cartCreate.userErrors.length > 0) {
        throw new Error(data.cartCreate.userErrors.map((e: ShopifyUserError) => e.message).join(', '));
      }

      const cart = data.cartCreate.cart;
      // Store cart ID in localStorage
      localStorage.setItem(CART_STORAGE_KEY, cart.id);
      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  // Get cart by ID
  static async getCart(cartId: string): Promise<ShopifyCart | null> {
    try {
      const data = await shopifyRequest(GET_CART_QUERY, { cartId });
      return data.cart;
    } catch (error) {
      console.error('Error fetching cart:', error);
      return null;
    }
  }

  // Get or create cart
  static async getOrCreateCart(): Promise<ShopifyCart> {
    const storedCartId = localStorage.getItem(CART_STORAGE_KEY);
    
    if (storedCartId) {
      const cart = await this.getCart(storedCartId);
      if (cart) {
        return cart;
      }
      // If cart doesn't exist, remove from storage and create new one
      localStorage.removeItem(CART_STORAGE_KEY);
    }

    return this.createCart();
  }

  // Add items to cart
  static async addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart> {
    try {
      const data = await shopifyRequest(ADD_TO_CART_MUTATION, {
        cartId,
        lines: [{ merchandiseId: variantId, quantity }]
      });

      if (data.cartLinesAdd.userErrors.length > 0) {
        throw new Error(data.cartLinesAdd.userErrors.map((e: ShopifyUserError) => e.message).join(', '));
      }

      return data.cartLinesAdd.cart;
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    }
  }

  // Update cart line quantities
  static async updateCartLines(cartId: string, lineId: string, quantity: number): Promise<ShopifyCart> {
    try {
      const data = await shopifyRequest(UPDATE_CART_LINES_MUTATION, {
        cartId,
        lines: [{ id: lineId, quantity }]
      });

      if (data.cartLinesUpdate.userErrors.length > 0) {
        throw new Error(data.cartLinesUpdate.userErrors.map((e: ShopifyUserError) => e.message).join(', '));
      }

      return data.cartLinesUpdate.cart;
    } catch (error) {
      console.error('Error updating cart lines:', error);
      throw error;
    }
  }

  // Remove lines from cart
  static async removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart> {
    try {
      const data = await shopifyRequest(REMOVE_CART_LINES_MUTATION, {
        cartId,
        lineIds: [lineId]
      });

      if (data.cartLinesRemove.userErrors.length > 0) {
        throw new Error(data.cartLinesRemove.userErrors.map((e: ShopifyUserError) => e.message).join(', '));
      }

      return data.cartLinesRemove.cart;
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }

  // Convert Shopify cart to local cart items
  static convertCartToLocalItems(cart: ShopifyCart): LocalCartItem[] {
    return cart.lines.edges.map(edge => {
      const line = edge.node;
      const variant = line.merchandise;
      const product = variant.product;
      const image = product.images.edges[0]?.node;

      return {
        id: line.id,
        name: product.title,
        price: parseFloat(variant.price.amount),
        quantity: line.quantity,
        flavor: variant.title,
        image: image?.url,
        variantId: variant.id,
        productId: product.id,
        handle: product.handle,
      };
    });
  }

  // Find product variant by flavor/option
  static findVariantByFlavor(product: ShopifyProduct, flavor: string): ShopifyProductVariant | null {
    const variant = product.variants.edges.find(edge => 
      edge.node.title.toLowerCase().includes(flavor.toLowerCase()) ||
      edge.node.selectedOptions.some(option => 
        option.value.toLowerCase().includes(flavor.toLowerCase())
      )
    );
    
    return variant ? variant.node : product.variants.edges[0]?.node || null;
  }

  // Get checkout URL
  static async getCheckoutUrl(): Promise<string> {
    const cart = await this.getOrCreateCart();
    return cart.checkoutUrl;
  }
}
