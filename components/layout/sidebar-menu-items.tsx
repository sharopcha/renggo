"use client";

import {
  BarChart3,
  Building2,
  Calendar,
  Car,
  CreditCard,
  LayoutDashboard,
  LucideIcon,
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
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type NavigationItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

const superadminNavigation: NavigationItem[] = [
  { name: "Dashboard", url: "/backoffice", icon: LayoutDashboard },
  { name: "Organisations", url: "/backoffice/organisations", icon: Building2 },
];

const organisationNavigation: NavigationItem[] = [
  { name: "Dashboard", url: "/backoffice", icon: LayoutDashboard },
  { name: "Rentals", url: "/backoffice/rentals", icon: Calendar },
  { name: "Vehicles", url: "/backoffice/vehicles", icon: Car },
  { name: "Customers", url: "/backoffice/customers", icon: Users },
  { name: "Payments & Payouts", url: "/backoffice/payments", icon: CreditCard },
  { name: "Maintenance", url: "/backoffice/maintenance", icon: Wrench },
  { name: "Insurance & Claims", url: "/backoffice/claims", icon: Shield },
  { name: "Pricing & Discounts", url: "/backoffice/pricing", icon: Tag },
  { name: "Disputes", url: "/backoffice/disputes", icon: MessageSquare },
  { name: "Reports", url: "/backoffice/reports", icon: BarChart3 },
  { name: "Settings", url: "/backoffice/settings", icon: Settings },
];

const isActive = (path: string, url: string) => {
  if (url === "/backoffice") {
    return path === url;
  }

  return path === url || path.startsWith(`${url}/`);
};

export function SidebarMenuItems() {
  const pathname = usePathname();
  const { claims } = useSupabase();

  // Use useMemo to compute navigation based on claims
  const navigation = useMemo(() => {
    // Don't render anything if claims are not loaded yet
    if (!claims) {
      return [];
    }

    if (claims.role === "superadmin") {
      return superadminNavigation;
    } else {
      return organisationNavigation;
    }
  }, [claims]);

  // Don't render menu items until we have claims
  if (!claims) {
    return (
      <SidebarGroup>
        <SidebarMenu>
          {/* You could add a loading skeleton here if desired */}
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navigation.map((item) => {
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
                <Link
                  href={item.url}
                  className="flex items-center gap-2 w-full"
                >
                  <item.icon />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
