import React, { useEffect, useState } from 'react';
import { ArrowDown, Zap } from 'lucide-react';

interface HeroProps {
  onLearnMoreClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLearnMoreClick }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Water Background Gradient */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Animated Water Waves */}
      <div className="absolute inset-0 opacity-30 overflow-hidden">
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ transform: 'translateY(20px)' }}>
          <path
            d="M0,100 Q300,50 600,100 T1200,100 L1200,200 L0,200 Z"
            fill="rgba(255,255,255,0.1)"
            style={{
              animation: 'wave 8s ease-in-out infinite',
            }}
          />
          <path
            d="M0,120 Q300,80 600,120 T1200,120 L1200,200 L0,200 Z"
            fill="rgba(255,255,255,0.15)"
            style={{
              animation: 'wave 10s ease-in-out infinite 0.5s',
            }}
          />
          <path
            d="M0,140 Q300,100 600,140 T1200,140 L1200,200 L0,200 Z"
            fill="rgba(255,255,255,0.1)"
            style={{
              animation: 'wave 12s ease-in-out infinite 1s',
            }}
          />
        </svg>
        {/* Additional wave layer for depth */}
        <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 1200 200" preserveAspectRatio="none" style={{ transform: 'translateY(40px) scaleX(-1)' }}>
          <path
            d="M0,110 Q300,60 600,110 T1200,110 L1200,200 L0,200 Z"
            fill="rgba(255,255,255,0.08)"
            style={{
              animation: 'wave 9s ease-in-out infinite 0.3s',
            }}
          />
        </svg>
      </div>

      {/* Water Ripples/Bubbles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-white rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-cyan-200 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1.5s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-200 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Floating Water Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/20 blur-sm"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">FUEL</span>{' '}
            <span className="inline-block animate-fade-in-up delay-200">YOUR</span>
            <br />
            <span className="inline-block animate-fade-in-up delay-400 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              POTENTIAL
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto animate-fade-in-up delay-600">
            Premium electrolyte pouches crafted with natural flavors and science-backed hydration
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-800">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-xl">
            Shop Collection
          </button>
          <button 
            onClick={onLearnMoreClick}
            className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
          >
            Learn More
          </button>
        </div>

      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-8 h-8 text-white/70" />
      </div>
    </section>
  );
};

export default Hero;