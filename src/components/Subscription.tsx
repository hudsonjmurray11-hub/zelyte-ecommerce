import React, { useState } from 'react';
import { Check, ShoppingCart, Package, Star } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const products = [
  {
    id: 'single',
    name: 'Single Tin',
    price: 10.00,
    description: 'Perfect for trying out',
    features: ['1 Tin (15 servings)', 'Choose any flavor', 'Free shipping over $50'],
    popular: false
  },
  {
    id: 'bundle-3',
    name: '3-Pack Bundle',
    price: 25.99,
    originalPrice: 30,
    savings: 5,
    description: 'Great value for regular users',
    features: ['3 Tins (45 servings)', 'Mix & match flavors', 'Free shipping', 'Save $5'],
    popular: true
  },
  {
    id: 'bundle-6',
    name: '6-Pack Bundle',
    price: 50,
    originalPrice: 60,
    savings: 10,
    description: 'Best value for enthusiasts',
    features: ['6 Tins (90 servings)', 'Mix & match flavors', 'Free shipping', 'Save $10']
  }
];

const Purchase = () => {
  const [selectedProduct, setSelectedProduct] = useState('bundle-3');
  const [selectedFlavors, setSelectedFlavors] = useState(['coconut-citrus']);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const flavors = [
    { id: 'coconut-citrus', name: 'Coconut Citrus', category: 'Electrolytes', color: 'bg-blue-900' },
    { id: 'peppermint', name: 'Peppermint', category: 'Electrolytes', color: 'bg-emerald-500' },
    { id: 'lemon-lime', name: 'Lemon Lime', category: 'Electrolytes + Caffeine', color: 'bg-yellow-500' },
    { id: 'wintergreen', name: 'Wintergreen', category: 'Electrolytes + Caffeine', color: 'bg-green-500' }
  ];

  const selectedProductData = products.find(p => p.id === selectedProduct);
  const totalPrice = selectedProductData ? selectedProductData.price * quantity : 0;

  const handleAddToCart = async () => {
    if (selectedProductData && selectedFlavors.length > 0) {
      try {
        for (const flavor of selectedFlavors) {
          const cartItem = {
            id: selectedProductData.id,
            name: selectedProductData.name,
            price: selectedProductData.price,
            flavor: flavor,
            bundleType: selectedProductData.id
          };
          
          await addToCart(cartItem);
        }
        
        // Optional: Show success message
        console.log('Added bundle to cart');
      } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Error adding to cart. Please try again.');
      }
    }
  };

  return (
    <section id="purchase" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Fuel Your Performance
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose your perfect hydration solution with premium electrolyte tins
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product.id)}
              className={`relative cursor-pointer rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 ${
                selectedProduct === product.id
                  ? 'bg-gradient-to-b from-blue-500 to-blue-600 shadow-xl'
                  : 'bg-gray-800 hover:bg-gray-700'
              } ${product.popular ? 'ring-4 ring-blue-500' : ''}`}
            >
              {product.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                <p className="text-gray-300 mb-4">{product.description}</p>
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl font-bold">${product.price}</span>
                </div>
                {product.originalPrice && (
                  <div className="flex items-center justify-center text-sm">
                    <span className="line-through text-gray-400 mr-2">${product.originalPrice}</span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded">
                      Save ${product.savings}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <Check className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-12 max-w-4xl mx-auto">
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

          <div className="flex items-center justify-center mb-8">
            <label className="text-lg font-medium mr-4">Quantity:</label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
              >
                -
              </button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center">
            <Package className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Free Shipping</h4>
            <p className="text-gray-300">Fast, free delivery on orders over $50</p>
          </div>
          <div className="text-center">
            <Star className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Premium Quality</h4>
            <p className="text-gray-300">Lab-tested for purity and potency</p>
          </div>
          <div className="text-center">
            <ShoppingCart className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2">Secure Checkout</h4>
            <p className="text-gray-300">Safe and secure payment processing</p>
          </div>
        </div>

        <div className="text-center bg-gray-800 rounded-2xl p-8 max-w-md mx-auto">
          <div className="mb-6">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              Total: ${totalPrice.toFixed(2)}
            </div>
            <p className="text-gray-400">
              {selectedFlavors.length} flavor{selectedFlavors.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          <button 
            onClick={handleAddToCart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-xl mb-4"
          >
            Add to Cart - ${totalPrice.toFixed(2)}
          </button>
          <p className="text-gray-400 text-sm">30-day money-back guarantee</p>
        </div>
      </div>
    </section>
  );
};

export default Purchase;