export const Toggle = ({
  label,
  description,
  name,
  register,
}: {
  label: string;
  description: string;
  name: "isActive" | "isFeatured";
  register: any;
}) => (
  <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg border border-gray-800">
    <div>
      <label className="text-sm font-medium text-gray-200">{label}</label>
      <p className="text-xs text-gray-400 mt-1">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        {...register(name)}
        className="sr-only peer"
        aria-label={label}
      />
      <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
    </label>
  </div>
);
