import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressInput } from "@/lib/validations/zod-schema";
import Container from "./container";

interface AddressFormProps {
  onSubmit: (data: AddressInput) => void | Promise<void>;
  defaultValues?: Partial<AddressInput>;
  isLoading?: boolean;
  onCancel?: () => void;
  submitButtonText?: string;
}

export default function AddressForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  onCancel,
  submitButtonText = "Save Address",
}: AddressFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      phone: defaultValues?.phone || "",
      addressLine1: defaultValues?.addressLine1 || "",
      addressLine2: defaultValues?.addressLine2 || "",
      city: defaultValues?.city || "",
      state: defaultValues?.state || "",
      pincode: defaultValues?.pincode || "",
      landmark: defaultValues?.landmark || "",
      isDefault: defaultValues?.isDefault || false,
    },
  });

  const handleFormSubmit = async (data: AddressInput) => {
    await onSubmit(data);
    reset();
  };

  return (
    // <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
    //   {/* Full Name */}
    //   <div>
    //     <label
    //       htmlFor="fullName"
    //       className="block text-sm font-medium text-gray-700 mb-1"
    //     >
    //       Full Name <span className="text-red-500">*</span>
    //     </label>
    //     <input
    //       {...register("fullName")}
    //       type="text"
    //       id="fullName"
    //       placeholder="John Doe"
    //       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //     />
    //     {errors.fullName && (
    //       <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
    //     )}
    //   </div>

    //   {/* Phone */}
    //   <div>
    //     <label
    //       htmlFor="phone"
    //       className="block text-sm font-medium text-gray-700 mb-1"
    //     >
    //       Phone Number <span className="text-red-500">*</span>
    //     </label>
    //     <input
    //       {...register("phone")}
    //       type="tel"
    //       id="phone"
    //       placeholder="9876543210"
    //       maxLength={10}
    //       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //     />
    //     {errors.phone && (
    //       <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
    //     )}
    //   </div>

    //   {/* Address Line 1 */}
    //   <div>
    //     <label
    //       htmlFor="addressLine1"
    //       className="block text-sm font-medium text-gray-700 mb-1"
    //     >
    //       Address Line 1 <span className="text-red-500">*</span>
    //     </label>
    //     <input
    //       {...register("addressLine1")}
    //       type="text"
    //       id="addressLine1"
    //       placeholder="House No., Building Name"
    //       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //     />
    //     {errors.addressLine1 && (
    //       <p className="text-red-500 text-sm mt-1">
    //         {errors.addressLine1.message}
    //       </p>
    //     )}
    //   </div>

    //   {/* Address Line 2 */}
    //   <div>
    //     <label
    //       htmlFor="addressLine2"
    //       className="block text-sm font-medium text-gray-700 mb-1"
    //     >
    //       Address Line 2 (Optional)
    //     </label>
    //     <input
    //       {...register("addressLine2")}
    //       type="text"
    //       id="addressLine2"
    //       placeholder="Street, Area, Colony"
    //       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //     />
    //     {errors.addressLine2 && (
    //       <p className="text-red-500 text-sm mt-1">
    //         {errors.addressLine2.message}
    //       </p>
    //     )}
    //   </div>

    //   {/* Landmark */}
    //   <div>
    //     <label
    //       htmlFor="landmark"
    //       className="block text-sm font-medium text-gray-700 mb-1"
    //     >
    //       Landmark (Optional)
    //     </label>
    //     <input
    //       {...register("landmark")}
    //       type="text"
    //       id="landmark"
    //       placeholder="Near Bus Stop, Temple, etc."
    //       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //     />
    //     {errors.landmark && (
    //       <p className="text-red-500 text-sm mt-1">{errors.landmark.message}</p>
    //     )}
    //   </div>

    //   {/* City and State - Grid */}
    //   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    //     {/* City */}
    //     <div>
    //       <label
    //         htmlFor="city"
    //         className="block text-sm font-medium text-gray-700 mb-1"
    //       >
    //         City <span className="text-red-500">*</span>
    //       </label>
    //       <input
    //         {...register("city")}
    //         type="text"
    //         id="city"
    //         placeholder="Mumbai"
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //       />
    //       {errors.city && (
    //         <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
    //       )}
    //     </div>

    //     {/* State */}
    //     <div>
    //       <label
    //         htmlFor="state"
    //         className="block text-sm font-medium text-gray-700 mb-1"
    //       >
    //         State <span className="text-red-500">*</span>
    //       </label>
    //       <input
    //         {...register("state")}
    //         type="text"
    //         id="state"
    //         placeholder="Maharashtra"
    //         className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //       />
    //       {errors.state && (
    //         <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
    //       )}
    //     </div>
    //   </div>

    //   {/* Pincode */}
    //   <div>
    //     <label
    //       htmlFor="pincode"
    //       className="block text-sm font-medium text-gray-700 mb-1"
    //     >
    //       Pincode <span className="text-red-500">*</span>
    //     </label>
    //     <input
    //       {...register("pincode")}
    //       type="text"
    //       id="pincode"
    //       placeholder="400001"
    //       maxLength={6}
    //       className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
    //     />
    //     {errors.pincode && (
    //       <p className="text-red-500 text-sm mt-1">{errors.pincode.message}</p>
    //     )}
    //   </div>

    //   {/* Set as Default */}
    //   <div className="flex items-center gap-2">
    //     <input
    //       {...register("isDefault")}
    //       type="checkbox"
    //       id="isDefault"
    //       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    //     />
    //     <label htmlFor="isDefault" className="text-sm text-gray-700">
    //       Set as default address
    //     </label>
    //   </div>

    //   {/* Action Buttons */}
    //   <div className="flex gap-3 pt-4">
    //     {onCancel && (
    //       <button
    //         type="button"
    //         onClick={onCancel}
    //         disabled={isSubmitting || isLoading}
    //         className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    //       >
    //         Cancel
    //       </button>
    //     )}
    //     <button
    //       type="submit"
    //       disabled={isSubmitting || isLoading}
    //       className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
    //     >
    //       {isSubmitting || isLoading ? "Saving..." : submitButtonText}
    //     </button>
    //   </div>
    // </form>

    <Container className="mt-6">
      <div className="flex justify-center items-center w-full">Fuzail</div>
    </Container>
  );
}
