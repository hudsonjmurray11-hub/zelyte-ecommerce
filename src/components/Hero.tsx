import React, { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, Zap } from 'lucide-react';

interface HeroProps {
  onLearnMoreClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onLearnMoreClick }) => {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate bubbles with stable random values
  const bubbles = useMemo(() => 
    Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      size: Math.random() * 60 + 20,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: Math.random() * 3 + 4,
      opacity: Math.random() * 0.3 + 0.1,
    })), []
  );

  return (
    <motion.section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ opacity, scale }}
    >
      {/* Base gradient background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Animated Water Waves */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Wave Layer 1 */}
        <svg
          className="absolute bottom-0 w-full h-64 opacity-30"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 Q300,40 600,60 T1200,60 L1200,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.2)"
            className="water-wave-1"
          />
        </svg>
        
        {/* Wave Layer 2 */}
        <svg
          className="absolute bottom-0 w-full h-64 opacity-25"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 Q400,50 800,80 T1200,80 L1200,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.15)"
            className="water-wave-2"
          />
        </svg>
        
        {/* Wave Layer 3 */}
        <svg
          className="absolute bottom-0 w-full h-64 opacity-20"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,70 Q200,90 400,70 T800,70 T1200,70 L1200,120 L0,120 Z"
            fill="rgba(255, 255, 255, 0.1)"
            className="water-wave-3"
          />
        </svg>
      </div>
      
      {/* Floating Bubbles */}
      <div className="absolute inset-0">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full bg-white/20 backdrop-blur-sm"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              bottom: '-10%',
            }}
            animate={{
              y: ['-100vh', '110vh'],
              x: [0, bubble.size * 0.3, -bubble.size * 0.2, 0],
              scale: [1, 1.2, 0.8, 1],
              opacity: [bubble.opacity, bubble.opacity * 1.5, bubble.opacity * 0.5, bubble.opacity],
            }}
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>
      
      {/* Water Ripple Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-cyan-300/20 blur-3xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 rounded-full bg-blue-300/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.35, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full bg-white/10 blur-2xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.15, 0.3, 0.15],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4,
          }}
        />
      </div>
      
      {/* Textured overlay pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.08) 0%, transparent 50%),
            radial-gradient(circle at 40% 20%, rgba(255, 255, 255, 0.06) 0%, transparent 50%)
          `,
          transform: `translateY(${scrollY * 0.3}px)`,
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