import React, { useState } from 'react';
import { Check, ShoppingCart, Package, Star, Zap, Calendar, TrendingUp } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { motion, useInView } from 'framer-motion';

const subscriptionPlans = [
  {
    id: 'subscription-1',
    tinsPerMonth: 1,
    frequency: 'monthly',
    usageFrequency: '2–3x/week',
    usageDescription: 'Casual use',
    originalPrice: 10.00,
    subscriptionPrice: 8.50, // 15% off
    savings: 1.50,
    popular: false,
    description: 'Perfect for trying Zelyte or light use',
    features: ['1 Tin (15 servings)', 'Delivered monthly', '15% Subscribe & Save', 'Cancel anytime']
  },
  {
    id: 'subscription-2',
    tinsPerMonth: 2,
    frequency: 'monthly',
    usageFrequency: '4–5x/week',
    usageDescription: 'Regular use',
    originalPrice: 20.00,
    subscriptionPrice: 17.00, // 15% off
    savings: 3.00,
    popular: true,
    description: 'Most popular for regular athletes',
    features: ['2 Tins (30 servings)', 'Delivered monthly', '15% Subscribe & Save', 'Cancel anytime', 'Free shipping']
  },
  {
    id: 'subscription-4',
    tinsPerMonth: 4,
    frequency: 'monthly',
    usageFrequency: 'Daily',
    usageDescription: 'Power users & teams',
    originalPrice: 40.00,
    subscriptionPrice: 34.00, // 15% off
    savings: 6.00,
    popular: false,
    description: 'Never run out - perfect for daily users',
    features: ['4 Tins (60 servings)', 'Delivered monthly', '15% Subscribe & Save', 'Cancel anytime', 'Free shipping', 'Best value']
  }
];

