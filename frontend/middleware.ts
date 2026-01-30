import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Get the path
    const path = request.nextUrl.pathname

    // Define protected routes
    const isProtectedUserRoute = path.startsWith('/user')
    const isProtectedAdminRoute = path.startsWith('/admin')

    // Get the token and role from cookies (Assuming they are stored in cookies for middleware access)
    // NOTE: Ideally, you should store the token in a cookie for middleware access, 
    // as localStorage is not available in server-side middleware.
    // For this sprint, we'll assume a 'token' and 'role' cookie might be present,
    // OR we might need to rely on client-side protection if cookies aren't used.

    // Since the current implementation uses localStorage, middleware access is limited.
    // However, we can basic check if cookies exist, but typically with localStorage auth, 
    // we do rote protection in the Layout or a Client Component Wrapper.

    // PLAN B: CLIENT-SIDE PROTECTION (Since implementation uses localStorage)
    // We will keep this middleware simple or skip it if we decide to do client-side checks.
    // BUT, to follow best practices, let's setup a basic check assuming we MIGHT migrate to cookies later.

    // For now, let's just pass through and rely on Client-Side HOC/Components for localStorage verification.
    // BECAUSE: We cannot access localStorage here.

    // If we really want middleware protection, we must switch to Cookies.
    // Let's implement a basic pass-through for now to avoid breaking the localStorage app,
    // and implement rigorous checks in a Client Component (e.g., AuthGuard).

    return NextResponse.next()
}

// See "Proper Implementation" below using Client Components for localStorage auth.
export const config = {
    matcher: ['/admin/:path*', '/user/:path*'],
}
