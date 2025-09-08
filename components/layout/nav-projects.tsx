"use client";

import {
  BarChart3,
  Calendar,
  Car,
  CreditCard,
  Folder,
  LayoutDashboard,
  MessageSquare,
  MoreHorizontal,
  Settings,
  Share,
  Shield,
  Tag,
  Trash2,
  Users,
  Wrench,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup, SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar";

const navigation = [
  { name: "Dashboard", url: "/", icon: LayoutDashboard },
  { name: "Rentals", url: "/rentals", icon: Calendar },
  { name: "Vehicles", url: "/vehicles", icon: Car },
  { name: "Customers", url: "/customers", icon: Users },
  { name: "Payments & Payouts", url: "/payments", icon: CreditCard },
  { name: "Maintenance", url: "/maintenance", icon: Wrench },
  { name: "Insurance & Claims", url: "/claims", icon: Shield },
  { name: "Pricing & Discounts", url: "/pricing", icon: Tag },
  { name: "Disputes", url: "/disputes", icon: MessageSquare },
  { name: "Reports", url: "/reports", icon: BarChart3 },
  { name: "Settings", url: "/settings", icon: Settings },
]

export function NavProjects() {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navigation.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild tooltip={item.name}>
              <a href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton tooltip="More">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
