import React, { useState } from 'react';
import { Star, Zap, ShoppingCart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const electrolytes = [
  {
    id: 'coconut-citrus',
    name: 'Coconut Citrus',
    category: 'Electrolytes',
    caffeineMg: 0,
    price: 10,
    rating: 4.9,
    reviews: 1247,
    blurb: 'Tropical blend with natural coconut and citrus flavors.',
    image: '/Zelyte_COCONUT.webp',
    color: 'from-blue-900 to-blue-800'
  },
  {
    id: 'peppermint',
    name: 'Peppermint',
    category: 'Electrolytes',
    caffeineMg: 0,
    price: 10,
    rating: 4.8,
    reviews: 902,
    blurb: 'Cool peppermint for clean, crisp hydration.',
    image: '/Zelyte_COCONUT.webp',
    color: 'from-emerald-400 to-teal-500'
  }
];

const electrolytesPlusCaffeine = [
  {
    id: 'lemon-lime',
    name: 'Lemon Lime',
    category: 'Electrolytes + Caffeine',
    caffeineMg: 40,
    price: 10,
    rating: 4.9,
    reviews: 1156,
    blurb: 'Classic citrus with a focused kick.',
    image: '/Zelyte_Lemon_Lime.png',
    color: 'from-yellow-400 to-orange-500'
  },
  {
    id: 'wintergreen',
    name: 'Wintergreen',
    category: 'Electrolytes + Caffeine',
    caffeineMg: 40,
    price: 10,
    rating: 4.7,
    reviews: 743,
    blurb: 'Refreshing wintergreen with smooth energy.',
    image: '/Zelyte_WINTERGREEN.png',
    color: 'from-green-400 to-emerald-500'
  }
];

interface ProductShowcaseProps {
  onProductClick?: (slug: string) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ onProductClick }) => {
  const [selectedProduct, setSelectedProduct] = useState(electrolytes[0]);
  const { addToCart } = useCart();

  const handleAddToCart = async (product: any) => {
    try {
      const cartItem = {
        id: product.id.toString(),
        name: product.name,
        price: product.price,
        flavor: product.name
      };
      
      await addToCart(cartItem);
      
      // Optional: Show success message
      console.log('Added to cart:', cartItem);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    }
  };

  return (
    <section id="products" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Perfect Hydration, Every Flavor
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Each tin delivers 15 servings of premium electrolytes with no artificial flavors
          </p>
        </div>

        <div className="space-y-16">
          {/* Electrolytes Section */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Electrolytes</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {electrolytes.map((product) => (
                <div key={product.id} className="flex flex-col h-full">
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 flex-grow ${
                      selectedProduct.id === product.id 
                        ? 'bg-white shadow-xl border-2 border-blue-500' 
                        : 'bg-white/70 hover:bg-white shadow-lg'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${product.color} mb-4 flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{product.name}</h4>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{product.blurb}</p>
                    <p className="font-bold text-blue-600">${product.price}</p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => onProductClick && onProductClick(product.id)}
                      className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      See more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Electrolytes + Caffeine Section */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-8 text-center">Electrolytes + Caffeine</h3>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {electrolytesPlusCaffeine.map((product) => (
                <div key={product.id} className="flex flex-col h-full">
                  <div
                    onClick={() => setSelectedProduct(product)}
                    className={`cursor-pointer rounded-2xl p-6 transition-all duration-300 transform hover:scale-105 flex-grow ${
                      selectedProduct.id === product.id 
                        ? 'bg-white shadow-xl border-2 border-blue-500' 
                        : 'bg-white/70 hover:bg-white shadow-lg'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${product.color} mb-4 flex items-center justify-center`}>
                      <span className="text-white font-bold text-lg">
                        {product.name.charAt(0)}
                      </span>
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">{product.name}</h4>
                    <div className="flex items-center mb-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{product.blurb}</p>
                    <p className="font-bold text-blue-600">${product.price}</p>
                  </div>
                  <div className="mt-3">
                    <button
                      onClick={() => onProductClick && onProductClick(product.id)}
                      className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-medium border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      See more
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProductShowcase;