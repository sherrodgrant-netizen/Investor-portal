import Link from "next/link";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Deals", href: "/dashboard/deals" },
    { name: "Documents", href: "/dashboard/documents" },
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

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 bg-slate-800 text-white hidden md:block">
          <div className="p-4 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Image
                src="/diamond logo.svg"
                alt="Diamond"
                width={32}
                height={32}
                className="w-8 h-8 brightness-0 invert"
              />
              <span className="font-semibold text-sm">Diamond</span>
            </div>
          </div>
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="block px-4 py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