const Purchase = () => {
  const [selectedPlan, setSelectedPlan] = useState('subscription-2'); // Default to 2 tins/month
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
  const { addToCart } = useCart();
  const { isVisible: isHeaderVisible, elementRef: headerRef } = useScrollAnimation({ threshold: 0.2 });
  const { isVisible: isGuideVisible, elementRef: guideRef } = useScrollAnimation({ threshold: 0.1, delay: 100 });
  const { isVisible: isPlansVisible, elementRef: plansRef } = useScrollAnimation({ threshold: 0.1, delay: 200 });
  const { isVisible: isFlavorsVisible, elementRef: flavorsRef } = useScrollAnimation({ threshold: 0.1, delay: 300 });

  const flavors = [
    { id: 'coconut-citrus', name: 'Coconut Citrus', category: 'Electrolytes', color: 'bg-blue-900' },
    { id: 'peppermint', name: 'Peppermint', category: 'Electrolytes', color: 'bg-emerald-500' },
    { id: 'lemon-lime', name: 'Lemon Lime', category: 'Electrolytes + Caffeine', color: 'bg-yellow-500' },
    { id: 'wintergreen', name: 'Wintergreen', category: 'Electrolytes + Caffeine', color: 'bg-green-500' }
  ];

  const selectedPlanData = subscriptionPlans.find(p => p.id === selectedPlan);
  const guideInView = useInView(guideRef as React.RefObject<HTMLDivElement>, { once: true, amount: 0.2 });
  const plansInView = useInView(plansRef as React.RefObject<HTMLDivElement>, { once: true, amount: 0.2 });

  const handleAddToCart = async () => {
    if (selectedPlanData && selectedFlavors.length > 0) {
      try {
        // Add subscription items to cart
        for (const flavor of selectedFlavors) {
          const cartItem = {
            id: `subscription-${selectedPlanData.tinsPerMonth}-${flavor}`,
            name: `${selectedPlanData.tinsPerMonth} Tin${selectedPlanData.tinsPerMonth > 1 ? 's' : ''}/Month Subscription - ${flavor}`,
            price: selectedPlanData.subscriptionPrice / selectedPlanData.tinsPerMonth, // Price per tin
            flavor: flavor,
            isSubscription: true,
            subscriptionFrequency: 'monthly' as const,
            subscriptionTinsPerMonth: selectedPlanData.tinsPerMonth,
            bundleType: `subscription-${selectedPlanData.tinsPerMonth}`
          };
          
          await addToCart(cartItem);
        }
        
        // Show success message
        alert(`Subscription added! You'll receive ${selectedPlanData.tinsPerMonth} tin${selectedPlanData.tinsPerMonth > 1 ? 's' : ''} per month with 15% off.`);
      } catch (error) {
        console.error('Error adding subscription to cart:', error);
        alert('Error adding subscription. Please try again.');
      }
    } else {
      alert('Please select at least one flavor');
    }
  };

  return (
    <section id="purchase" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          ref={headerRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 50 }}
          animate={isHeaderVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Subscribe & Save 15%
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Never run out of hydration. Choose your monthly delivery and save on every order.
          </p>
        </motion.div>

        {/* Usage Guide */}
        <motion.div
          ref={guideRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 30 }}
          animate={guideInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-gray-800 rounded-2xl p-6 md:p-8 mb-12 max-w-4xl mx-auto"
        >
          <div className="flex items-center justify-center mb-6">
            <Calendar className="w-6 h-6 text-blue-400 mr-2" />
            <h3 className="text-2xl font-bold">How often will you use Zelyte?</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">2–3x/week</div>
              <div className="text-sm text-gray-300 mb-3">Casual use</div>
              <div className="text-lg font-semibold">→ 1 tin/month</div>
              <div className="text-xs text-gray-400 mt-2">~8–12 pouches/month</div>
            </div>
            <div className="text-center p-4 bg-blue-600/20 rounded-lg border-2 border-blue-500">
              <div className="text-3xl font-bold text-blue-400 mb-2">4–5x/week</div>
              <div className="text-sm text-gray-300 mb-3">Regular use</div>
              <div className="text-lg font-semibold">→ 2 tins/month</div>
              <div className="text-xs text-gray-400 mt-2">~16–22 pouches/month</div>
              <div className="mt-2 text-xs bg-blue-500 text-white px-2 py-1 rounded-full inline-block">Most Popular</div>
            </div>
            <div className="text-center p-4 bg-gray-700/50 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">Daily</div>
              <div className="text-sm text-gray-300 mb-3">Power users</div>
              <div className="text-lg font-semibold">→ 4 tins/month</div>
              <div className="text-xs text-gray-400 mt-2">~26–30+ pouches/month</div>
              <div className="mt-2 text-xs text-yellow-400">Never run out</div>
            </div>
          </div>
        </motion.div>

        {/* Subscription Plans */}
        <motion.div
          ref={plansRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 50 }}
          animate={plansInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="grid lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto"
        >
          {subscriptionPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 30 }}
              animate={plansInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative cursor-pointer rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${
                selectedPlan === plan.id
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600 shadow-xl ring-4 ring-blue-400'
                  : 'bg-gray-800 hover:bg-gray-700'
              } ${plan.popular ? 'ring-4 ring-blue-500' : ''}`}
            >
              {/* Subscribe & Save Badge */}
              <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg z-10">
                Subscribe & Save 15%
              </div>
              
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold z-10">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <div className="text-sm text-gray-300 mb-2">{plan.usageDescription}</div>
                <h3 className="text-2xl font-bold mb-2">{plan.tinsPerMonth} Tin{plan.tinsPerMonth > 1 ? 's' : ''} / Month</h3>
                <p className="text-gray-300 mb-4 text-sm">{plan.description}</p>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl font-bold">${plan.subscriptionPrice.toFixed(2)}</span>
                  <span className="text-lg text-gray-300 ml-2">/month</span>
                </div>
                <div className="flex items-center justify-center text-sm">
                  <span className="line-through text-gray-400 mr-2">${plan.originalPrice.toFixed(2)}</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded">
                    Save ${plan.savings.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Flavor Selection */}
        <motion.div
          ref={flavorsRef as React.RefObject<HTMLDivElement>}
          initial={{ opacity: 0, y: 30 }}
          animate={isFlavorsVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="bg-gray-800 rounded-2xl p-8 mb-12 max-w-4xl mx-auto"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">
            Choose Your Flavors
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {flavors.map((flavor) => (
              <div
                key={flavor.id}
                onClick={() => {
                  if (selectedFlavors.includes(flavor.id)) {
                    setSelectedFlavors(selectedFlavors.filter(f => f !== flavor.id));
                  } else {
                    setSelectedFlavors([...selectedFlavors, flavor.id]);
                  }
                }}
                className={`cursor-pointer rounded-xl p-4 text-center transition-all duration-300 transform hover:scale-105 ${
                  selectedFlavors.includes(flavor.id)
                    ? 'bg-blue-500 shadow-lg'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${flavor.color} mx-auto mb-3`}></div>
                <span className="text-sm font-medium block mb-1">{flavor.name}</span>
                <span className="text-xs text-gray-400">{flavor.category}</span>
              </div>
            ))}
          </div>

          {selectedPlanData && (
            <div className="text-center bg-gray-700 rounded-xl p-6 mb-6">
              <div className="text-3xl font-bold text-blue-400 mb-2">
                ${selectedPlanData.subscriptionPrice.toFixed(2)}/month
              </div>
              <div className="text-gray-300 mb-1">
                {selectedPlanData.tinsPerMonth} tin{selectedPlanData.tinsPerMonth > 1 ? 's' : ''} × {selectedFlavors.length || 1} flavor{selectedFlavors.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-green-400">
                Save ${selectedPlanData.savings.toFixed(2)}/month with subscription
              </div>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={selectedFlavors.length === 0}
            className={`w-full py-4 px-8 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
              selectedFlavors.length === 0
                ? 'bg-gray-600 cursor-not-allowed text-gray-400'
                : 'bg-blue-500 hover:bg-blue-600 text-white shadow-xl'
            }`}
          >
            {selectedFlavors.length === 0 ? 'Select at least one flavor' : 'Start Subscription'}
          </button>
        </motion.div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <Package className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Auto-Delivery</h4>
            <p className="text-gray-300 text-sm">Never run out. We'll ship automatically each month.</p>
          </div>
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Save 15%</h4>
            <p className="text-gray-300 text-sm">Best price guaranteed. Cancel or modify anytime.</p>
          </div>
          <div className="text-center">
            <Zap className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Flexible</h4>
            <p className="text-gray-300 text-sm">Skip, pause, or cancel your subscription anytime.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Purchase;
