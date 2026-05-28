import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data);
      toast.success(`Account created! Welcome, ${data.name}!`);
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <span className="text-white text-2xl font-bold font-display">S</span>
          </div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-2">Join ShopNow and start shopping</p>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="input-field"
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Min. 6 characters"
                className="input-field"
                autoComplete="new-password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Type</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="input-field"
              >
                <option value="user">User — Browse & Shop</option>
                <option value="admin">Admin — Manage Products</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2 text-base"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-medium hover:text-orange-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
