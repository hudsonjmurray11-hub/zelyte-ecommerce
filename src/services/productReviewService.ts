import { supabase } from '../config/supabase';
import { reviewService, ProductReview } from './reviewService';

export interface ProductReviewStats {
  averageRating: number;
  totalReviews: number;
  reviews: ProductReview[];
}

// Get review statistics for all products
export const productReviewService = {
  // Get review stats for a single product
  async getProductReviewStats(productId: string): Promise<ProductReviewStats> {
    try {
      const reviews = await reviewService.getProductReviews(productId);
      
      if (reviews.length === 0) {
        return {
          averageRating: 0,
          totalReviews: 0,
          reviews: [],
        };
      }

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const averageRating = totalRating / reviews.length;

      return {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: reviews.length,
        reviews,
      };
    } catch (error) {
      console.error('Error getting product review stats:', error);
      return {
        averageRating: 0,
        totalReviews: 0,
        reviews: [],
      };
    }
  },

  // Get review stats for multiple products
  async getAllProductsReviewStats(productIds: string[]): Promise<{ [productId: string]: ProductReviewStats }> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .in('product_id', productIds);

      if (error) {
        // If table doesn't exist, return empty stats
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('Reviews table does not exist yet. Run REVIEWS_DATABASE_SCHEMA.sql');
          return {};
        }
        throw error;
      }

      const stats: { [productId: string]: ProductReviewStats } = {};

      productIds.forEach(productId => {
        const productReviews = (data || []).filter(r => r.product_id === productId);
        
        if (productReviews.length === 0) {
          stats[productId] = {
            averageRating: 0,
            totalReviews: 0,
            reviews: [],
          };
        } else {
          const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRating / productReviews.length;

          stats[productId] = {
            averageRating: Math.round(averageRating * 10) / 10,
            totalReviews: productReviews.length,
            reviews: productReviews,
          };
        }
      });

      return stats;
    } catch (error) {
      console.error('Error getting all products review stats:', error);
      return {};
    }
  },

  // Get all reviews across all products (for testimonials)
  async getAllReviews(limit: number = 10): Promise<ProductReview[]> {
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        // If table doesn't exist, return empty array
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          console.log('Reviews table does not exist yet. Run REVIEWS_DATABASE_SCHEMA.sql');
          return [];
        }
        throw error;
      }
      return data || [];
    } catch (error) {
      console.error('Error getting all reviews:', error);
      return [];
    }
  },
};

