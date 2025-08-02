'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import PasswordCard from '@/components/PasswordCard';

export default function PasswordManagerPage() {
  const router = useRouter();
  const [passwords, setPasswords] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    const fetchPasswords = async () => {
      try {
        const res = await fetch('/api/password', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        console.log('Data: ', data);
        if (res.ok) {
          setPasswords(data.passwords);
        } else {
          alert(data.message || 'Failed to load passwords');
          router.push('/');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong');
        router.push('/');
      }
    };

    fetchPasswords();
  }, []);

  const filtered = passwords.filter((entry) =>
    entry.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      alert('Failed to copy');
    }
  };

  return (
    <div className="bg-[url('/bg.jpg')] bg-cover bg-center">
      <Header />
      <div className="min-h-screen py-10 px-6">
        <h1 className="text-3xl font-bold text-center mb-8">Your Passwords</h1>
        <div className="max-w-md mx-auto mb-6">
          <input
            type="text"
            placeholder="Search by label..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-black"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <div key={item._id}>
                <PasswordCard
                  item={item}
                  passwords={passwords}
                  setPasswords={setPasswords}
                />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No passwords found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
