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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 w-full py-12 sm:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Your Orders
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Track and manage your purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-gray-100 dark:border-slate-700 p-16 text-center max-w-4xl mx-auto">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 text-2xl mb-8">No orders yet</p>
            <Link href="/" className="inline-block bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 text-white font-bold py-4 px-10 rounded-xl transition shadow-lg hover:shadow-xl text-lg">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6 max-w-6xl">
            {orders.map((order) => (
              <div key={order.order_id} className="bg-white dark:bg-slate-800 rounded-3xl shadow-md hover:shadow-xl transition border border-gray-100 dark:border-slate-700 overflow-hidden">
                <div className="p-8 sm:p-10">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{order.product_name}</h2>
                      <p className="text-base text-gray-600 dark:text-gray-400 mb-4">{order.category}</p>
                      <div className="flex flex-wrap gap-6 text-base">
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 font-semibold">Quantity</p>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">{order.quantity}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 dark:text-gray-400 font-semibold">Order Date</p>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">
                            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Price</p>
                      <p className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
                        ${typeof order.total_price === 'string' ? parseFloat(order.total_price).toFixed(2) : order.total_price.toFixed(2)}
                      </p>
                      <span className={`inline-block text-sm px-5 py-3 rounded-full font-bold ${
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