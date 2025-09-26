# Shopify Storefront API Integration Setup

This guide will help you set up the Shopify Storefront API integration for your Zelyte React app.

## Prerequisites

1. A Shopify store (you already have `wf71ya-p7.myshopify.com`)
2. Admin access to your Shopify store
3. Products created in your Shopify admin

## Step 1: Create a Storefront API Access Token

1. Go to your Shopify Admin: `https://wf71ya-p7.myshopify.com/admin`
2. Navigate to **Apps** → **App and sales channel settings**
3. Click **Develop apps** → **Create an app**
4. Name your app (e.g., "Zelyte Storefront API")
5. Click **Create app**
6. Go to **Configuration** tab
7. Under **Storefront API access**, check **Allow this app to access your storefront data**
8. Click **Save**
9. Go to **API credentials** tab
10. Under **Storefront access token**, click **Install app** then **Generate token**
11. Copy the generated token (it starts with `shpat_`)

## Step 2: Set Up Environment Variables

1. Copy `env.example` to `.env` in your project root
2. Fill in your actual values:

```env
REACT_APP_SHOPIFY_DOMAIN=wf71ya-p7
REACT_APP_SHOPIFY_STOREFRONT_TOKEN=your_actual_token_here
REACT_APP_SHOPIFY_API_VERSION=2024-01
```

## Step 3: Create Products in Shopify Admin

You need to create products in your Shopify admin that match your app's product structure:

### Required Products:

1. **Coconut Citrus** (handle: `coconut-citrus`)
2. **Peppermint** (handle: `peppermint`) 
3. **Lemon Lime** (handle: `lemon-lime`)
4. **Wintergreen** (handle: `wintergreen`)

### Product Setup:

1. Go to **Products** in your Shopify admin
2. Click **Add product**
3. Set the **Product title** and **Handle** (use the handles above)
4. Add product descriptions, images, and pricing
5. Make sure products are **Active** and **Available**
6. Set **Inventory tracking** if needed
7. Save the product

### Bundle Products (Optional):

If you want to support bundles:
- **3-Pack Bundle** (handle: `3-pack-bundle`)
- **6-Pack Bundle** (handle: `6-pack-bundle`)

## Step 4: Test the Integration

1. Start your development server: `npm start`
2. Open your app and try adding products to cart
3. Check the browser console for any errors
4. Test the checkout flow

## Step 5: Deploy to Production

1. Make sure your `.env` file is configured for production
2. Build your app: `npm run build`
3. Copy the built files to your Shopify theme as before
4. Test the live integration

## Troubleshooting

### Common Issues:

1. **"Invalid token" error**: Double-check your Storefront API token
2. **"Product not found" error**: Make sure products exist in Shopify with correct handles
3. **CORS errors**: This shouldn't happen with Storefront API, but check your domain configuration

### Debug Mode:

Add this to your `.env` file to enable debug logging:
```env
REACT_APP_DEBUG_SHOPIFY=true
```

## API Limitations

- Storefront API is read-only for most operations
- Cart operations are limited to what's implemented
- For full e-commerce features, consider using Shopify's Admin API or checkout extensions

## Security Notes

- Never commit your `.env` file to version control
- Storefront API tokens are safe to use in frontend code
- The token only has access to storefront data (products, collections, cart)

## Next Steps

1. Set up proper error handling and loading states
2. Add product search and filtering
3. Implement customer accounts (requires additional setup)
4. Add analytics tracking
5. Set up webhooks for order processing

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify your Shopify products exist and are active
3. Test with Shopify's GraphQL playground: `https://wf71ya-p7.myshopify.com/api/2024-01/graphql.json`
