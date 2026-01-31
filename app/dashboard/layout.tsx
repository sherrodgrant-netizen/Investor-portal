import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Available Deals", href: "/dashboard/deals" },
    { name: "Docs", href: "/dashboard/documents" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="px-6 py-4 flex items-center gap-3">
          <Image
            src="/diamond logo.svg"
            alt="Diamond Acquisitions"
            width={40}
            height={40}
            className="w-10 h-10 brightness-0 invert"
          />
          <h1 className="text-xl font-semibold">
            Diamond Acquisitions – Investor Portal
          </h1>
        </div>
      </header>

      {/* Horizontal Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6">
          <ul className="flex gap-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className="block py-4 text-gray-700 font-medium hover:text-blue-600 border-b-2 border-transparent hover:border-blue-600 transition-all"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
