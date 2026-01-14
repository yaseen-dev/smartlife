"use client";

import { useState } from "react";
import ReusableTable from "@/components/reusable-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [showEmpty, setShowEmpty] = useState(false);

  const columns = [
    { key: "name", label: "User Name" },
    { key: "email", label: "Email Address" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <Badge variant={value === "Active" ? "success" : "secondary"}>
          {value}
        </Badge>
      )
    },
    { key: "role", label: "Role" },
    {
      key: "actions",
      label: "Actions",
      className: "text-right",
      render: (_, row) => (
        <Button variant="ghost" size="sm" onClick={() => console.log("Edit", row)}>
          Edit
        </Button>
      )
    },
  ];

  const data = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive", role: "Editor" },
    { id: 3, name: "Robert Brown", email: "robert@example.com", status: "Active", role: "User" },
    { id: 4, name: "Alice Johnson", email: "alice@example.com", status: "Active", role: "User" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard Overview</h2>
          <p className="text-muted-foreground">
            Manage your users and view system statistics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowEmpty(!showEmpty)}>
            Toggle {showEmpty ? "Data" : "Empty State"}
          </Button>
          <Button>Download Report</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Users", value: "2,350", change: "+12.1%" },
          { label: "Active Subs", value: "1,200", change: "+5.4%" },
          { label: "Revenue", value: "$45,231", change: "+18.2%" },
          { label: "Active Now", value: "573", change: "+201" },
        ].map((stat, i) => (
          <div key={stat.label} className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="mt-2 flex items-baseline justify-between">
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <span className="text-xs font-medium text-green-500">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Recent Users</h3>
        <ReusableTable
          columns={columns}
          data={showEmpty ? [] : data}
          emptyMessage="No users found in the system."
        />
      </div>
    </div>
  );
}
