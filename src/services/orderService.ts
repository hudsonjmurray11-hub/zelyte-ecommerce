import { supabase, Order, OrderItem } from '../config/supabase';

export interface CreateOrderData {
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  stripeSessionId?: string;
}

export const orderService = {
  // Create a new order
  async createOrder(userId: string, orderData: CreateOrderData): Promise<{ data: Order | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert({
          user_id: userId,
          items: orderData.items,
          total_amount: orderData.totalAmount,
          shipping_address: orderData.shippingAddress,
          stripe_session_id: orderData.stripeSessionId,
          status: 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null, error: error as Error };
    }
  },

  // Get user's orders
  async getUserOrders(userId: string): Promise<{ data: Order[] | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching orders:', error);
      return { data: null, error: error as Error };
    }
  },

  // Get a single order by ID
  async getOrderById(orderId: string): Promise<{ data: Order | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching order:', error);
      return { data: null, error: error as Error };
    }
  },

  // Update order status
  async updateOrderStatus(
    orderId: string,
    status: 'pending' | 'processing' | 'completed' | 'cancelled',
    paymentIntent?: string
  ): Promise<{ error: Error | null }> {
    try {
      const updateData: any = { status };
      if (paymentIntent) {
        updateData.stripe_payment_intent = paymentIntent;
      }

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { error: error as Error };
    }
  },
};

