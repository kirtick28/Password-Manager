'use client';

import { useState } from 'react';

const PasswordCard = ({ item, passwords, setPasswords }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [editedData, setEditedData] = useState({
    label: item.label,
    usernameOrEmail: item.usernameOrEmail,
    password: item.password,
    website: item.website || ''
  });

  const handleCopy = async (value, type) => {
    try {
      await navigator.clipboard.writeText(value);
      alert('Copied Successfully');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized. Please login again.');
        return;
      }

      const res = await fetch(`/api/password/${item._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(editedData)
      });

      const data = await res.json();

      if (res.ok) {
        alert('Updated successfully!');
        setIsEditing(false);
      } else {
        alert(data.message || 'Failed to update');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  const handleCancel = () => {
    setEditedData({
      label: item.label,
      usernameOrEmail: item.usernameOrEmail,
      password: item.password,
      website: item.website || ''
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this password?'
    );
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Unauthorized. Please login again.');
        return;
      }

      const res = await fetch(`/api/password/${item._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        alert('Deleted successfully!');
        setPasswords((prev) => prev.filter((p) => p._id !== item._id));
      } else {
        alert(data.message || 'Failed to delete');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong while deleting');
    }
  };

  return (
    <div className="shadow-lg rounded-xl p-6 border h-full hover:shadow-xl transition-shadow duration-200 ease-in-out bg-white/60 backdrop-blur-md shadow-amber-100 border-yellow-300">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        {isEditing ? (
          <input
            value={editedData.label}
            onChange={(e) => handleChange('label', e.target.value)}
            className="text-xl font-bold text-gray-800 border rounded px-2 py-1 w-full mr-2"
          />
        ) : (
          <h2 className="text-xl font-bold text-gray-800">
            {editedData.label}
          </h2>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-yellow-700 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="text-sm text-red-400 hover:underline"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-1 font-medium">
          Email / Username
        </label>
        {isEditing ? (
          <input
            value={editedData.usernameOrEmail}
            onChange={(e) => handleChange('usernameOrEmail', e.target.value)}
            className="w-full px-3 py-2 rounded-md border text-gray-800"
          />
        ) : (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border text-gray-800">
            <span className="truncate">{editedData.usernameOrEmail}</span>
            <button
              onClick={() => handleCopy(editedData.usernameOrEmail, 'email')}
              className="text-xs text-yellow-700 hover:underline"
            >
              Copy
            </button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="text-sm text-gray-600 block mb-1 font-medium">
          Password
        </label>
        {isEditing ? (
          <input
            value={editedData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            className="w-full px-3 py-2 rounded-md border text-gray-800"
            type="text"
          />
        ) : (
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md border text-gray-800">
            <span className="truncate">
              {showPassword
                ? editedData.password
                : '*'.repeat(editedData.password.length)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-gray-500 hover:text-gray-800"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
              <button
                onClick={() => handleCopy(editedData.password, 'password')}
                className="text-xs text-yellow-700 hover:underline"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>

      {isEditing || editedData.website ? (
        <div className="mb-4">
          <label className="text-sm text-gray-600 block mb-1 font-medium">
            Website
          </label>
          {isEditing ? (
            <input
              value={editedData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              className="w-full px-3 py-2 rounded-md border text-gray-800"
              type="text"
            />
          ) : (
            <a
              href={editedData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-yellow-700 underline break-all"
            >
              {editedData.website}
            </a>
          )}
        </div>
      ) : null}

      {isEditing && (
        <div className="flex gap-2 justify-end">
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-yellow-700 text-white rounded hover:bg-yellow-700"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default PasswordCard;
