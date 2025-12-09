import { supabase } from '../config/supabase';

export interface ProductReview {
  id?: string;
  product_id: string;
  user_id?: string;
  user_name: string;
  user_email?: string;
  rating: number;
  title?: string;
  review_text: string;
  verified_purchase?: boolean;
  helpful_count?: number;
  created_at?: string;
  updated_at?: string;
}

export const reviewService = {
  // Get reviews for a product
  async getProductReviews(productId: string): Promise<ProductReview[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  },

  // Create a new review
  async createReview(review: Omit<ProductReview, 'id' | 'created_at' | 'updated_at'>): Promise<{ data: ProductReview | null; error: Error | null }> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const reviewData = {
        ...review,
        user_id: user?.id || null,
      };

      const { data, error } = await supabase
        .from('product_reviews')
        .insert(reviewData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating review:', error);
      return { data: null, error: error as Error };
    }
  },

  // Update a review
  async updateReview(reviewId: string, updates: Partial<ProductReview>): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .update(updates)
        .eq('id', reviewId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error updating review:', error);
      return { error: error as Error };
    }
  },

  // Delete a review
  async deleteReview(reviewId: string): Promise<{ error: Error | null }> {
    try {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error deleting review:', error);
      return { error: error as Error };
    }
  },

  // Mark review as helpful
  async markHelpful(reviewId: string): Promise<{ error: Error | null }> {
    try {
      // Get current helpful count
      const { data: review } = await supabase
        .from('product_reviews')
        .select('helpful_count')
        .eq('id', reviewId)
        .single();

      if (review) {
        const { error } = await supabase
          .from('product_reviews')
          .update({ helpful_count: (review.helpful_count || 0) + 1 })
          .eq('id', reviewId);

        if (error) throw error;
      }
      return { error: null };
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      return { error: error as Error };
    }
  },
};

