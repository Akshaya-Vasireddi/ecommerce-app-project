import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-[#f8f7f4]">
            <Navbar />
            <main className="page-enter">
              <Routes>
                <Route path="/" element={<Navigate to="/products" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<Navigate to="/products" replace />} />
              </Routes>
            </main>
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: 'DM Sans, sans-serif',
              },
              success: {
                iconTheme: { primary: '#f97316', secondary: '#fff' },
              },
            }}
          />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
