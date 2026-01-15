"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/form-field";
import { useApi } from "@/hooks/use-api";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(1, "Device name is required"),
  deviceTypeId: z.string().min(1, "Device type is required"),
  label: z.string().optional(),
  description: z.string().optional(),
  assignGateway: z.boolean().default(false),
  gateway: z.string().optional(),
});

export default function DeviceForm({ mode = "add", initialData = null }) {
  const router = useRouter();
  const { addToast } = useToast();
  const isEdit = mode === "edit";

  const { data: rawDeviceTypes, isLoading: isTypesLoading } = useApi("DeviceType");
  const { post, put } = useApi();

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: "",
      deviceTypeId: "",
      label: "",
      description: "",
      assignGateway: false, 
      gateway: "" 
    }
  });

  const { reset, watch, handleSubmit } = methods;

 
  useEffect(() => {
    if (isEdit && initialData) {
      reset({
        name: initialData.name || "",
        deviceTypeId: String(initialData.deviceTypeId || ""),
        label: initialData.label || "",
        description: initialData.description || "",
        assignGateway: !!initialData.parentDeviceId, // Example logic
        gateway: String(initialData.parentDeviceId || "")
      });
    }
  }, [isEdit, initialData, reset]);

  const deviceTypes = useMemo(() => 
    rawDeviceTypes?.data?.map(type => ({
      label: type.name,
      value: String(type.deviceTypeId)
    })) || []
  , [rawDeviceTypes]);

  const onSubmit = async (formData) => {
    const payload = {
      ...initialData,
      name: formData.name,
      deviceTypeId: Number(formData.deviceTypeId),
      label: formData.label,
      description: formData.description,
      eui: initialData?.eui || "DEV-" + Date.now(),
      statusId: initialData?.statusId || 1,
      deviceMakeId: initialData?.deviceMakeId || 1,
      deviceModelId: initialData?.deviceModelId || 1,
      ownerType: initialData?.ownerType || "string",
      ownerId: initialData?.ownerId || "string",
      assetId: initialData?.assetId || 1,
      deviceProfileId: initialData?.deviceProfileId || 1,
      parentDeviceId: initialData?.parentDeviceId || 1
    };

    try {
      let response;
      if (isEdit) {
        response = await put(`Device/${initialData.id}`, payload);
      } else {
        response = await post("Device", payload);
      }
      
      addToast(response?.message || `Device ${isEdit ? "updated" : "added"} successfully` , "success");
      router.push("/profile/device");
    } catch (err) {
      addToast(err?.message || "An error occurred", "error");
    }
  };

  const assignGateway = watch("assignGateway");

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full justify-center py-8">
        <div className={cn("w-full max-w-[775px] min-h-[710px] rounded-[24px] border border-[#BFBFBF] bg-white p-8 shadow-sm flex flex-col mx-auto md:mx-0")}>
          <h1 className="text-2xl font-bold mb-8 text-[#1A1A1A]">
            {isEdit ? "Edit Device" : "Add Device"}
          </h1>

          <div className="flex flex-col flex-1 gap-6">
            <FormField name="name" label="Device Name" required placeholder="Enter device name" />
            
            <FormField 
              name="deviceTypeId" 
              type="select" 
              label="Device Type" 
              required 
              placeholder={isTypesLoading ? "Loading..." : "Select device type"} 
              options={deviceTypes} 
            />

            <FormField name="label" label="Device Label" placeholder="Enter device label (optional)" />

            <FormField name="description" type="textarea" label="Description" placeholder="Enter device description (optional)" className="resize-none h-24" />

            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-[#1A1A1A]">Gateway Assignments</h3>
              <FormField name="assignGateway" type="checkbox" label="Assign to Gateway" />
              <FormField 
                name="gateway" 
                type="select" 
                label="" 
                disabled={!assignGateway}
                placeholder="Select gateway" 
                options={[
                  { label: "Gateway Alpha (Online)", value: "gw-01" },
                  { label: "Gateway Beta (Online)", value: "gw-02" },
                  { label: "Gateway Gamma (Offline)", value: "gw-03" },
                ]} 
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-auto pt-8">
              <Button type="button" variant="outline" className="px-8 rounded-lg" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="px-8 rounded-lg">
                {isEdit ? "Update" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
