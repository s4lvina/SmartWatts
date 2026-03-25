'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const error = searchParams.get('error');
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already authenticated
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('smartwatts_user');
      if (userData) {
        // Usuario ya está autenticado, redirige al dashboard
        router.push('/');
      }
    }
  }, [router]);

  const handleStravaLogin = () => {
    setIsLoading(true);
    const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/strava/callback`;
    const scope = 'read,activity:read_all';
    
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&approval_prompt=force&scope=${scope}`;
    
    window.location.href = stravaAuthUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">SmartWatts</h1>
          <p className="text-gray-400">
            Análisis de rendimiento ciclista impulsado por IA
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Iniciar Sesión
          </h2>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded text-red-400 text-sm">
              {error === 'no_authorization_code' &&
                'No se recibió código de autorización de Strava'}
              {error === 'database_error' &&
                'Error al guardar datos. Por favor, intenta de nuevo'}
              {error === 'authentication_failed' &&
                'La autenticación falló. Por favor, intenta de nuevo'}
              {error === 'missing_supabase_config' &&
                'Error de configuración del servidor. Por favor, intenta más tarde'}
              {!['no_authorization_code', 'database_error', 'authentication_failed', 'missing_supabase_config'].includes(
                error
              ) && `Error: ${error}`}
            </div>
          )}

          {/* Strava Login Button */}
          <button
            onClick={handleStravaLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-strava hover:bg-strava/90 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.387 17.944c-2.381 1.104-4.881.406-7.21-1.04.23-.424.46-.847.688-1.271 1.537.734 3.045 1.13 4.802.734.462-.884.924-1.768 1.386-2.652-1.537-.173-2.881-.58-3.876-1.465-.575.463-1.151.927-1.727 1.39-.346.635-.69 1.27-1.035 1.905C5.74 16.47 4.088 15.886 2.895 14.8c0 0 1.151-5.694 5.627-9.285 2.23-1.788 4.76-2.316 7.209-2.316v3.622c1.417-1.445 2.834-2.89 4.252-4.335V2.276c1.416-1.445 2.833-2.89 4.251-4.335 0 2.89 0 5.78 0 8.67-1.418 1.446-2.835 2.89-4.252 4.335"
              />
            </svg>
            {isLoading ? 'Conectando...' : 'Conectar con Strava'}
          </button>

          {/* Info Text */}
          <p className="text-center text-gray-400 text-sm mt-6">
            Usamos Strava para obtener tus datos de entrenamiento de forma segura.
          </p>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/50 rounded text-blue-400 text-sm">
            <p className="font-semibold mb-2">💡 Modo Demo</p>
            <p>
              Si no tienes Strava, puedes explorar el dashboard con datos de muestra.
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-8">
          © 2026 SmartWatts. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
