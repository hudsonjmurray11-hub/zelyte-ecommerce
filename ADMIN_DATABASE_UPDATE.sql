-- Admin Panel Database Update
-- Run this SQL in Supabase to allow admin to view all orders

-- For now, we'll disable RLS on orders table to allow reading all orders
-- In production, you should create a proper admin role system

-- Temporarily disable RLS for reading orders (allows admin panel to work)
-- Note: This allows any authenticated user to read all orders
-- For production, implement proper role-based access control

DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Create new policy that allows reading all orders
-- You can add admin check here later
CREATE POLICY "Allow reading all orders"
  ON public.orders FOR SELECT
  USING (true);

-- Users can still only create their own orders
CREATE POLICY "Users can create own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: For better security in production:
-- 1. Create an admin_users table
-- 2. Add admin role checks to policies
-- 3. Use service role key on backend for admin operations




