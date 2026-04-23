// Register Page
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await api.post('/auth/register', { name, email, password });
      router.push('/auth/login');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-8">Register</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Full Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-4"
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-4"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="border px-4 py-2 rounded w-full mb-6"
      />
      <button
        onClick={handleRegister}
        className="bg-black text-white px-6 py-2 rounded w-full hover:bg-gray-800"
      >
        Register
      </button>
      <p className="text-center mt-4 text-gray-500">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-black underline">
          Login
        </Link>
      </p>
    </div>
  );
}