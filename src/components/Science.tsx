import React, { useEffect, useState } from 'react';
import { Beaker, Zap, Shield, Droplets, Coffee, Brain } from 'lucide-react';
import zelyteCoconut from '/Zelyte_COCONUT.webp';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const benefits = [
  {
    icon: Zap,
    title: 'Rapid Hydration',
    description: 'Scientifically formulated electrolyte blend for optimal absorption',
    stat: '3x Faster',
    color: 'text-yellow-500'
  },
  {
    icon: Shield,
    title: 'Natural Ingredients',
    description: 'No artificial flavors, colors, or preservatives',
    stat: '100% Natural',
    color: 'text-green-500'
  },
  {
    icon: Droplets,
    title: 'Essential Minerals',
    description: 'Sodium, potassium, and magnesium for complete hydration',
    stat: '15 Servings',
    color: 'text-blue-500'
  },
  {
    icon: Beaker,
    title: 'Lab Tested',
    description: 'Third-party tested for purity and potency',
    stat: '99.9% Pure',
    color: 'text-purple-500'
  }
];

const Science = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { isVisible: isHeaderVisible, elementRef: headerRef } = useScrollAnimation({ threshold: 0.2 });
  const { isVisible: isElectrolytesHeaderVisible, elementRef: electrolytesHeaderRef } = useScrollAnimation({ threshold: 0.2, delay: 100 });
  const { isVisible: isBalanceVisible, elementRef: balanceRef } = useScrollAnimation({ threshold: 0.1, delay: 200 });
  const { isVisible: isCaffeineHeaderVisible, elementRef: caffeineHeaderRef } = useScrollAnimation({ threshold: 0.2, delay: 100 });
  const { isVisible: isCaffeineContentVisible, elementRef: caffeineContentRef } = useScrollAnimation({ threshold: 0.1, delay: 200 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const element = document.getElementById('science');
    if (element) observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section id="science" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          className={`text-center mb-16 transition-all duration-1000 ease-out ${
            isHeaderVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Science-Backed Hydration
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our formulas are developed with sports scientists and nutritionists to deliver 
            the perfect balance of electrolytes your body needs, with or without caffeine
          </p>
        </div>

        {/* Electrolytes Section */}
        <div className="mb-20">
          <div 
            ref={electrolytesHeaderRef as React.RefObject<HTMLDivElement>}
            className={`text-center mb-12 transition-all duration-1000 ease-out ${
              isElectrolytesHeaderVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pure Electrolytes
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Clean hydration without stimulants. Perfect for anytime, anywhere.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className={`text-center transform transition-all duration-700 ease-out hover:scale-110 ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-10 opacity-0'
                }`}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                }}
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6 ${benefit.color}`}>
                  <benefit.icon className="w-8 h-8" />
                </div>
                <div className={`text-3xl font-bold mb-2 ${benefit.color}`}>
                  {benefit.stat}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {benefit.title}
                </h4>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>

          <div 
            ref={balanceRef as React.RefObject<HTMLDivElement>}
            className={`bg-gradient-to-r from-gray-50 to-orange-50 rounded-3xl p-8 md:p-12 transition-all duration-1000 ease-out ${
              isBalanceVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95'
            }`}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h4 className="text-3xl font-bold text-gray-900 mb-6">
                  The Perfect Electrolyte Balance
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium">Sodium</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div className="h-2 bg-blue-500 rounded-full w-3/4"></div>
                      </div>
                      <span className="text-sm font-bold">380mg</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium">Potassium</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div className="h-2 bg-cyan-500 rounded-full w-3/5"></div>
                      </div>
                      <span className="text-sm font-bold">95mg</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <span className="font-medium">Magnesium</span>
                    <div className="flex items-center">
                      <div className="w-32 h-2 bg-gray-200 rounded-full mr-3">
                        <div className="h-2 bg-teal-500 rounded-full w-1/2"></div>
                      </div>
                      <span className="text-sm font-bold">60mg</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-4 bg-blue-200 rounded-full blur-xl opacity-50"></div>
                  <img 
                    src={zelyteCoconut}
                    alt="Zelyte Electrolytes"
                    className="relative w-64 h-64 object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Electrolytes + Caffeine Section */}
        <div>
          <div 
            ref={caffeineHeaderRef as React.RefObject<HTMLDivElement>}
            className={`text-center mb-12 transition-all duration-1000 ease-out ${
              isCaffeineHeaderVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Electrolytes + Caffeine
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              When you need more than just hydration. Clean energy with premium electrolytes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-6">
                <Coffee className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-3xl font-bold mb-2 text-yellow-600">
                40mg
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Natural Caffeine
              </h4>
              <p className="text-gray-600">
                Equivalent to half a cup of coffee - perfect for sustained energy without the crash
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-6">
                <Brain className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold mb-2 text-green-600">
                Enhanced
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Focus & Alertness
              </h4>
              <p className="text-gray-600">
                Caffeine enhances cognitive function and alertness while maintaining hydration
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 mb-6">
                <Zap className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold mb-2 text-purple-600">
                Peak
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">
                Performance
              </h4>
              <p className="text-gray-600">
                Combine caffeine's performance benefits with essential electrolytes for peak results
              </p>
            </div>
          </div>

          <div 
            ref={caffeineContentRef as React.RefObject<HTMLDivElement>}
            className={`bg-gradient-to-r from-blue-900 to-blue-800 rounded-3xl p-8 md:p-12 text-white transition-all duration-1000 ease-out ${
              isCaffeineContentVisible 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-10 scale-95'
            }`}
          >
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h4 className="text-3xl font-bold mb-6">
                  Same Great Electrolytes + Clean Energy
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="font-medium">Sodium</span>
                    <span className="font-bold">380mg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="font-medium">Potassium</span>
                    <span className="font-bold">95mg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="font-medium">Magnesium</span>
                    <span className="font-bold">60mg</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/10 rounded-lg">
                    <span className="font-medium">Natural Caffeine</span>
                    <span className="font-bold">40mg</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute -inset-6 bg-yellow-400 rounded-full blur-2xl opacity-30"></div>
                  <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
                    <div className="text-center">
                      <h5 className="text-lg font-bold text-gray-900 mb-4">Caffeine Comparison</h5>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Zelyte + Caffeine</span>
                          <span className="font-bold text-blue-600">40mg</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Coffee (8oz)</span>
                          <span className="font-bold text-gray-600">95mg</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-700">Energy Drink</span>
                          <span className="font-bold text-gray-600">80-200mg</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-4">
                        Perfect balance for sustained energy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Science;