// Shopify Storefront API Configuration
export const SHOPIFY_CONFIG = {
  // Your Shopify store domain (without .myshopify.com)
  shopDomain: 'wf71ya-p7',
  // Storefront API access token (you'll need to generate this)
  storefrontAccessToken: process.env.REACT_APP_SHOPIFY_STOREFRONT_TOKEN || '',
  // API version - using latest stable version
  apiVersion: '2025-07',
  // GraphQL endpoint
  endpoint: `https://${process.env.REACT_APP_SHOPIFY_DOMAIN || 'wf71ya-p7'}.myshopify.com/api/${process.env.REACT_APP_SHOPIFY_API_VERSION || '2025-07'}/graphql.json`
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

  const data = await response.json();
  
  // Handle errors according to Shopify API documentation
  if (data.errors) {
    const errorMessages = data.errors.map((e: any) => {
      if (e.extensions?.code) {
        return `${e.extensions.code}: ${e.message}`;
      }
      return e.message;
    }).join(', ');
    
    throw new Error(`Shopify API errors: ${errorMessages}`);
  }

  // Even with 200 OK, check for errors in response
  if (!response.ok) {
    throw new Error(`Shopify API request failed: ${response.status} ${response.statusText}`);
  }

  return data.data;
}

// Cart ID storage key for localStorage
export const CART_STORAGE_KEY = 'zelyte-cart-id';
