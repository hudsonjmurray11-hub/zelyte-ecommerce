import React, { useEffect, useState } from 'react';
import { ArrowDown, Zap, ShoppingCart } from 'lucide-react';

interface HeroProps {
  onLearnMoreClick?: () => void;
  onShopClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLearnMoreClick, onShopClick }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleShopClick = () => {
    if (onShopClick) {
      onShopClick();
    } else if (onLearnMoreClick) {
      // Fallback to scroll to products
      setTimeout(() => {
        const element = document.getElementById('products');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-white rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in-up">
              Hydration you don't have to drink
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto lg:mx-0 mb-6 animate-fade-in-up delay-200">
              Electrolyte pouches for clean hydration—anytime, anywhere.
            </p>
            
            {/* Badge Row */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-8 animate-fade-in-up delay-400">
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                Sugar-free
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                15 pouches/tin
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                Natural flavors
              </span>
              <span className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                Hydration or +Caffeine
              </span>
            </div>

            {/* Single Primary CTA */}
            <div className="flex justify-center lg:justify-start animate-fade-in-up delay-600">
              <button 
                onClick={handleShopClick}
                className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Shop Starter Pack</span>
              </button>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="hidden lg:block animate-fade-in-up delay-400">
            <div className="relative">
              <div className="absolute -inset-4 bg-white/20 rounded-full blur-2xl"></div>
              <img 
                src="/Zelyte_COCONUT.webp" 
                alt="Zelyte Electrolyte Pouches"
                className="relative w-full max-w-md mx-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-8 h-8 text-white/70" />
      </div>
    </section>
  );
};

export default Hero;