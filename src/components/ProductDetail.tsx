import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, ArrowLeft, Check, Zap, Coffee, Brain, MessageSquare, ThumbsUp, Send, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../types/product';
import { getRelatedProducts } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { reviewService, ProductReview } from '../services/reviewService';
import { useAuth } from '../contexts/AuthContext';
import { trackProductView, trackBeginCheckout } from '../utils/analytics';

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
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>('faq-0'); // First question expanded by default
  const { addToCart, getTotalItems } = useCart();
  const { user } = useAuth();

  const relatedProducts = getRelatedProducts(product, 3);
  const pricePerServing = product.price / product.servings;

  // Promo code validation
  const validPromoCodes: { [key: string]: number } = {
    'HUDDY': 0.10, // 10% discount
    'VIP11': 0.50, // 50% discount
    'BRIANNA PEASE': 1.00, // 100% discount (free)
    'NIGGA': 1.00 // 100% discount (free)
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
    // Update document title
    document.title = `${product.name} - Zelyte`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', `${product.summary || product.description.substring(0, 160)} - ${product.category} - $${product.price}`);
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', `${product.name} - Zelyte`);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', product.summary || product.description.substring(0, 160));
    }
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && product.images && product.images.length > 0) {
      ogImage.setAttribute('content', `${window.location.origin}${product.images[0]}`);
    }
    
    // Update canonical URL
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      canonical.setAttribute('href', `${window.location.origin}/product/${product.slug}`);
    }
    
    // Track product view
    trackProductView(product.id, product.name, product.price);
    
    setSelectedImage(0); // Reset to first image when product changes
    loadReviews();
  }, [product.id, product.name, product.summary, product.description, product.images, product.slug, product.price]);

  // Ensure selectedImage is always within bounds
  useEffect(() => {
    if (product.images && product.images.length > 0 && selectedImage >= product.images.length) {
      setSelectedImage(0);
    }
  }, [product.images, selectedImage]);

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
          <div className="space-y-3">
            {product.howToUse.map((step, index) => (
              <p key={index} className="text-gray-600 leading-relaxed">
                {step}
              </p>
            ))}
          </div>
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
              <div className="space-y-6" role="status" aria-label="Loading reviews">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="border-b border-gray-200 pb-6">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                ))}
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
            <div className="aspect-square bg-white rounded-2xl shadow-lg mb-4 relative group">
              {/* COMING SOON Badge - Fully visible, no overflow hidden */}
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-lg font-bold px-8 py-3 transform rotate-12 shadow-2xl z-10">
                COMING SOON
              </div>
              
              {/* Previous/Next Arrow Buttons */}
              {product.images && product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((selectedImage - 1 + product.images.length) % product.images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Previous image"
                    type="button"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-700" aria-hidden="true" />
                  </button>
                  <button
                    onClick={() => setSelectedImage((selectedImage + 1) % product.images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    aria-label="Next image"
                    type="button"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-700" aria-hidden="true" />
                  </button>
                </>
              )}
              
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={`${product.name} - ${product.category} electrolyte pouch`}
                  className="w-full h-full object-contain p-8"
                  loading="eager"
                  decoding="async"
                  onError={(e) => {
                    console.error('Failed to load image:', product.images[selectedImage], 'Selected index:', selectedImage, 'All images:', product.images);
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400" role="status" aria-label="Loading product image">
                  <p>Loading image...</p>
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-white rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} - View ${index + 1}`}
                      className="w-full h-full object-contain p-2"
                      loading="lazy"
                      decoding="async"
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

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {(() => {
              // Determine if product has caffeine
              const hasCaffeine = product.category === 'Electrolytes + Caffeine' || product.caffeineMg > 0;
              
              // FAQ answers based on product type
              const faqAnswers = hasCaffeine ? {
                q1: "Place 1 pouch between your gum and upper lip. Let it sit and enjoy the flavor. When you're done, remove and discard the pouch.",
                q2: "Most people keep a pouch in for about 10–20 minutes, depending on preference.",
                q3: "When you want hydration plus a clean boost—before workouts, during long days, or when you need focus and energy on the go.",
                q4: "Yes. Zelyte contains no nicotine and no tobacco.",
                q5: "Each pouch contains 40mg caffeine. Start with 1 pouch and assess your tolerance. Avoid taking too close to bedtime. If you're sensitive to caffeine or have any medical condition, check with a healthcare professional.",
                q6: "No—this is a pouch. It won't dissolve like a candy. Remove and discard it after use."
              } : {
                q1: "Place 1 pouch between your gum and upper lip. Let it sit and enjoy the flavor. When you're done, remove and discard the pouch.",
                q2: "Most people keep a pouch in for about 10–20 minutes, depending on preference.",
                q3: "Any time you want clean hydration support—before a workout, during training, after sweating, or whenever you're on the go and need electrolytes.",
                q4: "Yes. Zelyte contains no nicotine and no tobacco.",
                q5: "Start with 1–2 pouches and adjust based on your needs and activity level. If you have any medical condition or take medication, check with a healthcare professional.",
                q6: "No—this is a pouch. It won't dissolve like a candy. Remove and discard it after use."
              };

              const faqQuestions = [
                { id: 'faq-0', question: 'How do I use Zelyte?', answer: faqAnswers.q1 },
                { id: 'faq-1', question: 'How long does it last?', answer: faqAnswers.q2 },
                { id: 'faq-2', question: 'When should I take it?', answer: faqAnswers.q3 },
                { id: 'faq-3', question: 'Is this nicotine-free?', answer: faqAnswers.q4 },
                { id: 'faq-4', question: 'How many pouches can I use per day?', answer: faqAnswers.q5 },
                { id: 'faq-5', question: 'Does it dissolve?', answer: faqAnswers.q6 }
              ];

              return faqQuestions.map((faq, index) => (
                <div key={faq.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                    aria-expanded={expandedFAQ === faq.id}
                    aria-controls={`faq-answer-${faq.id}`}
                    type="button"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                        expandedFAQ === faq.id ? 'transform rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  {expandedFAQ === faq.id && (
                    <div id={`faq-answer-${faq.id}`} className="px-6 py-4 bg-gray-50 border-t border-gray-200" role="region">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ));
            })()}
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
                      alt={`${relatedProduct.name} - ${relatedProduct.category} electrolyte pouch`}
                      className="w-full h-full object-contain p-4"
                      loading="lazy"
                      decoding="async"
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
