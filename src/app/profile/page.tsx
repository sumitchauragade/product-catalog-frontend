'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return router.push('/auth/login') as any;
    api.get('/profile')
      .then(res => setProfile(res.data.user))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      {profile && (
        <div className="border rounded-lg p-6 space-y-3">
          <div>
            <p className="text-gray-500 text-sm">Name</p>
            <p className="font-semibold text-lg">{profile.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-semibold">{profile.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Member Since</p>
            <p className="font-semibold">
              {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}