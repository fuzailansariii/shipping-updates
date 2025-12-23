import AdminSidebar from "@/components/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-100">
      <div className="flex">
        {/* Add h-screen here */}
        <AdminSidebar />
        <main className="flex-1 p-8 pt-20 lg:pt-8">
          {/* Add overflow-y-auto */}
          {/* pt-20 on mobile for header space, pt-8 on desktop */}
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
