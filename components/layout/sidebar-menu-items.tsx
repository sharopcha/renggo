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
import { useEffect, useState } from "react";

type NavigationItem = {
  name: string;
  url: string;
  icon: LucideIcon;
};

const superadminNavigation: NavigationItem[] = [
  { name: "Dashboard", url: "/backoffice", icon: LayoutDashboard },
  { name: "Organisations", url: "/backoffice/organisations", icon: Building2 },
]

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
  if(url === "/backoffice") {
    return path === url;
  }
  
  return path === url || path.startsWith(`${url}/`);
}

export function SidebarMenuItems() {
  const pathname = usePathname();
  const { claims } = useSupabase();
  const [navigation, setNavigation] = useState<NavigationItem[]>([])

  useEffect(() => {
    if(claims?.role === 'superadmin') {
      setNavigation(superadminNavigation)
    } else {
      setNavigation(organisationNavigation)
    }
  }, [claims?.role])

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
