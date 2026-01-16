import DeviceListClient from "./components/DeviceListClient";
import { serverFetch } from "@/lib/api";

export default async function DevicesPage(props) {
  const searchParams = await props.searchParams;
  const search = searchParams?.search || "";
  const filter = searchParams?.filter || "";
  const sort = searchParams?.sort || "";

  // Construct query string for backend API if needed
  const query = new URLSearchParams();
  if (search) query.append("search", search);
  if (filter) query.append("filter", filter);
  if (sort) query.append("sort", sort);

  const endpoint = `Device${query.toString() ? `?${query.toString()}` : ""}`;
  
  let initialDevices = { data: [] };
  try {
    initialDevices = await serverFetch(endpoint);
  } catch (error) {
    console.error("Failed to fetch devices on server:", error);
  }

  return <DeviceListClient initialDevices={initialDevices} />;
}
