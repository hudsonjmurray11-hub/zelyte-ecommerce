import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductShowcase from './components/ProductShowcase';
import Science from './components/Science';
import Testimonials from './components/Testimonials';
import Purchase from './components/Subscription';
import Footer from './components/Footer';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import LearnMore from './components/LearnMore';
import ProductDetail from './components/ProductDetail';
import { CartProvider } from './contexts/CartContext';
import { getProductBySlug } from './data/products';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProductSlug, setCurrentProductSlug] = useState<string | null>(null);

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleCheckoutBack = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(true);
  };

  const handleCheckoutComplete = () => {
    setIsCheckoutOpen(false);
  };

  const handleAboutClick = () => {
    setCurrentPage('learn-more');
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
  };

  const handleSectionClick = (section: string) => {
    if (currentPage !== 'home') {
      // If we're not on home page, go to home first
      setCurrentPage('home');
      setCurrentProductSlug(null);
      // Then scroll to the section after a brief delay
      setTimeout(() => {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // If we're already on home page, just scroll to the section
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleProductClick = (slug: string) => {
    setCurrentProductSlug(slug);
    setCurrentPage('product');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCurrentProductSlug(null);
  };

  const handleContactClick = () => {
    setCurrentPage('learn-more');
    // Scroll to Meet the Team section after navigation
    const scrollToTeam = () => {
      const element = document.getElementById('meet-the-team');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        // If element not found, try again after a short delay
        setTimeout(scrollToTeam, 100);
      }
    };
    
    // Start trying to scroll after a brief delay
    setTimeout(scrollToTeam, 200);
  };

  if (isCheckoutOpen) {
    return (
      <CartProvider>
        <Checkout onBack={handleCheckoutBack} />
      </CartProvider>
    );
  }

  if (currentPage === 'product' && currentProductSlug) {
    const product = getProductBySlug(currentProductSlug);
    if (!product) {
      return (
        <CartProvider>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
              <p className="text-gray-600 mb-8">The product you're looking for doesn't exist.</p>
              <button
                onClick={handleBackToHome}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Back to Home
              </button>
            </div>
          </div>
        </CartProvider>
      );
    }

    return (
      <CartProvider>
        <div className="min-h-screen">
          <Header onCartClick={handleCartClick} onAboutClick={handleAboutClick} onHomeClick={handleHomeClick} onSectionClick={handleSectionClick} currentPage={currentPage} />
          <ProductDetail 
            product={product} 
            onBack={handleBackToHome} 
            onProductClick={handleProductClick}
            onCartClick={handleCartClick}
            onShopNowClick={() => handleSectionClick('purchase')}
          />
          <Footer onContactClick={handleContactClick} onAboutClick={handleAboutClick} />
          <Cart 
            isOpen={isCartOpen}
            onClose={handleCartClose}
            onProceedToCheckout={handleProceedToCheckout}
          />
        </div>
      </CartProvider>
    );
  }

  if (currentPage === 'learn-more') {
    return (
      <CartProvider>
        <div className="min-h-screen">
          <Header onCartClick={handleCartClick} onAboutClick={handleAboutClick} onHomeClick={handleHomeClick} onSectionClick={handleSectionClick} currentPage={currentPage} />
          <LearnMore />
          <Footer onContactClick={handleContactClick} onAboutClick={handleAboutClick} />
          <Cart 
            isOpen={isCartOpen}
            onClose={handleCartClose}
            onProceedToCheckout={handleProceedToCheckout}
          />
        </div>
      </CartProvider>
    );
  }

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header onCartClick={handleCartClick} onAboutClick={handleAboutClick} onHomeClick={handleHomeClick} onSectionClick={handleSectionClick} />
        <Hero onLearnMoreClick={handleAboutClick} />
        <ProductShowcase onProductClick={handleProductClick} />
        <Science />
        <Testimonials />
        <Purchase />
        <Footer />
        <Cart 
          isOpen={isCartOpen}
          onClose={handleCartClose}
          onProceedToCheckout={handleProceedToCheckout}
        />
      </div>
    </CartProvider>
  );
}

export default App;