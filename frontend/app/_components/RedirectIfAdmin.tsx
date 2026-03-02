"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RedirectIfAdmin({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const role = localStorage.getItem("role");
        if (role === "admin") {
            router.push("/admin");
        }
    }, [router]);

    // On server and first client render, render children to match server HTML
    if (!mounted) {
        return <>{children}</>;
    }

    // After mounting, if admin, return null while redirecting
    if (localStorage.getItem("role") === "admin") {
        return null;
    }

    return <>{children}</>;
}
