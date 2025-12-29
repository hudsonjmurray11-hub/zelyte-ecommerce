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
      {/* Deep Water Background Gradient - More Realistic */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #0ea5e9 0%, #0284c7 25%, #0369a1 50%, #075985 75%, #0c4a6e 100%)',
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Water Depth Layers */}
      <div className="absolute inset-0 opacity-40">
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(14,165,233,0.3) 0%, transparent 70%)',
          }}
        />
        <div 
          className="absolute bottom-0 left-0 right-0 h-1/3"
          style={{
            background: 'linear-gradient(to top, rgba(6,182,212,0.4) 0%, transparent 100%)',
          }}
        />
      </div>
      
      {/* Realistic Water Waves - Multiple Layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base Wave Layer - Large Swells */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '60%', opacity: 0.4 }}>
          <path
            d="M0,160 L0,320 L1440,320 L1440,160 Q1200,120 960,160 T480,160 T0,160 Z"
            fill="rgba(255,255,255,0.15)"
            style={{
              animation: 'waveRealistic 12s ease-in-out infinite',
            }}
          />
        </svg>
        
        {/* Mid Wave Layer - Medium Swells */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '50%', opacity: 0.5 }}>
          <path
            d="M0,180 L0,320 L1440,320 L1440,180 Q1080,140 720,180 T360,180 T0,180 Z"
            fill="rgba(255,255,255,0.2)"
            style={{
              animation: 'waveRealistic 10s ease-in-out infinite 0.5s',
            }}
          />
        </svg>
        
        {/* Surface Wave Layer - Small Ripples */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '40%', opacity: 0.6 }}>
          <path
            d="M0,200 L0,320 L1440,320 L1440,200 Q1000,160 600,200 T300,200 T0,200 Z"
            fill="rgba(255,255,255,0.25)"
            style={{
              animation: 'waveRealistic 8s ease-in-out infinite 1s',
            }}
          />
        </svg>
        
        {/* Foam/Whitecaps on Waves */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '35%', opacity: 0.7 }}>
          <path
            d="M0,220 L0,320 L1440,320 L1440,220 Q900,180 540,220 T270,220 T0,220 Z"
            fill="rgba(255,255,255,0.4)"
            style={{
              animation: 'waveRealistic 7s ease-in-out infinite 1.5s',
            }}
          />
        </svg>
        
        {/* Additional Wave Layer - Cross Current */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '45%', opacity: 0.3, transform: 'scaleX(-1)' }}>
          <path
            d="M0,190 L0,320 L1440,320 L1440,190 Q1100,150 750,190 T400,190 T0,190 Z"
            fill="rgba(255,255,255,0.15)"
            style={{
              animation: 'waveRealistic 11s ease-in-out infinite 0.3s',
            }}
          />
        </svg>
        
        {/* Extra Intense Wave Layer */}
        <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{ height: '55%', opacity: 0.35 }}>
          <path
            d="M0,170 L0,320 L1440,320 L1440,170 Q1050,130 690,170 T330,170 T0,170 Z"
            fill="rgba(255,255,255,0.18)"
            style={{
              animation: 'waveRealistic 9s ease-in-out infinite 0.7s',
            }}
          />
        </svg>
      </div>

      {/* Water Ripples and Bubbles - More Intense */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(15)].map((_, i) => (
          <div
            key={`bubble-${i}`}
            className="absolute rounded-full bg-white/30 blur-xl"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `bubbleRise ${Math.random() * 8 + 6}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Intense Water Particles and Droplets */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(40)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full bg-white/25 blur-sm"
            style={{
              width: `${Math.random() * 12 + 3}px`,
              height: `${Math.random() * 12 + 3}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `waterFloat ${Math.random() * 15 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Water Surface Reflections */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
            animation: 'waterShimmer 4s ease-in-out infinite',
          }}
        />
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