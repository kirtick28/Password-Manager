'use client';
import Image from 'next/image';
import { Sour_Gummy } from 'next/font/google';
import { useEffect, useState } from 'react';
import SavePassword from '@/components/SavePassword';
import Header from '@/components/Header';

const sourGummy = Sour_Gummy({
  variable: '--font-sour-gummy',
  subsets: ['latin']
});

export default function Home() {
  const [password, setPassword] = useState('P@$5w0₹D');
  const [isLogged, setIsLogged] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [options, setOptions] = useState({
    length: 8,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  });
  const [hint, setHint] = useState({
    type: 'Moderate',
    message: 'Not bad'
  });

  const getHintFromPassword = (password) => {
    const length = password.length;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    const isOnlyLetters = /^[A-Za-z]+$/.test(password);
    const isOnlyNumbers = /^\d+$/.test(password);
    const isRepetitive = /(.)\1{2,}/.test(password);
    const keyboardPatterns = ['qwerty', 'asdf', 'zxcv', '1234', 'password'];

    const isPatterned = keyboardPatterns.some((pattern) =>
      password.toLowerCase().includes(pattern)
    );

    if (length < 6 || isOnlyNumbers || isOnlyLetters) {
      return {
        type: 'Weak',
        message: 'Bro... even your ATM pin is safer 💀'
      };
    }

    if (isPatterned) {
      return {
        type: 'Weak',
        message: "C'mon da... not 'qwerty' in 2025!"
      };
    }

    if (isRepetitive) {
      return {
        type: 'Moderate',
        message: "I see the loop you'sre stuck in. Mix it up!"
      };
    }

    if (length > 12 && hasUpper && hasLower && hasNumber && hasSymbol) {
      return {
        type: 'Strong',
        message: 'Sheeesh! Even hackers gonna give up 🔐'
      };
    }

    if (length >= 10 && hasLower && hasUpper && hasNumber) {
      return {
        type: 'Moderate',
        message: 'Add some spice da... where are the symbols?'
      };
    }

    if (length >= 8 && hasLower && hasNumber) {
      return {
        type: 'Moderate',
        message: 'Not bad, but it still looks crackable 👀'
      };
    }

    return {
      type: 'Moderate',
      message: "It's okay-okay bro... don't reuse this one."
    };
  };

  const generatePassword = () => {
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=₹';

    let allChars = '';
    let pass = '';

    if (options.uppercase) allChars += uppercase;
    if (options.lowercase) allChars += lowercase;
    if (options.numbers) allChars += numbers;
    if (options.symbols) allChars += symbols;

    if (allChars.length === 0) {
      alert('No Constraint is set');
      setPassword('Select Constraint');
      return;
    }

    for (let i = 0; i < options.length; i++) {
      const randIndex = Math.floor(Math.random() * allChars.length);
      pass += allChars[randIndex];
    }

    setPassword(pass);
    setHint(getHintFromPassword(pass));
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const id = localStorage.getItem('id');
    if (!token || !id) setIsLogged(false);
  }, []);

  useEffect(() => {
    generatePassword();
  }, [options]);

  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(password);
      alert('Copied successfully!!');
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="bg-[url('/bg.jpg')] bg-cover bg-center">
      <Header />
      <div className="flex flex-col gap-10 items-center justify-center min-h-screen">
        <div className="w-[35%] border-2 rounded-3xl relative px-12 py-12 flex flex-col gap-10 shadow-2xl bg-white/40 backdrop-blur-md shadow-amber-100 border-yellow-300">
          <div className="text-center">
            <h1 className="text-3xl font-bold">Password Generator</h1>
            <p className="text-sm text-gray-500">
              Generate strong unique passwords
            </p>
          </div>
          <div className="bg-[#eceae8] rounded-2xl">
            <div className="flex justify-between p-6 items-center shadow-2xl gap-2">
              <input
                type="text"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setHint(getHintFromPassword(e.target.value));
                }}
                className={`text-2xl tracking-[.10em] ${sourGummy.variable} overflow-hidden whitespace-nowrap text-ellipsis bg-transparent outline-none w-full`}
              />
              <div className="flex gap-3 align-center shrink-0">
                <button
                  className="px-4 py-1 text-md bg-black text-gray-300 rounded-md cursor-pointer hover:opacity-60 active:opacity-80"
                  onClick={() => {
                    handleCopyClick();
                  }}
                >
                  Copy
                </button>
                <button
                  className="p-2 text-md bg-black text-gray-300 rounded-md cursor-pointer hover:opacity-60 active:opacity-80"
                  onClick={() => {
                    generatePassword();
                  }}
                >
                  <img
                    width="20"
                    height="20"
                    src="https://img.icons8.com/ios-glyphs/30/FFFFFF/refresh--v1.png"
                    alt="refresh--v1"
                  />
                </button>
              </div>
            </div>
            <div className="text-sm text-center bg-[#f6e0c2] opacity-0.8 rounded-bl-2xl rounded-br-2xl p-2">
              <p className="text-[#9d7300]">
                <span className="font-bold">{hint.type}: </span>
                {hint.message}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <p>Password length</p>
              <p className="mr-2">{options.length}</p>
            </div>
            <input
              type="range"
              min={1}
              max={64}
              value={options.length}
              onChange={(ev) => {
                setOptions((prev) => {
                  return { ...prev, length: ev.target.value };
                });
              }}
            ></input>
            <div className="flex items-center justify-between">
              <p className="inline">Include Uppercase Letters</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={options.uppercase}
                  onChange={() =>
                    setOptions((prev) => {
                      return { ...prev, uppercase: !prev.uppercase };
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-400 border-1 rounded-full peer peer-checked:bg-gray-800 transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <p className="inline">Include Lowercase Letters</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={options.lowercase}
                  onChange={() =>
                    setOptions((prev) => {
                      return { ...prev, lowercase: !prev.lowercase };
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-400 border-1 rounded-full peer peer-checked:bg-gray-800 transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <p className="inline">Include Numbers</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={options.numbers}
                  onChange={() =>
                    setOptions((prev) => {
                      return { ...prev, numbers: !prev.numbers };
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-400 border-1 rounded-full peer peer-checked:bg-gray-800 transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <p className="inline">Include Symbols</p>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value=""
                  className="sr-only peer"
                  checked={options.symbols}
                  onChange={() =>
                    setOptions((prev) => {
                      return { ...prev, symbols: !prev.symbols };
                    })
                  }
                />
                <div className="w-11 h-6 bg-gray-400 border-1 rounded-full peer peer-checked:bg-gray-800 transition-colors"></div>
                <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>
        </div>
        {isLogged ? (
          <div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 active:bg-blue-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Save Password
            </button>
          </div>
        ) : null}
      </div>
      {showModal && (
        <SavePassword password={password} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
}
