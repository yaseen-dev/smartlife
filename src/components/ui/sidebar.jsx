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
  // { icon: LineChart, label: "Overview", href: "/overview" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r transition-transform bg-[#483C8E]">
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
                  "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-white",
                 
                )}
              >
            
                {item.label}
              </Link>
            );
          })}

          {/* Profile Collapsible Menu */}
          <div>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className={cn(
                "flex w-full items-center justify-between gap-3 rounded-lg px-4 py-2 text-sm font-medium text-white cursor-pointer transition-colors",
               
              )}
            >
              <div className="flex items-center gap-3">
                
                <span>Profile</span>
              </div>
              
            </button>

            {isProfileOpen && (
              <div className="mt-1 ml-2 space-y-1 pl-4">
                <Link
                  href="/profile/device"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
                    
                  )}
                >

                  Device Profile
                </Link>
                <Link
                  href="/profile/asset"
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors",
                    
                  )}
                >
                  
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
