import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, ArrowLeft, Check, Zap, Coffee, Brain } from 'lucide-react';
import { Product } from '../types/product';
import { getRelatedProducts } from '../data/products';
import { useCart } from '../contexts/CartContext';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onProductClick?: (slug: string) => void;
  onCartClick?: () => void;
  onShopNowClick?: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onProductClick, onCartClick, onShopNowClick }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');
  const { addToCart, getTotalItems } = useCart();

  const relatedProducts = getRelatedProducts(product, 3);
  const pricePerServing = product.price / product.servings;

  // Promo code validation
  const validPromoCodes: { [key: string]: number } = {
    'HUDDY': 0.10, // 10% discount
    'VIP11': 0.50, // 50% discount
    'BRIANNA PEASE': 1.00 // 100% discount (free)
  };

  const handleApplyPromoCode = () => {
    const code = promoCode.trim().toUpperCase();
    if (validPromoCodes[code]) {
      setAppliedPromoCode(code);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
      setAppliedPromoCode(null);
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedPromoCode(null);
    setPromoCode('');
    setPromoError('');
  };

  // Calculate prices
  const originalPrice = product.price * quantity;
  const discountPercent = appliedPromoCode ? validPromoCodes[appliedPromoCode] : 0;
  const discountAmount = originalPrice * discountPercent;
  const finalPrice = originalPrice - discountAmount;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: finalPrice / quantity, // Use discounted price per item
      flavor: product.name
    });
  };

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'how-to-use', label: 'How to Use' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'nutrition', label: 'Nutrition Facts' }
  ];

  useEffect(() => {
    document.title = `${product.name} - Zelyte`;
  }, [product.name]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <p className="text-gray-600 leading-relaxed">{product.description}</p>;
      case 'benefits':
        return (
          <ul className="space-y-3">
            {product.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-gray-600">{benefit}</span>
              </li>
            ))}
          </ul>
        );
      case 'how-to-use':
        return (
          <ol className="space-y-3">
            {product.howToUse.map((step, index) => (
              <li key={index} className="flex items-start space-x-3">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-gray-600">{step}</span>
              </li>
            ))}
          </ol>
        );
      case 'ingredients':
        return (
          <ul className="space-y-2">
            {product.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-600">• {ingredient}</li>
            ))}
          </ul>
        );
      case 'nutrition':
        return product.nutritionFacts ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <tbody>
                {Object.entries(product.nutritionFacts).map(([key, value]) => (
                  <tr key={key}>
                    <td className="border border-gray-300 px-4 py-2 font-medium text-gray-900">
                      {key}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-600">
                      {value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">Nutrition facts not available.</p>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Breadcrumb and Actions */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm">
              <button onClick={onBack} className="text-blue-600 hover:text-blue-800 hover:underline">
                Home
              </button>
              <span className="text-gray-400">/</span>
              <button onClick={onBack} className="text-blue-600 hover:text-blue-800 hover:underline">
                Products
              </button>
              <span className="text-gray-400">/</span>
              <span className="text-gray-900">{product.name}</span>
            </nav>
            
            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Icon */}
              <button 
                onClick={onCartClick}
                className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                {getTotalItems() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </button>
              
              {/* Shop Now Button */}
              <button 
                onClick={onShopNowClick}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <div className="aspect-square bg-white rounded-2xl shadow-lg mb-4 relative">
              {/* COMING SOON Badge - Fully visible, no overflow hidden */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold px-8 py-3 transform rotate-12 shadow-2xl z-10">
                COMING SOON
              </div>
              
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain p-8"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                      selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.category === 'Electrolytes' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {product.category}
                </span>
                {product.caffeineMg > 0 && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {product.caffeineMg}mg Caffeine
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
                <span className="ml-4 inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                  COMING SOON
                </span>
              </h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating || 0)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviewsCount} reviews)
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-600">{product.summary}</p>
            </div>

            {/* Badges */}
            {product.badges && (
              <div className="flex flex-wrap gap-2">
                {product.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            )}

            {/* Purchase Panel */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="space-y-6">
                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-2 hover:bg-gray-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 border-x border-gray-300">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-2 hover:bg-gray-50"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-gray-600">
                      {quantity} tin{quantity !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                {/* Promo Code Section */}
                <div className="border-t pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                  </label>
                  {!appliedPromoCode ? (
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value);
                          setPromoError('');
                        }}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleApplyPromoCode();
                          }
                        }}
                        placeholder="Enter promo code"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Check className="w-5 h-5 text-green-600" />
                        <span className="text-green-800 font-medium">
                          Code "{appliedPromoCode}" applied! {discountPercent * 100}% off
                        </span>
                      </div>
                      <button
                        onClick={handleRemovePromoCode}
                        className="text-green-600 hover:text-green-800 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                  {promoError && (
                    <p className="mt-2 text-sm text-red-600">{promoError}</p>
                  )}
                </div>

                {/* Price */}
                <div className="border-t pt-6">
                  <div className="space-y-2">
                    {appliedPromoCode ? (
                      <>
                        <div className="flex items-baseline space-x-2">
                          <span className="text-lg text-gray-500 line-through">
                            ${originalPrice.toFixed(2)}
                          </span>
                          <span className="text-3xl font-bold text-gray-900">
                            ${finalPrice.toFixed(2)}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                            Save ${discountAmount.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          ${(finalPrice / quantity).toFixed(2)} per tin after discount
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="flex items-baseline space-x-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            ${originalPrice.toFixed(2)}
                          </span>
                          <span className="text-gray-600">
                            (${product.price.toFixed(2)} per tin)
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          ${pricePerServing.toFixed(2)} per serving • {product.servings} servings per tin
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Add to Cart */}
                <div className="space-y-3">
                  <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4 text-center">
                    <p className="text-orange-800 font-bold text-lg">🚀 COMING SOON</p>
                    <p className="text-orange-600 text-sm mt-1">This product will be available for purchase shortly!</p>
                  </div>
                  <button
                    disabled
                    className="w-full bg-gray-400 cursor-not-allowed text-white py-4 px-6 rounded-lg font-semibold text-lg opacity-60 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>Not Available Yet</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="mb-16">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-8">
            <nav className="flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            {renderTabContent()}
          </div>
        </div>

        {/* Cross-sell */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              You Might Also Like
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative"
                  onClick={() => onProductClick && onProductClick(relatedProduct.slug)}
                >
                  {/* COMING SOON Badge - Fully visible */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 transform rotate-12 shadow-lg z-10">
                    COMING SOON
                  </div>
                  
                  <div className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden">
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      relatedProduct.category === 'Electrolytes' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {relatedProduct.category}
                    </span>
                    {relatedProduct.caffeineMg > 0 && (
                      <div className="flex items-center text-green-600">
                        <Coffee className="w-4 h-4 mr-1" />
                        <span className="text-xs font-medium">
                          {relatedProduct.caffeineMg}mg
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{relatedProduct.name}</h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {relatedProduct.rating} ({relatedProduct.reviewsCount})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{relatedProduct.summary}</p>
                  <p className="font-bold text-blue-600">${relatedProduct.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": product.name,
            "description": product.description,
            "image": product.images,
            "sku": product.id,
            "brand": {
              "@type": "Brand",
              "name": "Zelyte"
            },
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": product.rating && product.reviewsCount ? {
              "@type": "AggregateRating",
              "ratingValue": product.rating,
              "reviewCount": product.reviewsCount
            } : undefined
          })
        }}
      />
    </div>
  );
};

export default ProductDetail;
