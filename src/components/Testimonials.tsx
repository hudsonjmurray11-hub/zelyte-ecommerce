import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { productReviewService } from '../services/productReviewService';
import { ProductReview } from '../services/reviewService';

// Fallback testimonials if no reviews exist
const fallbackTestimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Marathon Runner',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    text: "Zelyte has completely transformed my training. The coconut citrus flavor is incredible and I feel the difference in my hydration levels within minutes."
  },
  {
    id: 2,
    name: 'Mike Chen',
    role: 'Fitness Trainer',
    avatar: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    text: "I recommend Zelyte to all my clients. The natural ingredients and rapid absorption make it the perfect workout companion."
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Yoga Instructor',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    text: "As someone who teaches hot yoga, proper hydration is crucial. Zelyte keeps me energized and balanced throughout my longest sessions."
  },
  {
    id: 4,
    name: 'David Thompson',
    role: 'Cyclist',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    rating: 5,
    text: "Long rides demand serious hydration. Zelyte delivers consistent energy and taste without any artificial aftertaste."
  }
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [loading, setLoading] = useState(true);
  const { isVisible: isHeaderVisible, elementRef: headerRef } = useScrollAnimation({ threshold: 0.2 });
  const { isVisible: isCarouselVisible, elementRef: carouselRef } = useScrollAnimation({ threshold: 0.1, delay: 200 });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const allReviews = await productReviewService.getAllReviews(10);
      setReviews(allReviews || []);
    } catch (error) {
      console.error('Error loading reviews:', error);
      // On error, use empty array which will trigger fallback
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  // Convert database reviews to testimonial format
  const getTestimonials = () => {
    if (reviews.length > 0) {
      return reviews.map((review, index) => ({
        id: review.id || `review-${index}`,
        name: review.user_name,
        role: 'Customer',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user_name)}&background=3b82f6&color=fff&size=150`,
        rating: review.rating,
        text: review.review_text,
        title: review.title,
      }));
    }
    return fallbackTestimonials;
  };

  const testimonials = getTestimonials();

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-blue-50 to-cyan-50">
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
            Loved by Athletes
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of athletes who trust Zelyte for their hydration needs
          </p>
        </div>

        <div 
          ref={carouselRef as React.RefObject<HTMLDivElement>}
          className={`relative max-w-4xl mx-auto transition-all duration-1000 ease-out ${
            isCarouselVisible 
              ? 'opacity-100 translate-y-0 scale-100' 
              : 'opacity-0 translate-y-10 scale-95'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12 bg-white rounded-3xl">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
            <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 p-8 md:p-12">
                  <div className="flex flex-col items-center text-center">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-20 h-20 rounded-full mb-6 object-cover"
                    />
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    {testimonial.title && (
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">{testimonial.title}</h4>
                    )}
                    <blockquote className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </blockquote>
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{testimonial.name}</div>
                      <div className="text-blue-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>

            {testimonials.length > 1 && (
              <>
                <button
                  onClick={prevTestimonial}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                <button
                  onClick={nextTestimonial}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>

                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentIndex(index);
                        setIsAutoPlaying(false);
                      }}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;