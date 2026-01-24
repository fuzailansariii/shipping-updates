"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useCartStore } from "@/stores/cart-store";
import { useCheckoutStore } from "@/stores/checkout-store";
import { useAddresses } from "@/lib/hooks/use-addresses";
import { AddressInput, addressSchema } from "@/lib/validations/zod-schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../ui/input-form";
import { Button } from "../ui/button";

export default function AddressStep() {
  const { user } = useUser();
  const { items } = useCartStore();
  const {
    selectedAddress,
    billingAddress,
    useSameAddressForBilling,
    setSelectedAddress,
    setBillingAddress,
    toggleSameAddressForBilling,
    goToNextStep,
  } = useCheckoutStore();

  const { addresses, isLoading, addAddress, hasAddress } = useAddresses();

  const [showAddForm, setShowAddForm] = useState(false);

  // Check if cart has physical books
  const hasPhysicalBooks = items.some((item) => item.type === "book");

  // RHF for form validation
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      landmark: "",
      pincode: "",
      isDefault: false,
    },
  });

  // Handle address selection
  const handleSelectAddress = (address: any) => {
    setSelectedAddress(address);
    if (useSameAddressForBilling) {
      setBillingAddress(address);
    }
  };

  // Handle adding new address
  const handleAddAddress = async (data: AddressInput) => {
    const result = await addAddress(data);
    if (result?.success) {
      setShowAddForm(false);
      reset();
      // Auto-select the newly added address
      if (result.data) {
        handleSelectAddress(result.data);
      }
    }
  };

  // Handle continue to next step
  const handleContinue = () => {
    if (hasPhysicalBooks && !selectedAddress) {
      alert("Please select a shipping address");
      return;
    }

    if (!useSameAddressForBilling && !billingAddress && hasPhysicalBooks) {
      alert("Please select a billing address");
      return;
    }

    goToNextStep();
  };

  const onSubmit = async (data: AddressInput) => {
    await handleAddAddress(data);
    reset();
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Shipping Address Section */}
      <div className="w-full max-w-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Shipping Address</h2>
          {hasAddress && !showAddForm && (
            <Button
              onClick={() => setShowAddForm(true)}
              variant="outline"
              size="sm"
            >
              + Add New Address
            </Button>
          )}
        </div>

        {/* Address Cards Container */}
        <div className="w-full ring-1 ring-indigo-500/80 bg-primary-dark/10 p-4 rounded-lg">
          {/* Loading State */}
          {isLoading && !hasAddress && (
            <div className="text-center py-8 text-gray-500">
              Loading addresses...
            </div>
          )}

          {/* No Addresses - Show Button */}
          {!isLoading && !hasAddress && !showAddForm && (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">No saved addresses yet</p>
              <Button onClick={() => setShowAddForm(true)}>
                + Add Your First Address
              </Button>
            </div>
          )}

          {/* Saved Addresses List */}
          {!isLoading && hasAddress && !showAddForm && (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  onClick={() => handleSelectAddress(address)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    selectedAddress?.id === address.id
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {address?.fullName}
                        </h3>
                        {address.isDefault && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        {address.phone}
                      </p>
                      <p className="text-sm text-gray-700">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-sm text-gray-700">
                        {address.landmark && `${address.landmark}, `}
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    <div>
                      {selectedAddress?.id === address?.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="w-full max-w-3xl ring-1 ring-indigo-500/80 bg-primary-dark/10 p-6 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {hasAddress ? "Add New Address" : "Add Your First Address"}
            </h3>
            {hasAddress && (
              <Button
                onClick={() => {
                  setShowAddForm(false);
                  reset();
                }}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <Input
                as="input"
                placeholder="John Doe"
                label="Full Name"
                register={register("fullName")}
                error={errors.fullName}
                name="fullname"
                type="text"
              />
              <Input
                as="input"
                placeholder="9876543210"
                label="Phone"
                register={register("phone")}
                error={errors.phone}
                name="phone"
                type="tel"
              />
            </div>

            <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
              <Input
                as="input"
                placeholder="House No., Building Name"
                label="Address Line 1"
                register={register("addressLine1")}
                error={errors.addressLine1}
                name="address-line1"
                type="text"
              />
              <Input
                as="input"
                placeholder="Street, Area, Colony"
                label="Address Line 2 (Optional)"
                register={register("addressLine2")}
                error={errors.addressLine2}
                name="address-line2"
                type="text"
              />
            </div>

            <Input
              as="input"
              placeholder="Near Bus Stop, Metro, etc."
              label="Landmark (Optional)"
              register={register("landmark")}
              error={errors.landmark}
              name="landmark"
              type="text"
            />

            <div className="grid md:grid-cols-3 grid-cols-2 gap-4">
              <Input
                as="input"
                placeholder="Mumbai"
                label="City"
                register={register("city")}
                error={errors.city}
                name="city"
                type="text"
              />
              <Input
                as="input"
                placeholder="Maharashtra"
                label="State"
                register={register("state")}
                error={errors.state}
                name="state"
                type="text"
              />
              <Input
                as="input"
                placeholder="400001"
                label="Pin Code"
                register={register("pincode")}
                error={errors.pincode}
                name="pincode"
                type="text"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                {...register("isDefault")}
                type="checkbox"
                id="isDefault"
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="isDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary-dark w-full"
            >
              {isSubmitting ? "Adding..." : "Add Address"}
            </Button>
          </form>
        </div>
      )}

      {/* Billing Address Section */}
      {selectedAddress && (
        <div className="w-full max-w-xl ring-1 ring-indigo-500/80 bg-primary-dark/10 p-4 rounded-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Billing Address
          </h2>

          {/* Same as shipping checkbox */}
          <div className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              id="sameAddress"
              checked={useSameAddressForBilling}
              onChange={toggleSameAddressForBilling}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="sameAddress" className="text-sm text-gray-700">
              Same as Shipping Address
            </label>
          </div>

          {/* Show billing address selection if different */}
          {!useSameAddressForBilling && (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address?.id}
                  onClick={() => setBillingAddress(address)}
                  className={`border rounded-lg p-4 cursor-pointer transition ${
                    billingAddress?.id === address?.id
                      ? "border-blue-600 bg-blue-50 ring-2 ring-blue-600"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {address.fullName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-1">
                        {address.phone}
                      </p>
                      <p className="text-sm text-gray-700">
                        {address.addressLine1}
                        {address.addressLine2 && `, ${address.addressLine2}`}
                      </p>
                      <p className="text-sm text-gray-700">
                        {address.landmark && `${address.landmark}, `}
                        {address.city}, {address.state} - {address.pincode}
                      </p>
                    </div>
                    <div>
                      {billingAddress?.id === address?.id && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Continue Button */}
      {selectedAddress && (
        <div className="w-full max-w-xl">
          <Button
            onClick={handleContinue}
            disabled={!selectedAddress}
            className="bg-primary-dark w-full"
          >
            Continue to Review
          </Button>
        </div>
      )}
    </div>
  );
}
