import AdminSidebar from "@/components/admin-sidebar";
import MobileHeader from "@/components/mobile-header";
import SidebarHeader from "@/components/admin-header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader />

      <div className="flex h-full">
        <AdminSidebar />
        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto max-h-screen">
          <div className="max-w-7xl mx-auto">
            <SidebarHeader />
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
