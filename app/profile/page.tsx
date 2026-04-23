'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<{ name: string; email: string; created_at: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }
    api.get('/profile')
      .then(res => setProfile(res.data.user))
      .finally(() => setLoading(false));
  }, [isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 w-full py-12 sm:py-20">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent mb-4">
            My Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Manage your account information</p>
        </div>

        {/* Profile Card */}
        {profile && (
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
            {/* Header Background */}
            <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

            {/* Profile Content */}
            <div className="px-8 sm:px-10 pb-10">
              {/* Avatar and Name */}
              <div className="flex flex-col sm:flex-row sm:items-end sm:gap-6 -mt-20 mb-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 shadow-lg border-4 border-white dark:border-slate-800 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 sm:mt-0">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                </div>
              </div>

              {/* Information Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
                {/* Email */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-2xl p-6">
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Email</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{profile.email}</p>
                </div>

                {/* Member Since */}
                <div className="bg-gray-50 dark:bg-slate-700 rounded-2xl p-6">
                  <p className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider mb-3">Member Since</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {new Date(profile.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/')}
                  className="flex-1 bg-white dark:bg-slate-700 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 py-4 rounded-xl font-bold hover:bg-indigo-50 dark:hover:bg-slate-600 transition uppercase tracking-wider"
                >
                  Continue Shopping
                </button>
                <button
                  onClick={() => { logout(); router.push('/'); }}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-4 rounded-xl font-bold transition shadow-md hover:shadow-lg uppercase tracking-wider"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}