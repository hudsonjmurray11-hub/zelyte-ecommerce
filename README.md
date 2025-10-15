# Zelyte - Premium Electrolyte Hydration

A modern e-commerce platform for Zelyte electrolyte products with **Supabase authentication**, **PostgreSQL database**, and **Stripe payment integration**.

## Features

✅ **User Authentication** - Sign up, login, and secure user sessions with Supabase Auth  
✅ **Shopping Cart** - Add products to cart with local storage for guests and database sync for logged-in users  
✅ **Order Management** - Complete orders and view order history  
✅ **User Profiles** - Manage account information and view past orders  
✅ **Stripe Integration** - Secure payment processing (demo mode included)  
✅ **Responsive Design** - Beautiful UI that works on all devices  

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase Database

Go to your Supabase project's SQL Editor and run the SQL from `DATABASE_SCHEMA.sql`:

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Navigate to your project: **wokkqrtigvznkksswjcv**
3. Go to **SQL Editor** (in the left sidebar)
4. Click **"+ New query"**
5. Copy and paste the entire contents of `DATABASE_SCHEMA.sql`
6. Click **"Run"** or press Ctrl+Enter

This will create:
- `users` table - User profiles
- `orders` table - Order history
- `carts` table - Shopping cart data
- Row Level Security policies
- Automatic triggers for user creation and timestamps

### 3. Environment Variables

Your `.env` file is already configured with:
- ✅ Supabase URL
- ✅ Supabase Anon Key
- ⚠️ Need to add Stripe Publishable Key (optional for demo)

To add Stripe (optional):
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your publishable key from **Developers > API keys**
3. Update `VITE_STRIPE_PUBLISHABLE_KEY` in `.env`

### 4. Run the Application

```bash
npm run dev
```

Your app will be running at `http://localhost:5173`

## Project Structure

```
src/
├── components/          # React components
│   ├── Auth/           # Login and Signup modals
│   │   ├── Login.tsx
│   │   └── Signup.tsx
│   ├── Cart.tsx        # Shopping cart
│   ├── Checkout.tsx    # Checkout page
│   ├── Header.tsx      # Navigation with auth buttons
│   ├── Profile.tsx     # User profile and order history
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx # Authentication state
│   └── CartContext.tsx # Shopping cart state
├── services/           # API services
│   ├── cartService.ts  # Cart database operations
│   ├── orderService.ts # Order database operations
│   └── stripeService.ts# Stripe integration
├── config/             # Configuration
│   ├── supabase.ts     # Supabase client
│   └── stripe.ts       # Stripe client
└── types/              # TypeScript types

```

## Usage Guide

### For Users

1. **Browse Products** - View all available Zelyte flavors on the homepage
2. **Add to Cart** - Click "Add to Cart" on any product
3. **Sign Up** - Create an account to checkout (click "Sign Up" in header)
4. **Checkout** - Review cart and complete your order
5. **View Orders** - Click your profile icon > "My Orders" to see order history

### For Developers

#### Authentication

```typescript
import { useAuth } from './contexts/AuthContext';

const { user, signIn, signUp, signOut } = useAuth();

// Sign up
await signUp('email@example.com', 'password', 'Full Name');

// Sign in
await signIn('email@example.com', 'password');

// Sign out
await signOut();
```

#### Cart Management

```typescript
import { useCart } from './contexts/CartContext';

const { cartItems, addToCart, removeFromCart, clearCart } = useCart();

// Add item
await addToCart({
  id: 'product-id',
  name: 'Coconut Citrus',
  price: 10,
  flavor: 'Coconut',
  image: '/image.png'
});
```

#### Orders

```typescript
import { orderService } from './services/orderService';

// Create order
const { data, error } = await orderService.createOrder(userId, {
  items: cartItems,
  totalAmount: 30,
  shippingAddress: {...}
});

// Get user orders
const { data: orders } = await orderService.getUserOrders(userId);
```

## Database Schema

### Tables

**users**
- `id` - UUID (references auth.users)
- `email` - User email
- `full_name` - User's full name
- `phone` - Phone number
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

**orders**
- `id` - UUID (auto-generated)
- `user_id` - References auth.users
- `items` - JSONB array of order items
- `total_amount` - Order total
- `status` - pending | processing | completed | cancelled
- `stripe_session_id` - Stripe checkout session ID
- `shipping_address` - JSONB shipping details
- `created_at` - Order creation timestamp

**carts**
- `id` - UUID (auto-generated)
- `user_id` - References auth.users (unique)
- `items` - JSONB array of cart items
- `created_at` - Cart creation timestamp
- `updated_at` - Last update timestamp

## Security

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Secure authentication with Supabase Auth
- ✅ HTTPS enforced in production
- ✅ Environment variables for sensitive keys
- ⚠️ Service role key kept secure (never use in frontend!)

## Stripe Integration

**Current Status:** Demo mode

For production use, you need:
1. A backend server (Node.js, Python, etc.)
2. Backend endpoint to create Stripe checkout sessions
3. Webhook handler for payment confirmations

See `src/services/stripeService.ts` for implementation notes.

## Production Deployment

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Deploy to hosting platform:**
   - Vercel (recommended)
   - Netlify
   - AWS Amplify
   - Any static hosting

3. **Set environment variables on hosting platform**

4. **Set up Stripe webhooks** (for production payments)

## Support

For questions or issues:
- Check `SETUP.md` for detailed setup instructions
- Review code comments in `src/` files
- Check Supabase documentation: https://supabase.com/docs

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Styling:** Tailwind CSS
- **Auth & Database:** Supabase
- **Payments:** Stripe
- **Icons:** Lucide React

## License

Private project for Zelyte.

---

Built with ❤️ for Zelyte Premium Hydration

