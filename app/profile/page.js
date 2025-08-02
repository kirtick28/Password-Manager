'use client';
import Header from '@/components/Header';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Profile = () => {
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    if (!id || !token) {
      router.push('/');
      return;
    }
    setUserId(id);
    setToken(token);

    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (res.ok) {
          setUser((prev) => ({
            ...prev,
            name: data.name || '',
            email: data.email || ''
          }));
        } else {
          alert(data.message || 'Failed to fetch user');
        }
      } catch (err) {
        console.error(err);
        alert('Something went wrong');
      }
    };

    fetchUser();
  }, []);

  const handleChange = (field, value) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch(`/api/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(user)
      });
      const data = await res.json();
      if (res.ok) {
        alert('Profile updated successfully!');
        setIsEditing(false);
      } else {
        alert(data.message || 'Update failed');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('/bg.jpg')] bg-cover bg-center min-h-screen">
      <Header />
      <div className="flex items-center justify-center py-16 px-4">
        <div className="bg-white/40 backdrop-blur-md p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border border-yellow-300">
          <img
            src="/avatar.png"
            alt="Profile"
            className="w-28 h-28 rounded-full mx-auto mb-4 border-4 border-yellow-400 shadow-md object-cover"
          />
          <h2 className="text-2xl font-bold text-yellow-700 mb-1">
            {user.name || 'Your Name'}
          </h2>
          <p className="text-sm text-gray-600 mb-6">{user.email}</p>
          <form onSubmit={handleSave} className="space-y-4 text-left">
            <div>
              <label className="text-sm font-medium text-yellow-700">
                Name
              </label>
              <input
                type="text"
                value={user.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-yellow-700">
                Email
              </label>
              <input
                type="email"
                value={user.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-900"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-yellow-700">
                Password
              </label>
              <input
                type="password"
                value={user.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-yellow-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 bg-white text-gray-900"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold rounded transition"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
