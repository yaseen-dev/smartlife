"use client";

import Link from "next/link";
import { Search, Filter, Edit2, Trash2 } from "lucide-react";
import { useForm, FormProvider } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/form-field";
import ReusableTable from "@/components/reusable-table";
import { useApi } from "@/hooks/use-api";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter, useSearchParams } from "next/navigation";

export default function DeviceListClient({ initialDevices }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { del, refetch } = useApi();

  const methods = useForm({
    defaultValues: {
      search: searchParams.get("search") || "",
      filter: searchParams.get("filter") || "",
      sort: searchParams.get("sort") || ""
    }
  });

  const handleDelete = async (id) => {
    try {
      await del(`Device/${id}`);
      router.refresh(); // Revalidate server component
    } catch (error) {
      console.error("Failed to delete device:", error);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "deviceTypeId", label: "Type" },
    { key: "label", label: "Label" },
    { 
      key: "last_activity", 
      label: "Last Activity",
      render: (val) => val || ""
    },
    { 
      key: "statusId", 
      label: "Status",
      render: (val) => {
        if (val === 1) {
          return (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_-1px_rgba(34,197,94,0.5)]" />
              <span className="text-green-600 font-medium">Active</span>
            </div>
          );
        }
        return val || "";
      }
    },
    {
      key: "actions",
      label: "Actions",
      headerClassName: "text-white font-semibold text-right text-xs uppercase tracking-wider",
      className: "text-black text-right",
      render: (_, row) => (
        <div className="flex items-center justify-end gap-2 text-xs">
          <Link href={`/profile/device/${row.id}`}>
            <button className="cursor-pointer flex items-center gap-1 w-[49px] h-[22px] rounded-[3.9px] bg-[#F4F4F4] px-1 text-[11px] text-black hover:opacity-80">
              <Edit2 className="h-3 w-3" />
              <span>Edit</span>
            </button>
          </Link>
          
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="cursor-pointer flex items-center gap-1 w-[49px] h-[22px] rounded-[3.9px]  bg-[#C36BA8] px-1 text-[11px] text-black hover:opacity-80">
                <Trash2 className="h-3 w-3" />
                <span>Delete</span>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                 Are you sure you want to delete this device?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => handleDelete(row.id)}
                  className="bg-[#C36BA8] hover:bg-[#C36BA8]/90 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ];

  const handleSearch = (values) => {
    const params = new URLSearchParams(searchParams);
    if (values.search) params.set("search", values.search);
    else params.delete("search");
    if (values.filter) params.set("filter", values.filter);
    else params.delete("filter");
    if (values.sort) params.set("sort", values.sort);
    else params.delete("sort");
    
    router.push(`/profile/device?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1A1A1A]">Devices</h1>
        <Link href="/profile/device/add">
          <Button 
            className={cn(
              "w-[98px] h-[33px] rounded-[10px] border-[0.5px] border-primary font-medium text-sm transition-all shadow-sm cursor-pointer"
            )}
          >
            Add
          </Button>
        </Link>
      </div>

      <FormProvider {...methods}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] max-w-sm relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" />
            <FormField 
              name="search" 
              placeholder="Search devices..." 
              className="h-10 border-[#BFBFBF] focus-visible:ring-primary pl-9"
              onChange={methods.handleSubmit(handleSearch)}
            />
          </div>
          
          <div className="w-[140px]">
            <FormField 
              name="filter" 
              type="select"
              placeholder="Filter"
              className="h-10 border-[#BFBFBF] pl-9"
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "offline", label: "Offline" },
              ]}
              onChange={methods.handleSubmit(handleSearch)}
            />
          </div>

          <div className="w-[140px]">
            <FormField 
              name="sort" 
              type="select"
              placeholder="Sort"
              className="h-10 border-[#BFBFBF] pl-9"
              options={[
                { value: "newest", label: "Newest" },
                { value: "oldest", label: "Oldest" },
                { value: "name-asc", label: "Name A-Z" },
                { value: "name-desc", label: "Name Z-A" },
              ]}
              onChange={methods.handleSubmit(handleSearch)}
            />
          </div>
        </div>
      </FormProvider>

      <div className="w-full rounded-[25px] border border-[#BFBFBF] p-0 overflow-hidden bg-white shadow-sm">
        <div className="p-5">
            <ReusableTable 
              columns={columns.map(col => ({
                ...col,
                headerClassName: cn("text-white font-semibold text-xs uppercase tracking-wider", col.headerClassName),
                className: cn("text-black text-sm py-4", col.className)
              }))} 
              data={initialDevices?.data || []} 
              isLoading={false} // Data is already fetched
              emptyMessage="No devices found" 
              className="border-none shadow-none rounded-none"
              headerClassName="h-[38px] bg-[#483C8E]"
              rowClassName="border-b border-dashed border-black/30"
            />
        </div>
      </div>

      <div className="flex items-center justify-end py-2">
        <Pagination className="justify-end w-auto mx-0">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                className="text-muted-foreground hover:bg-transparent hover:text-primary transition-colors disabled:opacity-50"
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext 
                href="#" 
                className="text-[#483C8E] hover:bg-transparent hover:text-[#483C8E]/80 transition-colors font-medium"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
