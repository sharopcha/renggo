"use client";

import * as React from "react";
import {
  Command
} from "lucide-react";

import { SidebarMenuItems } from "@/components/layout/sidebar-menu-items";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useSupabase } from "@/lib/supabase/context";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const { organization, claims } = useSupabase();

  return (
    <Sidebar variant="inset" {...props} collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link
                href="/backoffice"
                className="group-data-[collapsible=icon]:p-0!"
              >
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{organization?.name?.toUpperCase() || 'RENGGO'}</span>
                  <span className="truncate text-xs">{ claims?.role || 'USER' }</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenuItems />
      </SidebarContent>
      <SidebarFooter>
        {/* Renggo logo should be here */}
      </SidebarFooter>
    </Sidebar>
  );
}
