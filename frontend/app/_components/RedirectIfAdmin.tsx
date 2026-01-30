"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RedirectIfAdmin({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role === "admin") {
            router.push("/admin");
        } else {
            setChecking(false);
        }
    }, [router]);

    // Better UX: Show nothing while checking to prevent flash of content before redirect
    if (checking && typeof window !== 'undefined' && localStorage.getItem("role") === "admin") {
        return null;
    }

    return <>{children}</>;
}
