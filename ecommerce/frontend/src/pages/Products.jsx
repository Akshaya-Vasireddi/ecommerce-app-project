import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('newest');
  const [searchInput, setSearchInput] = useState('');

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { sort };
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await api.get('/products', { params });
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-display text-gray-900">
          Explore Products
        </h1>
        <p className="text-gray-500 mt-1">Discover thousands of items at great prices</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="input-field pl-9"
          />
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="input-field sm:w-48"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              category === cat
                ? 'bg-orange-500 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:text-orange-500'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && (
        <p className="text-sm text-gray-500 mb-4">
          {products.length} {products.length === 1 ? 'product' : 'products'} found
        </p>
      )}

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-2/3" />
                <div className="h-8 bg-gray-200 rounded-xl mt-4" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-700 font-display">No products found</h3>
          <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          <button
            onClick={() => { setSearchInput(''); setCategory('All'); setSort('newest'); }}
            className="btn-primary mt-4"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
