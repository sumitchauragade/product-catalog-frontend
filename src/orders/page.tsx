'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'delivered'];

function StatusBar({ status }: { status: string }) {
  const currentIndex = STATUS_STEPS.indexOf(status);
  const isCancelled = status === 'cancelled';

  if (isCancelled) {
    return (
      <span className="text-sm px-2 py-1 rounded bg-red-100 text-red-700">
        cancelled
      </span>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-1">
        {STATUS_STEPS.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className={`flex flex-col items-center`}>
              <div className={`w-3 h-3 rounded-full ${
                i <= currentIndex ? 'bg-black' : 'bg-gray-300'
              }`} />
              <span className="text-xs mt-1 text-gray-500 capitalize">
                {step}
              </span>
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`h-0.5 w-8 mb-4 ${
                i < currentIndex ? 'bg-black' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    api.get(`/orders/user/${user?.id}`)
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!isAuthenticated) return router.push('/auth/login') as any;
    fetchOrders();
  }, [isAuthenticated]);

  const handleCancel = async (orderId: number) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: 'cancelled' });
      fetchOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Cancel failed');
    }
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 && (
        <p className="text-gray-500">No orders yet.</p>
      )}
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.order_id} className="border rounded-lg p-5">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h2 className="font-semibold text-lg">{order.product_name}</h2>
                <p className="text-gray-500 text-sm">{order.category}</p>
                <p className="mt-1 text-sm">Quantity: {order.quantity}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
                <StatusBar status={order.status} />
              </div>
              <div className="text-right ml-4">
                <p className="text-2xl font-bold">${order.total_price}</p>
                {order.status !== 'cancelled' && order.status !== 'delivered' && (
                  <button
                    onClick={() => handleCancel(order.order_id)}
                    className="mt-3 text-sm text-red-500 border border-red-300 px-3 py-1 rounded hover:bg-red-50"
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}