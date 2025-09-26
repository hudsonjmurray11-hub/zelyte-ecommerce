// Shopify Storefront API Configuration
export const SHOPIFY_CONFIG = {
  // Your Shopify store domain (without .myshopify.com)
  shopDomain: 'wf71ya-p7',
  // Storefront API access token (you'll need to generate this)
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || '',
  // API version
  apiVersion: '2024-01',
  // GraphQL endpoint
  endpoint: `https://${process.env.REACT_APP_SHOPIFY_DOMAIN || 'wf71ya-p7'}.myshopify.com/api/${process.env.REACT_APP_SHOPIFY_API_VERSION || '2024-01'}/graphql.json`
};

// Helper function to make GraphQL requests
export async function shopifyRequest(query: string, variables: Record<string, any> = {}) {
  const response = await fetch(SHOPIFY_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_CONFIG.storefrontAccessToken,
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.statusText}`);
  }

  const data = await response.json();
  
  if (data.errors) {
    throw new Error(`GraphQL errors: ${data.errors.map((e: any) => e.message).join(', ')}`);
  }

  return data.data;
}

// Cart ID storage key for localStorage
export const CART_STORAGE_KEY = 'zelyte-cart-id';
