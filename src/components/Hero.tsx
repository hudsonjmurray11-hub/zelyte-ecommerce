import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {/* Base gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Liquid wave layers */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Liquid blob 1 */}
        <div 
          className="absolute -top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-40"
          style={{
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.6) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)',
            filter: 'blur(80px)',
            transform: `translate(${scrollY * 0.2}px, ${scrollY * 0.3}px)`,
            animation: 'liquid-float 20s ease-in-out infinite',
          }}
        />
        
        {/* Liquid blob 2 */}
        <div 
          className="absolute top-1/2 -right-1/4 w-[700px] h-[700px] rounded-full opacity-35"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.5) 0%, rgba(37, 99, 235, 0.25) 50%, transparent 70%)',
            filter: 'blur(90px)',
            transform: `translate(${-scrollY * 0.15}px, ${scrollY * 0.25}px)`,
            animation: 'liquid-float 25s ease-in-out infinite reverse',
          }}
        />
        
        {/* Liquid blob 3 */}
        <div 
          className="absolute -bottom-1/4 left-1/3 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: 'radial-gradient(circle, rgba(147, 197, 253, 0.4) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
            filter: 'blur(100px)',
            transform: `translate(${scrollY * 0.1}px, ${-scrollY * 0.2}px)`,
            animation: 'liquid-float 30s ease-in-out infinite',
          }}
        />
        
        {/* Liquid blob 4 */}
        <div 
          className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full opacity-25"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.45) 0%, rgba(37, 99, 235, 0.2) 50%, transparent 70%)',
            filter: 'blur(85px)',
            transform: `translate(${-scrollY * 0.1}px, ${scrollY * 0.15}px)`,
            animation: 'liquid-float 22s ease-in-out infinite reverse',
          }}
        />
      </div>
      
      {/* Organic flowing wave shapes */}
      <div className="absolute inset-0 overflow-hidden opacity-25">
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1200 800">
          <defs>
            <linearGradient id="liquid1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(147, 197, 253, 0.5)" />
              <stop offset="50%" stopColor="rgba(96, 165, 250, 0.4)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <linearGradient id="liquid2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
              <stop offset="50%" stopColor="rgba(37, 99, 235, 0.3)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="25"/>
            </filter>
          </defs>
          <g style={{ transform: 'translateY(0px)', animation: 'liquid-wave 15s ease-in-out infinite' }}>
            <path 
              d="M0,400 Q300,200 600,400 T1200,400 L1200,800 L0,800 Z" 
              fill="url(#liquid1)" 
              filter="url(#blur)"
            />
          </g>
          <g style={{ transform: 'translateY(0px)', animation: 'liquid-wave 18s ease-in-out infinite reverse' }}>
            <path 
              d="M0,600 Q400,300 800,500 T1200,600 L1200,800 L0,800 Z" 
              fill="url(#liquid2)" 
              filter="url(#blur)"
            />
          </g>
        </svg>
      </div>
      
      {/* Floating orbs for depth */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-white rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl animate-pulse delay-500" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <div className="mb-8">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            <span className="inline-block animate-fade-in-up">HYDRATION</span>{' '}
            <span className="inline-block animate-fade-in-up delay-200">YOU</span>
            <br />
            <span className="inline-block animate-fade-in-up delay-400">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">DONT</span> HAVE TO
            </span>{' '}
            <span className="inline-block animate-fade-in-up delay-600 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              DRINK
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
    </motion.section>
  );
};

export default Hero;