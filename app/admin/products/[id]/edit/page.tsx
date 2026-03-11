import EditProduct from "@/components/product/product-edit-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="p-6">
      <EditProduct productId={id} />
    </div>
  );
}
