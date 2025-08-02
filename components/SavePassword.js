'use client';
import { useState } from 'react';

export default function SavePassword({ password, onClose }) {
  const [label, setLabel] = useState('');
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [website, setWebsite] = useState('');

  const handleSave = async () => {
    if (!label.trim() || !usernameOrEmail.trim()) {
      return alert('Label and username/email are required');
    }

    const token = localStorage.getItem('token');

    const res = await fetch('/api/password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ label, usernameOrEmail, password, website })
    });

    const data = await res.json();
    if (res.ok) {
      alert('Password saved!');
      onClose();
    } else {
      alert(data.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">Save Password</h2>

        <input
          type="text"
          placeholder="Label (e.g., Gmail)"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <input
          type="text"
          placeholder="Username or Email"
          className="w-full mb-3 px-4 py-2 border rounded"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        />

        <input
          type="url"
          placeholder="Website URL (optional)"
          className="w-full mb-4 px-4 py-2 border rounded"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
