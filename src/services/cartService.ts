import { supabase, Cart, OrderItem } from '../config/supabase';

export const cartService = {
  // Get user's cart
  async getCart(userId: string): Promise<{ data: Cart | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('carts')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned"
        throw error;
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { data: null, error: error as Error };
    }
  },

  // Create or update cart
  async upsertCart(userId: string, items: OrderItem[]): Promise<{ data: Cart | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('carts')
        .upsert({
          user_id: userId,
          items: items,
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error upserting cart:', error);
      return { data: null, error: error as Error };
    }
  },

  // Clear user's cart
  async clearCart(userId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('carts')
        .update({ items: [] })
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { error: error as Error };
    }
  },
};

