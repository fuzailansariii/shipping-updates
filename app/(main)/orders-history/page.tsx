"use client";
import Container from "@/components/container";
import DownloadModal from "@/components/download-modal";
import OrderDetails from "@/components/order-details";
import OrderCard from "@/components/order/order-card";
import { useOrderDetailsStore } from "@/stores/orders-history-store";
import React from "react";

export default function OrderHistory() {
  return (
    <Container>
      <OrderCard />
      <OrderDetails />
      <DownloadModal />
    </Container>
  );
}
