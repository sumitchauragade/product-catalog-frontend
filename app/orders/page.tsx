'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    if (user?.id) {
      api.get(`/orders/user/${user.id}`)
        .then(res => setOrders(res.data))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, user?.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Your Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-700 p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">No orders yet</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-md hover:shadow-lg transition border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{order.product_name}</h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{order.category}</p>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Quantity</p>
                          <p className="font-semibold text-gray-900 dark:text-white">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400">Order Date</p>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">Total Price</p>
                      <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-3">
                        ${typeof order.total_price === 'string' ? parseFloat(order.total_price).toFixed(2) : order.total_price.toFixed(2)}
                      </p>
                      <span className={`inline-block text-sm px-4 py-2 rounded-full font-semibold ${
                        order.status === 'confirmed'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      }`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}