import { NextRequest, NextResponse } from 'next/server';

// Rutas públicas que no requieren autenticación
const publicRoutes = ['/login', '/authenticated', '/api/auth/strava/callback'];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Skip middleware para rutas públicas y assets
  if (
    publicRoutes.includes(path) ||
    path.startsWith('/api/') ||
    path.startsWith('/_next') ||
    path.includes('.') // files with extensions
  ) {
    return NextResponse.next();
  }

  // Aquí puedes agregar lógica de autenticación adicional
  // Por ahora, permitimos acceso a todas las rutas
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
