import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useEffect } from 'react';

const ShoppingBagIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const ClipboardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const GridIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

export default function Navbar() {
  const { user, logout, isAdmin, isAuthenticated } = useAuth();
  const { cartCount, fetchCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/products" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shadow-sm group-hover:bg-orange-600 transition-colors">
              <span className="text-white font-bold text-sm font-display">S</span>
            </div>
            <span className="text-xl font-bold font-display text-gray-900">
              Shop<span className="text-orange-500">Now</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-1">
            <Link
              to="/products"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/products')
                  ? 'bg-orange-50 text-orange-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <GridIcon />
              <span className="hidden sm:block">Products</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/cart"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                    isActive('/cart')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ShoppingBagIcon />
                  <span className="hidden sm:block">Cart</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/orders"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/orders')
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ClipboardIcon />
                  <span className="hidden sm:block">Orders</span>
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive('/admin')
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <ShieldIcon />
                    <span className="hidden sm:block">Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center">
                    <span className="text-orange-600 text-xs font-bold">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium max-w-[100px] truncate">
                    {user?.name}
                  </span>
                  {isAdmin && (
                    <span className="badge bg-orange-100 text-orange-700">Admin</span>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-gray-500 hover:text-red-500 font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2 px-4">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
