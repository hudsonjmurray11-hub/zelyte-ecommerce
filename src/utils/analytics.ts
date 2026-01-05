/**
 * Analytics utility for tracking user events
 * 
 * To enable Google Analytics:
 * 1. Add your GA4 Measurement ID to .env: VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
 * 2. The script will automatically load and track events
 */

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

// Initialize Google Analytics
export const initAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  
  if (!measurementId) {
    console.log('Analytics: No measurement ID provided. Set VITE_GA_MEASUREMENT_ID in .env to enable.');
    return;
  }

  // Load Google Analytics script
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.appendChild(script);

  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_path: window.location.pathname,
  });
};

// Track page views
export const trackPageView = (path: string, title?: string) => {
  if (window.gtag) {
    window.gtag('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title || document.title,
    });
  }
};

// Track events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
  
  // Also log in development
  if (import.meta.env.DEV) {
    console.log('Analytics Event:', { action, category, label, value });
  }
};

// E-commerce tracking
export const trackAddToCart = (productId: string, productName: string, price: number, quantity: number = 1) => {
  trackEvent('add_to_cart', 'ecommerce', productName, price);
  
  if (window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: price * quantity,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
        quantity: quantity,
      }],
    });
  }
};

export const trackPurchase = (transactionId: string, value: number, items: Array<{
  id: string;
  name: string;
  price: number;
  quantity: number;
}>) => {
  trackEvent('purchase', 'ecommerce', transactionId, value);
  
  if (window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: 'USD',
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
};

export const trackProductView = (productId: string, productName: string, price: number) => {
  trackEvent('view_item', 'ecommerce', productName, price);
  
  if (window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: price,
      items: [{
        item_id: productId,
        item_name: productName,
        price: price,
      }],
    });
  }
};

export const trackBeginCheckout = (value: number, items: Array<{ id: string; name: string; price: number; quantity: number }>) => {
  trackEvent('begin_checkout', 'ecommerce', undefined, value);
  
  if (window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
    });
  }
};

