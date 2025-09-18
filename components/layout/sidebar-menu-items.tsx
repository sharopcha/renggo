"use client";

import {
  BarChart3,
  Building2,
  Calendar,
  Car,
  CreditCard,
  LayoutDashboard,
  MessageSquare,
  Settings,
  Shield,
  Tag,
  Users,
  Wrench,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSupabase } from "@/lib/supabase/context";

const navigation = [
  { name: "Organisations", url: "/backoffice/organisations", icon: Building2, role: ["superadmin"] },
  { name: "Dashboard", url: "/backoffice", icon: LayoutDashboard, role: ["fleet_admin"] },
  { name: "Rentals", url: "/backoffice/rentals", icon: Calendar, role: ["fleet_admin"] },
  { name: "Vehicles", url: "/backoffice/vehicles", icon: Car, role: ["fleet_admin"] },
  { name: "Customers", url: "/backoffice/customers", icon: Users, role: ["fleet_admin"] },
  { name: "Payments & Payouts", url: "/backoffice/payments", icon: CreditCard, role: ["fleet_admin"] },
  { name: "Maintenance", url: "/backoffice/maintenance", icon: Wrench, role: ["fleet_admin"] },
  { name: "Insurance & Claims", url: "/backoffice/claims", icon: Shield, role: ["fleet_admin"] },
  { name: "Pricing & Discounts", url: "/backoffice/pricing", icon: Tag, role: ["fleet_admin"] },
  { name: "Disputes", url: "/backoffice/disputes", icon: MessageSquare, role: ["fleet_admin"] },
  { name: "Reports", url: "/backoffice/reports", icon: BarChart3, role: ["fleet_admin"] },
  { name: "Settings", url: "/backoffice/settings", icon: Settings, role: ["fleet_admin"] },
];

const isActive = (path: string, url: string) => {
  if(url === "/backoffice") {
    return path === url;
  }
  
  return path === url || path.startsWith(`${url}/`);
}

export function SidebarMenuItems() {
  const pathname = usePathname();
  const { claims } = useSupabase();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navigation.filter(i => {
          if(claims?.role === "superadmin") return true;
          return i.role?.includes(claims?.role);
        }).map((item) => {
          const active = isActive(pathname, item.url);
          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                tooltip={item.name}
                className={cn(
                  active && "bg-primary text-primary-foreground",
                  "hover:bg-gray-200 py-4.5 px-3"
                )}
              >
                <a href={item.url}>
                  <item.icon />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
