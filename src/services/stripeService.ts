import { getStripe } from '../config/stripe';
import { CartItem } from '../contexts/CartContext';

export interface CheckoutSessionData {
  items: CartItem[];
  successUrl: string;
  cancelUrl: string;
}

export const stripeService = {
  // Redirect to Stripe Checkout
  async redirectToCheckout(items: CartItem[], customerEmail?: string): Promise<{ error: Error | null }> {
    try {
      const stripe = await getStripe();
      
      if (!stripe) {
        throw new Error('Stripe is not initialized. Please check your Stripe configuration.');
      }

      // Convert cart items to Stripe line items format
      const lineItems = items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            description: item.flavor ? `Flavor: ${item.flavor}` : undefined,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      // For production, you would call your backend API to create a checkout session
      // For now, we'll redirect with Stripe's client-side checkout (LIMITED FUNCTIONALITY)
      
      // NOTE: This is a simplified version. In production, create checkout sessions on your backend
      // For a full implementation, you need a backend server that creates Stripe sessions
      
      console.warn(
        'This is a client-side Stripe integration demo. ' +
        'For production, implement a backend server to create Stripe checkout sessions securely.'
      );

      // Since we can't create sessions client-side, we'll redirect to a payment link
      // You should replace this with a proper backend implementation
      
      return {
        error: new Error(
          'Backend server required. Please implement a backend API to create Stripe checkout sessions. ' +
          'See SETUP.md for more information.'
        ),
      };
      
    } catch (error) {
      console.error('Error redirecting to Stripe checkout:', error);
      return { error: error as Error };
    }
  },

  // Helper to format price for display
  formatPrice(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  },
};

// Note: For a complete Stripe integration, you need:
// 1. A backend server (Node.js, Python, etc.)
// 2. Stripe API secret key (stored securely on backend)
// 3. Backend endpoint to create checkout sessions
// 4. Webhook endpoint to handle payment events
//
// Example backend endpoint (Node.js/Express):
/*
app.post('/create-checkout-session', async (req, res) => {
  const { items, customerEmail } = req.body;
  
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items,
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
    customer_email: customerEmail,
  });
  
  res.json({ sessionId: session.id });
});
*/

