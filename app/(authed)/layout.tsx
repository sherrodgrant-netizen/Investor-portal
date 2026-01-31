"use client";

import { useRouter } from "next/navigation";

export default function AuthedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      {/* Logout button (top right corner) */}
      <div className="absolute top-4 right-6 z-50">
        <button
          onClick={handleLogout}
          className="text-sm text-white bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>

      {children}
    </div>
  );
}
