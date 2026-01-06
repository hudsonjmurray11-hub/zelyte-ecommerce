import React from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, onProceedToCheckout }) => {
  const { cartItems, updateQuantity, removeFromCart, getTotalPrice, getTotalItems, isLoading, getSubscriptionDiscount, hasSubscription } = useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Cart Panel */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Shopping Cart</h2>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {getTotalItems()}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close cart"
              type="button"
            >
              <X className="w-6 h-6 text-gray-500" aria-hidden="true" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-500">Add some products to get started!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.flavor || 'default'}`} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        {item.isSubscription && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                            Subscribe & Save
                          </span>
                        )}
                      </div>
                      {item.flavor && (
                        <p className="text-sm text-gray-500">Flavor: {item.flavor}</p>
                      )}
                      {item.isSubscription && item.subscriptionTinsPerMonth && (
                        <p className="text-xs text-gray-500">{item.subscriptionTinsPerMonth} tin{item.subscriptionTinsPerMonth > 1 ? 's' : ''}/month</p>
                      )}
                      <div className="flex items-center space-x-2">
                        {item.isSubscription && (
                          <span className="text-sm text-gray-500 line-through">${(item.price * item.quantity).toFixed(2)}</span>
                        )}
                        <p className="text-lg font-bold text-blue-600">
                          ${item.isSubscription 
                            ? ((item.price * item.quantity) * 0.85).toFixed(2)
                            : (item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 disabled:opacity-50 rounded-full transition-colors"
                        aria-label={`Decrease quantity of ${item.name}`}
                        type="button"
                      >
                        <Minus className="w-4 h-4 text-gray-600" aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center font-medium" aria-label={`Quantity: ${item.quantity}`}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={isLoading}
                        className="p-1 hover:bg-gray-100 disabled:opacity-50 rounded-full transition-colors"
                        aria-label={`Increase quantity of ${item.name}`}
                        type="button"
                      >
                        <Plus className="w-4 h-4 text-gray-600" aria-hidden="true" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.id)}
                      disabled={isLoading}
                      className="p-2 hover:bg-red-50 disabled:opacity-50 text-red-500 rounded-full transition-colors"
                      aria-label={`Remove ${item.name} from cart`}
                      type="button"
                    >
                      <X className="w-4 h-4" aria-hidden="true" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              {hasSubscription() && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-green-800 font-medium">Subscription Discount (10% off):</span>
                    <span className="text-green-800 font-bold">-${getSubscriptionDiscount().toFixed(2)}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">${getTotalPrice().toFixed(2)}</span>
              </div>
              <button
                onClick={onProceedToCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center space-x-2"
                aria-label={`Proceed to checkout with ${getTotalItems()} items`}
                type="button"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;

