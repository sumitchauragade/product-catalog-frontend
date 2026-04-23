'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products')
      .then(res => {
        setProducts(res.data);
        setFiltered(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = products;
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (category !== 'All') {
      result = result.filter(p => p.category === category);
    }
    setFiltered(result);
  }, [search, category, products]);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 py-16 sm:py-20">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Discover Our Products
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg sm:text-xl max-w-3xl">
            Browse our curated collection of premium products
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl p-8 sm:p-10 mb-16">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-base"
              />
            </div>
            <div className="w-full sm:w-56">
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-base"
              >
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">
            {filtered.map(product => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <div className="h-full bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 border border-gray-100 dark:border-slate-700 group">
                  {/* Image Placeholder */}
                  <div className="h-56 bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-900 dark:to-pink-900 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-10 group-hover:opacity-20 transition"></div>
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                    </svg>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-7">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs font-bold bg-gradient-to-r from-indigo-500 to-pink-500 text-white px-4 py-2 rounded-full uppercase tracking-wider">
                        {product.category}
                      </span>
                      {product.stock > 5 && (
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase">In Stock</span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {product.name}
                    </h2>

                    <div className="flex items-end justify-between mb-6">
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                        ${typeof product.price === 'string' ? parseFloat(product.price).toFixed(2) : product.price.toFixed(2)}
                      </p>
                      <div className="text-right">
                        <p className={`text-xs font-bold uppercase ${product.stock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
                        </p>
                      </div>
                    </div>

                    {/* Buy Button */}
                    <button className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold py-3 rounded-xl transition-all shadow-md hover:shadow-lg">
                      View Details →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-600 dark:text-gray-400 text-xl">No products found. Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}