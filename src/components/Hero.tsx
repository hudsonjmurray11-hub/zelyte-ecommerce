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
      
      {/* Textured overlay pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 50%),
            linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
            linear-gradient(45deg, rgba(37, 99, 235, 0.2) 0%, transparent 50%)
          `,
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Additional depth layers */}
      <div className="absolute inset-0 opacity-25">
        <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-white rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-xl animate-pulse delay-500" />
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-cyan-300 rounded-full blur-2xl opacity-40 animate-pulse delay-700" />
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-blue-300 rounded-full blur-2xl opacity-30 animate-pulse delay-300" />
      </div>
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

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