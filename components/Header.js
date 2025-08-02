'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
  const path = usePathname();
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(true);
  useEffect(() => {
    const user = localStorage.getItem('token');
    if (!user) setIsLogged(false);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('id');
    router.push('/login');
  };
  return (
    <header className="w-full flex justify-between items-center px-8 py-4 shadow-md">
      <div className="text-xl font-bold text-amber-700 tracking-wide">
        PassGuard
      </div>

      <nav className="flex gap-6 items-center text-md font-medium text-amber-700">
        <Link href="/" className="hover:text-yellow-500 transition-colors">
          Home
        </Link>
        {isLogged ? (
          <Link
            href="/password-manager"
            className="hover:text-yellow-500 transition-colors"
          >
            Password Manager
          </Link>
        ) : null}
        {isLogged ? (
          <Link
            href="/profile"
            className="hover:text-yellow-500 transition-colors"
          >
            Profile
          </Link>
        ) : null}
        {!isLogged ? (
          path !== '/login' ? (
            <Link
              href="/login"
              className="hover:text-yellow-500 transition-colors"
            >
              Login
            </Link>
          ) : null
        ) : (
          <button
            href="/"
            className="hover:text-yellow-500 transition-colors cursor-pointer"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
}
