'use client';

import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      const data = await res.json();

      if (res.status === 201) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('id', data.user.user._id);
        localStorage.setItem('name', data.user.name);
        router.push('/');
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Something went wrong. Try again later.');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (token && id) router.push('/');
  }, []);

  return (
    <div className="bg-[url('/bg-2.jpg')] bg-cover bg-center">
      <Header />
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/60 rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create an Account
          </h2>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              Register
            </button>
          </form>
          <p className="text-sm text-center mt-4 text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="underline hover:text-black">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
