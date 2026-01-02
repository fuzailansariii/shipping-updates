import AdminSidebar from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100 h-screen overflow-hidden">
      <div className="flex h-full">
        {/* Add h-screen here */}
        <AdminSidebar />
        <main className="flex-1 p-8 pt-20 lg:pt-8 overflow-y-auto max-h-screen">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
