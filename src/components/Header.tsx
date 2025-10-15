import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, User, LogOut, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import zelyteLogo from '/Zelyte(2).png';

interface HeaderProps {
  onCartClick: () => void;
  onAboutClick?: () => void;
  onHomeClick?: () => void;
  onSectionClick?: (section: string) => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onProfileClick?: () => void;
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  onCartClick, 
  onAboutClick, 
  onHomeClick, 
  onSectionClick, 
  onLoginClick,
  onSignupClick,
  onProfileClick,
  currentPage 
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { getTotalItems } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.user-menu-container')) {
        setIsUserMenuOpen(false);
      }
    };
    
    if (isUserMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isUserMenuOpen]);

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
  };

  // Don't show header on product pages since they have their own header
  if (currentPage === 'product') {
    return null;
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button 
            onClick={onHomeClick}
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img 
              src={zelyteLogo} 
              alt="Zelyte Logo" 
              className="h-10 w-auto max-w-[200px]"
            />
          </button>
          
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => onSectionClick ? onSectionClick('products') : null}
              className={`hover:text-orange-500 transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-blue-500' : 'text-white hover:text-blue-300'
              }`}
            >
              Products
            </button>
            <button 
              onClick={() => onSectionClick ? onSectionClick('science') : null}
              className={`hover:text-orange-500 transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-blue-500' : 'text-white hover:text-blue-300'
              }`}
            >
              Science
            </button>
            <button 
              onClick={() => onSectionClick ? onSectionClick('testimonials') : null}
              className={`hover:text-orange-500 transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-blue-500' : 'text-white hover:text-blue-300'
              }`}
            >
              Reviews
            </button>
            <button 
              onClick={onAboutClick}
              className={`hover:text-blue-500 transition-colors duration-300 ${
                isScrolled ? 'text-gray-700 hover:text-blue-500' : 'text-white hover:text-blue-300'
              }`}
            >
              About Us
            </button>
            
            {/* Cart Button */}
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ShoppingCart className={`w-6 h-6 transition-colors duration-300 ${
                isScrolled ? 'text-gray-700' : 'text-white'
              }`} />
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Auth Section */}
            {user ? (
              <div className="relative user-menu-container">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 transition-colors ${
                    isScrolled ? 'text-gray-700' : 'text-white'
                  }`}
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        onProfileClick?.();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <button
                  onClick={onLoginClick}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    isScrolled 
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={onSignupClick}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
                >
                  Sign Up
                </button>
              </div>
            )}
            
            <button 
              onClick={() => onSectionClick ? onSectionClick('purchase') : null}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Shop Now
            </button>
          </div>

          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden transition-colors duration-300 ${
              isScrolled ? 'text-gray-900' : 'text-white'
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t">
            <div className="flex flex-col space-y-4 p-6">
              <button
                onClick={() => {
                  onSectionClick?.('products');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-500 transition-colors"
              >
                Products
              </button>
              <button
                onClick={() => {
                  onSectionClick?.('science');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-500 transition-colors"
              >
                Science
              </button>
              <button
                onClick={() => {
                  onSectionClick?.('testimonials');
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-500 transition-colors"
              >
                Reviews
              </button>
              <button
                onClick={() => {
                  onAboutClick?.();
                  setIsMobileMenuOpen(false);
                }}
                className="text-left text-gray-700 hover:text-blue-500 transition-colors"
              >
                About Us
              </button>

              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-sm font-medium text-gray-900 mb-3 truncate">
                      {user.email}
                    </p>
                    <button
                      onClick={() => {
                        onProfileClick?.();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 text-gray-700 hover:text-blue-500 transition-colors flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>My Orders</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left py-2 text-red-600 hover:text-red-700 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-gray-200 pt-4 space-y-2">
                  <button
                    onClick={() => {
                      onLoginClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full text-gray-700 border border-gray-300 py-3 rounded-full hover:bg-gray-50 transition-colors"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      onSignupClick?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition-colors"
                  >
                    Sign Up
                  </button>
                </div>
              )}
              
              <button
                onClick={() => {
                  onSectionClick?.('purchase');
                  setIsMobileMenuOpen(false);
                }}
                className="bg-blue-500 text-white py-3 rounded-full hover:bg-blue-600 transition-colors"
              >
                Shop Now
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
