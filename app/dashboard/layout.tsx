import { Header } from "@/components/layout/header";

/**
 * Dashboard layout
 * Wraps dashboard pages with header and common layout
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <Header />
      <main>{children}</main>
    </div>
  );
}
