import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import zelyteLogo from '/Zelyte(2).png';

interface HeaderProps {
  onCartClick: () => void;
  onAboutClick?: () => void;
  onHomeClick?: () => void;
  onSectionClick?: (section: string) => void;
  currentPage?: string;
}

const Header: React.FC<HeaderProps> = ({ onCartClick, onAboutClick, onHomeClick, onSectionClick, currentPage }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t">
            <div className="flex flex-col space-y-4 p-6">
              <a href="#products" className="text-gray-700 hover:text-blue-500 transition-colors">Products</a>
              <a href="#science" className="text-gray-700 hover:text-blue-500 transition-colors">Science</a>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-500 transition-colors">Reviews</a>
              <a href="#purchase" className="text-gray-700 hover:text-blue-500 transition-colors">Shop</a>
              <button className="bg-blue-500 text-white py-3 rounded-full">Shop Now</button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;