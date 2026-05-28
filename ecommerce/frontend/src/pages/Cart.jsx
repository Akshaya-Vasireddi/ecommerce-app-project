import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const { fetchCart, updateCartCount } = useCart();
  const navigate = useNavigate();

  const loadCart = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch {
      toast.error('Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const handleUpdate = async (productId, quantity) => {
    try {
      const { data } = await api.put(`/cart/update/${productId}`, { quantity });
      setCart(data);
      updateCartCount(data.items);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handleRemove = async (productId) => {
    try {
      const { data } = await api.delete(`/cart/remove/${productId}`);
      setCart(data);
      updateCartCount(data.items);
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleCheckout = async () => {
    setCheckingOut(true);
    try {
      await api.post('/orders/checkout');
      await fetchCart();
      toast.success('Order placed successfully! 🎉');
      navigate('/orders');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckingOut(false);
    }
  };

  const totalAmount = cart?.items?.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
  ) || 0;

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card p-4 animate-pulse flex gap-4">
              <div className="w-20 h-20 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!cart?.items?.length) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-7xl mb-4">🛒</div>
        <h2 className="text-2xl font-bold font-display text-gray-800">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-6">Add some products to get started</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold font-display text-gray-900 mb-6">
        Your Cart
        <span className="ml-2 text-lg text-gray-400 font-normal">
          ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Items */}
        <div className="flex-1 space-y-3">
          {cart.items.map((item) => (
            item.product && (
              <div key={item.product._id} className="card p-4 flex gap-4">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl flex-shrink-0 bg-gray-100"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/80x80/f8f7f4/999?text=IMG`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                    {item.product.name}
                  </h3>
                  <p className="text-orange-500 font-bold mt-0.5">
                    ₹{item.product.price.toLocaleString('en-IN')}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.product.category}</p>

                  <div className="flex items-center justify-between mt-3">
                    {/* Quantity control */}
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button
                        onClick={() => item.quantity > 1 && handleUpdate(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 disabled:opacity-30 transition-colors"
                      >
                        −
                      </button>
                      <span className="w-8 h-8 flex items-center justify-center text-sm font-medium bg-gray-50">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdate(item.product._id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-bold text-gray-900 text-sm">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => handleRemove(item.product._id)}
                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:w-72">
          <div className="card p-5 sticky top-20">
            <h2 className="text-lg font-bold font-display text-gray-900 mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-3 mt-3 flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="btn-primary w-full mt-5 py-3 flex items-center justify-center gap-2"
            >
              {checkingOut ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Checkout →'
              )}
            </button>
            <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-orange-500 mt-3 transition-colors">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
