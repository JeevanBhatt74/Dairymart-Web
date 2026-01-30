"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AuthGuard({ children, requiredRole }: { children: React.ReactNode, requiredRole?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        if (!token) {
            // Not logged in -> Redirect to login
            router.push("/login"); // or set return url
            return;
        }

        if (requiredRole && role !== requiredRole) {
            // Logged in but wrong role -> Redirect to home or error
            // If admin is required but user is 'user', sending to home is safe
            router.push("/");
            return;
        }

        // Check specifically for /admin routes requiring admin role
        if (pathname.startsWith("/admin")) {
            if (role !== "admin") {
                router.push("/"); // Users trying to access Admin -> Go Home
                return;
            }
        } else {
            // If NOT in admin routes, but user is Admin -> Redirect to Admin Dashboard
            // This enforces "vice versa" - Admins cannot browse the store as a user
            if (role === "admin") {
                router.push("/admin");
                return;
            }
        }

        setAuthorized(true);
    }, [router, pathname, requiredRole]);

    if (!authorized) {
        return null; // or a loading spinner
    }

    return <>{children}</>;
}
