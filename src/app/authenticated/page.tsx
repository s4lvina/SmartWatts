'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthenticatedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to dashboard after short delay
    const timer = setTimeout(() => {
      router.push('/');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center">
        <div className="mb-6">
          <svg
            className="w-16 h-16 mx-auto text-green-500 animate-bounce"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">
          ¡Autenticación exitosa!
        </h1>
        <p className="text-gray-400 mb-4">
          Conectando tu cuenta de Strava...
        </p>
        <p className="text-gray-500 text-sm">
          Te redirigiremos al dashboard en unos momentos.
        </p>
      </div>
    </div>
  );
}
