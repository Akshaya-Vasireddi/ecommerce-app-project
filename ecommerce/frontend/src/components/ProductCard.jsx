import { useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product, onEdit, onDelete, isAdminView = false }) {
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const { fetchCart } = useCart();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }
    setLoading(true);
    try {
      await api.post('/cart/add', { productId: product._id, quantity: 1 });
      await fetchCart();
      toast.success(`"${product.name}" added to cart!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const stockStatus = () => {
    if (product.stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700' };
    if (product.stock <= 5) return { label: `Only ${product.stock} left`, color: 'bg-amber-100 text-amber-700' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-700' };
  };

  const stock = stockStatus();

  return (
    <div className="card group flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-50 aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = `https://via.placeholder.com/400x300/f8f7f4/999?text=${encodeURIComponent(product.name)}`;
          }}
        />
        <div className="absolute top-3 left-3">
          <span className="badge bg-white/90 text-gray-600 shadow-sm text-xs">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center justify-between mt-1">
          <span className="text-2xl font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className={`badge text-xs ${stock.color}`}>{stock.label}</span>
        </div>

        {isAdminView ? (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(product)}
              className="flex-1 btn-secondary text-sm py-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(product._id)}
              className="flex-1 btn-danger text-sm py-2"
            >
              Delete
            </button>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={loading || product.stock === 0}
            className="mt-2 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Adding...
              </>
            ) : product.stock === 0 ? (
              'Out of Stock'
            ) : (
              '+ Add to Cart'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
