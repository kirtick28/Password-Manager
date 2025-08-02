'use client';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.status === 200) {
        console.log(data);
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.user.id);
        localStorage.setItem('name', data.user.name);
        router.push('/');
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (token && id) router.push('/');
  }, []);

  return (
    <div className="bg-[url(/bg-2.jpg)] bg-cover bg-center">
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/60 rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Login to PassGuard
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-black text-white py-2 rounded-md hover:opacity-80 active:opacity-90 transition cursor-pointer"
            >
              Login
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-gray-500">
            Dont have an account?{' '}
            <a href="/register" className="underline hover:text-black">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
