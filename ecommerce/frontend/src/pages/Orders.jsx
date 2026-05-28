import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const STATUS_STYLES = {
  pending:    'bg-yellow-100 text-yellow-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-green-100 text-green-700',
  cancelled:  'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-6 animate-pulse space-y-3">
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-20 bg-gray-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="text-7xl mb-4">📦</div>
        <h2 className="text-2xl font-bold font-display text-gray-800">No orders yet</h2>
        <p className="text-gray-500 mt-2 mb-6">Start shopping to place your first order</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold font-display text-gray-900 mb-6">
        My Orders
        <span className="ml-2 text-lg text-gray-400 font-normal">({orders.length})</span>
      </h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="card p-5">
            {/* Order header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-xs text-gray-400 font-mono">
                  Order #{order._id.slice(-8).toUpperCase()}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`badge capitalize px-3 py-1 ${STATUS_STYLES[order.status] || 'bg-gray-100 text-gray-600'}`}>
                  {order.status}
                </span>
                <span className="font-bold text-gray-900 text-lg">
                  ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Order items */}
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50/50">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/48x48/f8f7f4/999?text=P`;
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 flex-shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 text-sm text-gray-500">
              <span>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</span>
              <span>Free Shipping</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
