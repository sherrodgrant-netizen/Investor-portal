import "./globals.css";

export const metadata = {
  title: "Investor Portal",
  description: "Investor Portal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Arial, Helvetica, sans-serif" }}>
        <header
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid #eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <strong>Investor Portal</strong>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="/" style={{ textDecoration: "none" }}>Home</a>
            <a href="/dashboard" style={{ textDecoration: "none" }}>Dashboard</a>
            <a href="/login" style={{ textDecoration: "none" }}>Login</a>
          </nav>
        </header>

        <div style={{ padding: 24 }}>{children}</div>
      </body>
    </html>
  );
}
