import React, { useState, useEffect, useRef } from 'react';
import { Star, ShoppingCart, ArrowLeft, Check, Zap, Coffee, Brain, MessageSquare, ThumbsUp, Send, ChevronDown } from 'lucide-react';
import { Product } from '../types/product';
import { getRelatedProducts } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { reviewService, ProductReview } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';

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
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    title: '',
    review_text: '',
    user_name: '',
  });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const buyBoxRef = useRef<HTMLDivElement>(null);
  const { addToCart, getTotalItems } = useCart();
  const { user } = useAuth();

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

  useEffect(() => {
    document.title = `${product.name} - Zelyte`;
    loadReviews();
  }, [product.id]);

  // Mobile sticky bar visibility
  useEffect(() => {
    const handleScroll = () => {
      if (buyBoxRef.current) {
        const rect = buyBoxRef.current.getBoundingClientRect();
        setShowStickyBar(rect.bottom < 0 && window.innerWidth < 1024);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const loadReviews = async () => {
    setLoadingReviews(true);
    try {
      const data = await reviewService.getProductReviews(product.id);
      setReviews(data);
    } catch (error) {
      console.error('Error loading reviews:', error);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Calculate dynamic rating and review count
  const calculateProductStats = () => {
    if (reviews.length === 0) {
      return {
        rating: product.rating || 0,
        reviewCount: product.reviewsCount || 0,
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    return {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount: reviews.length,
    };
  };

  const productStats = calculateProductStats();

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'how-to-use', label: 'How to Use' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'nutrition', label: 'Nutrition Facts' },
    { id: 'reviews', label: `Reviews (${productStats.reviewCount})` }
  ];

  const handleSubmitReview = async () => {
    if (!reviewForm.review_text.trim() || !reviewForm.user_name.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewService.createReview({
        product_id: product.id,
        user_name: reviewForm.user_name,
        user_email: user?.email || undefined,
        rating: reviewForm.rating,
        title: reviewForm.title || undefined,
        review_text: reviewForm.review_text,
        verified_purchase: false,
      });
      
      setReviewForm({ rating: 5, title: '', review_text: '', user_name: '' });
      setShowReviewForm(false);
      loadReviews();
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Error submitting review. Please try again.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    await reviewService.markHelpful(reviewId);
    loadReviews();
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'description':
        return <p className="text-gray-600 leading-relaxed">{product.description}</p>;
      case 'benefits':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h3>
            <ul className="space-y-3">
              {product.benefits.slice(0, 5).map((benefit, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 font-medium">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      case 'how-to-use':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use</h3>
            <ol className="space-y-4">
              {product.howToUse.slice(0, 3).map((step, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <span className="text-gray-700 font-medium block">{step}</span>
                    {index === 0 && (
                      <p className="text-sm text-gray-500 mt-1">Best consumed within 24 hours of mixing</p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Timing:</strong> Take 1 pouch anytime you need hydration—before, during, or after activity.
              </p>
            </div>
          </div>
        );
      case 'ingredients':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ingredients</h3>
              <ul className="space-y-2">
                {product.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            {product.nutritionFacts && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Facts (per pouch)</h3>
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="space-y-2">
                    {Object.entries(product.nutritionFacts).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                        <span className="font-medium text-gray-900">{key}</span>
                        <span className="text-gray-700">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
                  View full nutrition facts →
                </a>
              </div>
            )}
          </div>
        );
      case 'nutrition':
        return product.nutritionFacts ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nutrition Facts (per pouch)</h3>
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <div className="space-y-2">
                {Object.entries(product.nutritionFacts).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                    <span className="font-medium text-gray-900">{key}</span>
                    <span className="text-gray-700">{value}</span>
                  </div>
                ))}
              </div>
            </div>
            <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-4 inline-block">
              View full nutrition facts →
            </a>
          </div>
        ) : (
          <p className="text-gray-600">Nutrition facts not available.</p>
        );
      case 'reviews':
        return (
          <div className="space-y-6">
            {/* Review Summary */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center space-x-2 mt-2">
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
                    </div>
                    <span className="text-gray-600">
                      {product.rating?.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Write a Review</span>
                </button>
              </div>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Write Your Review</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                    <input
                      type="text"
                      value={reviewForm.user_name}
                      onChange={(e) => setReviewForm({ ...reviewForm, user_name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating })}
                          className="focus:outline-none"
                        >
                          <Star
                            className={`w-8 h-8 ${
                              rating <= reviewForm.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Review Title (optional)</label>
                    <input
                      type="text"
                      value={reviewForm.title}
                      onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Summarize your experience"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Review *</label>
                    <textarea
                      value={reviewForm.review_text}
                      onChange={(e) => setReviewForm({ ...reviewForm, review_text: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Share your experience with this product..."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setShowReviewForm(false);
                        setReviewForm({ rating: 5, title: '', review_text: '', user_name: '' });
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitReview}
                      disabled={submittingReview || !reviewForm.review_text.trim() || !reviewForm.user_name.trim()}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {loadingReviews ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold">
                              {review.user_name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{review.user_name}</p>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-sm text-gray-500">
                                {new Date(review.created_at || '').toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                        {review.title && (
                          <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
                        )}
                        <p className="text-gray-700 leading-relaxed">{review.review_text}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 mt-4">
                      <button
                        onClick={() => review.id && handleMarkHelpful(review.id)}
                        className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600"
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>Helpful ({review.helpful_count || 0})</span>
                      </button>
                      {review.verified_purchase && (
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {product.name}
                <span className="ml-4 inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-1 rounded-full shadow-lg">
                  COMING SOON
                </span>
              </h1>
              
              {/* Price + Value Display */}
              <div className="flex items-center flex-wrap gap-3 mb-4">
                <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">{product.servings} pouches</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-700">${pricePerServing.toFixed(2)}/pouch</span>
              </div>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(productStats.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {productStats.rating.toFixed(1)} ({productStats.reviewCount} {productStats.reviewCount === 1 ? 'review' : 'reviews'})
                  </span>
                </div>
              </div>
              <p className="text-lg text-gray-600 mb-6">{product.summary}</p>
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
            <div ref={buyBoxRef} className="bg-white rounded-2xl p-6 shadow-lg">
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
                  
                  {/* Shipping/Returns Microcopy */}
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-sm text-gray-600 text-center">
                      Ships in 1–3 business days • Free shipping $50+ • Easy returns
                    </p>
                  </div>
                  
                  {/* Trust Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Secure checkout</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Fast shipping</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Support</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>Satisfaction guarantee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bundle Upsells */}
            <div className="bg-gray-50 rounded-2xl p-6 mt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Save with bundles</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    // Add 3-pack logic
                    const bundlePrice = product.price * 3 * 0.9; // 10% off
                    addToCart({
                      id: `${product.id}-3pack`,
                      name: `${product.name} - 3 Pack`,
                      price: bundlePrice / 3,
                      flavor: product.name
                    });
                  }}
                  className="bg-white border-2 border-blue-500 rounded-lg p-4 text-left hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-gray-900 mb-1">3-Pack</div>
                  <div className="text-sm text-gray-600 mb-2">${(product.price * 3 * 0.9).toFixed(2)}</div>
                  <div className="text-xs text-green-600 font-medium">Save 10%</div>
                </button>
                <button
                  onClick={() => {
                    // Add 6-pack logic
                    const bundlePrice = product.price * 6 * 0.85; // 15% off
                    addToCart({
                      id: `${product.id}-6pack`,
                      name: `${product.name} - 6 Pack`,
                      price: bundlePrice / 6,
                      flavor: product.name
                    });
                  }}
                  className="bg-white border-2 border-blue-500 rounded-lg p-4 text-left hover:shadow-md transition-all"
                >
                  <div className="font-semibold text-gray-900 mb-1">6-Pack</div>
                  <div className="text-sm text-gray-600 mb-2">${(product.price * 6 * 0.85).toFixed(2)}</div>
                  <div className="text-xs text-green-600 font-medium">Save 15%</div>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile Sticky Add-to-Cart Bar */}
        {showStickyBar && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="px-4 py-3 flex items-center justify-between max-w-7xl mx-auto">
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-900 text-sm truncate">{product.name}</div>
                <div className="text-lg font-bold text-blue-600">${finalPrice.toFixed(2)}</div>
              </div>
              <button
                disabled
                className="ml-4 bg-gray-400 cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold text-sm opacity-60 flex items-center space-x-2 flex-shrink-0"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to cart</span>
              </button>
            </div>
          </div>
        )}
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

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {[
              {
                question: 'How do I use it?',
                answer: 'Simply add 1 pouch to 8-12 oz of water, stir or shake until fully dissolved, and enjoy immediately. Best consumed within 24 hours of mixing.'
              },
              {
                question: 'How long does it last?',
                answer: 'Each tin contains 15 pouches. Once mixed, consume within 24 hours for best taste and effectiveness.'
              },
              {
                question: 'When should I take it?',
                answer: 'Take 1 pouch anytime you need hydration—before, during, or after activity. Perfect for workouts, daily hydration, or whenever you need an electrolyte boost.'
              },
              {
                question: 'Is it nicotine-free?',
                answer: 'Yes, all Zelyte products are completely nicotine-free. They contain only electrolytes and natural flavors (with optional caffeine in some varieties).'
              },
              {
                question: 'How many per day?',
                answer: 'You can safely consume 1-3 pouches per day, depending on your activity level and hydration needs. Listen to your body and adjust accordingly.'
              },
              {
                question: 'Does it dissolve?',
                answer: 'Yes, the powder dissolves quickly in water. Simply stir or shake for a few seconds until fully dissolved. If you notice any clumping, continue stirring or shake more vigorously.'
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === `faq-${index}` ? null : `faq-${index}`)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                      expandedFAQ === `faq-${index}` ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {expandedFAQ === `faq-${index}` && (
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
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
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all flex flex-col relative"
                >
                  {/* COMING SOON Badge - Fully visible */}
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-4 py-2 transform rotate-12 shadow-lg z-10">
                    COMING SOON
                  </div>
                  
                  <div 
                    className="aspect-square bg-gray-50 rounded-lg mb-4 overflow-hidden cursor-pointer"
                    onClick={() => onProductClick && onProductClick(relatedProduct.slug)}
                  >
                    <img
                      src={relatedProduct.images[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-contain p-4"
                    />
                  </div>
                  
                  {/* Category Label */}
                  <div className="mb-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      relatedProduct.category === 'Electrolytes'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {relatedProduct.category === 'Electrolytes' ? 'Hydration' : 'Hydration + Caffeine'}
                    </span>
                  </div>
                  
                  <h3 
                    className="font-bold text-gray-900 mb-2 cursor-pointer hover:text-blue-600"
                    onClick={() => onProductClick && onProductClick(relatedProduct.slug)}
                  >
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm text-gray-600">
                      {relatedProduct.rating?.toFixed(1) || '4.5'} ({relatedProduct.reviewsCount || 0})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 flex-grow">{relatedProduct.summary}</p>
                  <p className="font-bold text-blue-600 text-lg mb-4">${relatedProduct.price}</p>
                  
                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({
                        id: relatedProduct.id,
                        name: relatedProduct.name,
                        price: relatedProduct.price,
                        flavor: relatedProduct.name
                      });
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Quick Add</span>
                  </button>
                  
                  {/* View Details Link */}
                  <button
                    onClick={() => onProductClick && onProductClick(relatedProduct.slug)}
                    className="mt-2 text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View details →
                  </button>
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
            "aggregateRating": productStats.rating > 0 && productStats.reviewCount > 0 ? {
              "@type": "AggregateRating",
              "ratingValue": productStats.rating,
              "reviewCount": productStats.reviewCount
            } : undefined
          })
        }}
      />
    </div>
  );
};

export default ProductDetail;
