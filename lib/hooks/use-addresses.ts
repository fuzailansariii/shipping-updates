import { useUser } from "@clerk/nextjs";
import { AddressInput } from "../validations/zod-schema";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import axios from "axios";

interface Address {
  id: string;
  clerkUserId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string | null;
  city: string;
  state: string;
  pincode: string;
  landmark: string | null;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export function useAddresses() {
  const { user, isLoaded } = useUser();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAddress = async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get("/api/addresses");
      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to fetch addresses");
      }

      setAddresses(response.data.data || []);

      const data = await response.data.data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch addresses";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addAddress = async (addressData: AddressInput) => {
    if (!user) return;

    try {
      setIsLoading(true);
      setError(null);
      const response = await axios.post("/api/addresses", addressData);
      if (response.status !== 201) {
        throw new Error(response.data.message || "Failed to add address");
      }

      // add new address
      setAddresses((prev) => [...prev, response.data.data]);

      toast.success("Address added successfully");

      return { success: true, data: response.data.data };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add address";
      setError(errorMessage);
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  // TODO
  const updateAddress = async () => {};
  // TODO
  const deleteAddress = async () => {};

  useEffect(() => {
    if (isLoaded && user) {
      fetchAddress();
    }
  }, [isLoaded, user]);

  return {
    addresses,
    fetchAddress,
    addAddress,
    error,
    isLoading,
    hasAddress: addresses.length > 0,
  };
}
