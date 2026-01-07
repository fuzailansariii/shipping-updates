export default function ProductsPage() {
  return (
    <>
      {/* <AdminHeader title="Products" subtitle="Manage your product inventory" /> */}

      <div className="bg-white rounded-lg shadow-sm my-10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Product List</h2>
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
            Add Product
          </button>
        </div>

        {/* Your products content here */}
        <p className="text-gray-600">
          Product management interface coming soon...
        </p>
      </div>
    </>
  );
}
