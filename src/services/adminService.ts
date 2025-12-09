import { supabase } from '../config/supabase';
import { ProductFormData, DiscountCode, AnnouncementBanner, ContentSettings, BrandSettings, BusinessSettings } from '../types/admin';

export const adminService = {
  // Dashboard Stats
  async getDashboardStats() {
    try {
      // Get orders for stats
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const weekStart = new Date(now.setDate(now.getDate() - 7));

      const todayOrders = orders?.filter(o => new Date(o.created_at) >= todayStart) || [];
      const thisWeekOrders = orders?.filter(o => new Date(o.created_at) >= weekStart) || [];

      // Calculate product stats from order items
      const productStats: { [key: string]: { quantity: number; revenue: number; name: string } } = {};
      
      orders?.forEach(order => {
        if (order.items && Array.isArray(order.items)) {
          order.items.forEach((item: any) => {
            const productId = item.id || item.name;
            if (!productStats[productId]) {
              productStats[productId] = { quantity: 0, revenue: 0, name: item.name };
            }
            productStats[productId].quantity += item.quantity || 1;
            productStats[productId].revenue += (item.price || 0) * (item.quantity || 1);
          });
        }
      });

      const topProducts = Object.entries(productStats)
        .map(([id, stats]) => ({ id, ...stats }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      // Get low stock products
      const { data: products } = await supabase
        .from('products')
        .select('id, name, inventory')
        .lt('inventory', 10)
        .eq('active', true);

      return {
        totalRevenue: orders?.reduce((sum, o) => sum + Number(o.total_amount || 0), 0) || 0,
        totalOrders: orders?.length || 0,
        completedOrders: orders?.filter(o => o.status === 'completed').length || 0,
        pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
        todayOrders: todayOrders.length,
        thisWeekOrders: thisWeekOrders.length,
        todayRevenue: todayOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
        thisWeekRevenue: thisWeekOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0),
        topProducts,
        lowStockProducts: products?.map(p => ({ id: p.id, name: p.name, inventory: p.inventory })) || [],
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  // Products CRUD
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getProduct(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createProduct(product: ProductFormData) {
    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, product: Partial<ProductFormData>) {
    const { data, error } = await supabase
      .from('products')
      .update(product)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Customers
  async getCustomers() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Discount Codes
  async getDiscountCodes() {
    const { data, error } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async createDiscountCode(code: DiscountCode) {
    const { data, error } = await supabase
      .from('discount_codes')
      .insert(code)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateDiscountCode(id: string, code: Partial<DiscountCode>) {
    const { data, error } = await supabase
      .from('discount_codes')
      .update(code)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async deleteDiscountCode(id: string) {
    const { error } = await supabase
      .from('discount_codes')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Announcement Banner
  async getAnnouncementBanner() {
    const { data, error } = await supabase
      .from('announcement_banner')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data;
  },

  async updateAnnouncementBanner(banner: Partial<AnnouncementBanner>) {
    const existing = await this.getAnnouncementBanner();
    
    if (existing) {
      const { data, error } = await supabase
        .from('announcement_banner')
        .update(banner)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('announcement_banner')
        .insert(banner)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Content Settings
  async getContentSettings() {
    const { data, error } = await supabase
      .from('content_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateContentSettings(settings: Partial<ContentSettings>) {
    const existing = await this.getContentSettings();
    
    if (existing) {
      const { data, error } = await supabase
        .from('content_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('content_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Brand Settings
  async getBrandSettings() {
    const { data, error } = await supabase
      .from('brand_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateBrandSettings(settings: Partial<BrandSettings>) {
    const existing = await this.getBrandSettings();
    
    if (existing) {
      const { data, error } = await supabase
        .from('brand_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('brand_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },

  // Business Settings
  async getBusinessSettings() {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async updateBusinessSettings(settings: Partial<BusinessSettings>) {
    const existing = await this.getBusinessSettings();
    
    if (existing) {
      const { data, error } = await supabase
        .from('business_settings')
        .update(settings)
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('business_settings')
        .insert(settings)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    }
  },
};

