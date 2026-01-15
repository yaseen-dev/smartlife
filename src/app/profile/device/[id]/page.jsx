"use client";

import { use } from "react";
import DeviceForm from "../components/DeviceForm";
import { useApi } from "@/hooks/use-api";

export default function EditDevicePage({ params }) {
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;
  const { data: deviceData, isLoading } = useApi(`Device/${id}`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <DeviceForm mode="edit" initialData={deviceData?.data} />;
}
