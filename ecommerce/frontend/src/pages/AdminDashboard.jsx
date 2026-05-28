import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const EMPTY_FORM = {
  name: '', description: '', price: '', category: '',
  stock: '', image: '',
};

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [stats, setStats] = useState({ total: 0, outOfStock: 0, categories: 0 });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/products');
      setProducts(data);
      setStats({
        total: data.length,
        outOfStock: data.filter((p) => p.stock === 0).length,
        categories: new Set(data.map((p) => p.category)).size,
      });
    } catch {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const openAddModal = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
      image: product.image || '',
    });
    setEditingId(product._id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, form);
        toast.success('Product updated!');
      } else {
        await api.post('/products', form);
        toast.success('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success('Product deleted');
      setDeleteConfirm(null);
      fetchProducts();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your product catalog</p>
        </div>
        <button onClick={openAddModal} className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Product
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Total Products', value: stats.total, icon: '📦', color: 'bg-blue-50 border-blue-100' },
          { label: 'Out of Stock', value: stats.outOfStock, icon: '⚠️', color: 'bg-red-50 border-red-100' },
          { label: 'Categories', value: stats.categories, icon: '🏷️', color: 'bg-green-50 border-green-100' },
        ].map((stat) => (
          <div key={stat.label} className={`card p-5 border ${stat.color}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-3xl font-bold font-display text-gray-900 mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-8 bg-gray-200 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24 card">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-bold font-display text-gray-700">No products yet</h3>
          <p className="text-gray-400 mt-2">Add your first product to get started</p>
          <button onClick={openAddModal} className="btn-primary mt-4">Add Product</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              isAdminView
              onEdit={openEditModal}
              onDelete={(id) => setDeleteConfirm(id)}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold font-display text-gray-900">
                {editingId ? 'Edit Product' : 'Add New Product'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {[
                { name: 'name', label: 'Product Name *', placeholder: 'e.g. iPhone 15 Pro' },
                { name: 'category', label: 'Category *', placeholder: 'e.g. Electronics' },
                { name: 'image', label: 'Image URL', placeholder: 'https://example.com/image.jpg' },
              ].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="input-field"
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="999"
                    min="0"
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : editingId ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="text-center">
              <div className="text-5xl mb-4">🗑️</div>
              <h3 className="text-lg font-bold font-display text-gray-900">Delete Product?</h3>
              <p className="text-gray-500 mt-2 text-sm">This action cannot be undone.</p>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setDeleteConfirm(null)} className="btn-secondary flex-1">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="btn-danger flex-1">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
