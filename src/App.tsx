import React, { useState, useEffect } from 'react';
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
import Profile from './components/Profile';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import AdminLogin from './components/Admin/AdminLogin';
import AdminPanel from './components/Admin/AdminPanel';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { getProductBySlug } from './data/products';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [currentProductSlug, setCurrentProductSlug] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);

  // Check if accessing admin route
  useEffect(() => {
    const checkAdminRoute = () => {
      const path = window.location.pathname;
      const isAdminRoute = path === '/admin' || path === '/admin/' || path.startsWith('/admin');
      
      if (isAdminRoute) {
        const adminStatus = localStorage.getItem('isAdmin') === 'true';
        setIsAdmin(adminStatus);
        setShowAdminPanel(true);
      } else {
        setShowAdminPanel(false);
      }
    };

    // Check on mount
    checkAdminRoute();

    // Listen for popstate (back/forward buttons)
    window.addEventListener('popstate', checkAdminRoute);

    // Listen for hashchange as well
    window.addEventListener('hashchange', checkAdminRoute);

    // Check more frequently for direct navigation
    const interval = setInterval(checkAdminRoute, 100);

    return () => {
      window.removeEventListener('popstate', checkAdminRoute);
      window.removeEventListener('hashchange', checkAdminRoute);
      clearInterval(interval);
    };
  }, []);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHomeClick = () => {
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfileClick = () => {
    setCurrentPage('profile');
  };

  const handleLoginClick = () => {
    setIsLoginOpen(true);
  };

  const handleSignupClick = () => {
    setIsSignupOpen(true);
  };

  const handleSwitchToSignup = () => {
    setIsLoginOpen(false);
    setIsSignupOpen(true);
  };

  const handleSwitchToLogin = () => {
    setIsSignupOpen(false);
    setIsLoginOpen(true);
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
    setCurrentProductSlug(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    setShowAdminPanel(false);
    window.location.href = '/';
  };

  const navigateToAdmin = () => {
    // Use window.location to ensure proper navigation
    if (window.location.pathname !== '/admin') {
      window.location.href = '/admin';
    } else {
      // If already on /admin, just trigger the check
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
      setShowAdminPanel(true);
    }
  };

  // Keyboard shortcut to access admin panel from anywhere (Ctrl/Cmd + Shift + A)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigateToAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    
    // Log admin access info to console (only in development)
    if (import.meta.env.DEV) {
      console.log('%c🔐 Admin Panel Access', 'color: #3b82f6; font-weight: bold; font-size: 14px;');
      console.log('%cPress Ctrl+Shift+A (or Cmd+Shift+A on Mac) to access admin panel from anywhere', 'color: #6b7280;');
      console.log('%cOr navigate to: /admin', 'color: #6b7280;');
    }
    
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Admin Panel Route
  if (showAdminPanel) {
    if (!isAdmin) {
      return <AdminLogin onLoginSuccess={handleAdminLoginSuccess} />;
    }
    return (
      <AuthProvider>
        <CartProvider>
          <AdminPanel onLogout={handleAdminLogout} />
        </CartProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        {isCheckoutOpen ? (
          <Checkout onBack={handleCheckoutBack} />
        ) : currentPage === 'profile' ? (
          <div className="min-h-screen">
            <Header 
              onCartClick={handleCartClick} 
              onAboutClick={handleAboutClick} 
              onHomeClick={handleHomeClick} 
              onSectionClick={handleSectionClick}
              onLoginClick={handleLoginClick}
              onSignupClick={handleSignupClick}
              onProfileClick={handleProfileClick}
              currentPage={currentPage}
              onAdminClick={navigateToAdmin}
            />
            <div className="pt-20">
              <Profile />
            </div>
            <Footer onContactClick={handleContactClick} onAboutClick={handleAboutClick} />
            <Cart 
              isOpen={isCartOpen}
              onClose={handleCartClose}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        ) : currentPage === 'product' && currentProductSlug ? (
          <>
            {(() => {
              const product = getProductBySlug(currentProductSlug);
              if (!product) {
                return (
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
                );
              }

              return (
                <div className="min-h-screen">
                  <Header 
                    onCartClick={handleCartClick} 
                    onAboutClick={handleAboutClick} 
                    onHomeClick={handleHomeClick} 
                    onSectionClick={handleSectionClick}
                    onLoginClick={handleLoginClick}
                    onSignupClick={handleSignupClick}
                    onProfileClick={handleProfileClick}
                    currentPage={currentPage}
                  />
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
              );
            })()}
          </>
        ) : currentPage === 'learn-more' ? (
          <div className="min-h-screen">
            <Header 
              onCartClick={handleCartClick} 
              onAboutClick={handleAboutClick} 
              onHomeClick={handleHomeClick} 
              onSectionClick={handleSectionClick}
              onLoginClick={handleLoginClick}
              onSignupClick={handleSignupClick}
              onProfileClick={handleProfileClick}
              currentPage={currentPage}
              onAdminClick={navigateToAdmin}
            />
            <LearnMore />
            <Footer onContactClick={handleContactClick} onAboutClick={handleAboutClick} />
            <Cart 
              isOpen={isCartOpen}
              onClose={handleCartClose}
              onProceedToCheckout={handleProceedToCheckout}
            />
          </div>
        ) : (
          <div className="min-h-screen">
            <Header 
              onCartClick={handleCartClick} 
              onAboutClick={handleAboutClick} 
              onHomeClick={handleHomeClick} 
              onSectionClick={handleSectionClick}
              onLoginClick={handleLoginClick}
              onSignupClick={handleSignupClick}
              onProfileClick={handleProfileClick}
            />
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
        )}

        {/* Auth Modals */}
        {isLoginOpen && (
          <Login 
            onClose={() => setIsLoginOpen(false)} 
            onSwitchToSignup={handleSwitchToSignup}
          />
        )}
        {isSignupOpen && (
          <Signup 
            onClose={() => setIsSignupOpen(false)} 
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
