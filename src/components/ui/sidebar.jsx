"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  LineChart, 
  UserCircle, 
  ChevronDown,
  Monitor,
  Package
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: LineChart, label: "Overview", href: "/overview" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card transition-transform">
      <div className="flex h-full flex-col px-3 py-4 overflow-y-auto">
        <Link href="/" className="mb-10 flex items-center px-4">
          <span className="self-center text-2xl font-bold tracking-tight text-primary">
            SmartLife
          </span>
        </Link>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          {/* Profile Collapsible Menu */}
          <div>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                isProfileOpen ? "text-primary" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <div className="flex items-center gap-3">
                <UserCircle className="h-4 w-4" />
                <span>Profile</span>
              </div>
              <ChevronDown className={cn("h-4 w-4 transition-transform", isProfileOpen && "rotate-180")} />
            </button>

            {isProfileOpen && (
              <div className="mt-1 ml-4 space-y-1 border-l pl-4">
                <Link
                  href="/profile/device"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    pathname === "/profile/device" ? "text-primary bg-accent/50" : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <Monitor className="h-4 w-4" />
                  Device Profile
                </Link>
                <Link
                  href="/profile/asset"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    pathname === "/profile/asset" ? "text-primary bg-accent/50" : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <Package className="h-4 w-4" />
                  Asset Profile
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  );
}
