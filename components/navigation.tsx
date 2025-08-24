"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Car,
  Menu,
  User,
  MessageCircle,
  Calendar,
  ChevronsUpDown,
  Sparkles,
  BadgeCheck,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { SidebarMenuButton } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { user, userProfile } = useAuth();
  const isMobile = useIsMobile();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">RengGo</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/search" className="text-gray-700  font-medium">
              Find Cars
            </Link>
            <Link href="/become-host" className="text-gray-700  font-medium">
              Become a Host
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <div className="flex gap-2 items-center">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={userProfile?.profile_image_url!}
                          alt={userProfile?.full_name!}
                        />
                        <AvatarFallback className="rounded-lg">
                          CN
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm">
                        <span className="truncate font-medium">
                          {userProfile?.full_name}
                        </span>
                        <span className="truncate text-xs">
                          {userProfile?.email}
                        </span>
                      </div>
                      <ChevronsUpDown className="ml-auto size-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    side="bottom"
                    align="end"
                    sideOffset={4}
                  >
                    <DropdownMenuLabel className="p-0 font-normal">
                      <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate font-medium">
                            {userProfile?.full_name}
                          </span>
                          <span className="truncate text-xs">
                            {userProfile?.email}
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem onClick={() => router.push("/account")}>
                        <BadgeCheck />
                        Account
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/billing")}>
                        <CreditCard />
                        Billing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/notifications")}>
                        <Bell />
                        Notifications
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/bookings")}>
                        <Calendar />
                        Bookings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => router.push("/messages")}>
                        <MessageCircle />
                        Messages
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/search" className="text-gray-700  font-medium">
                Find Cars
              </Link>
              <Link href="/become-host" className="text-gray-700  font-medium">
                Become a Host
              </Link>

              {user ? (
                <>
                  <Link href="/messages" className="text-gray-700  font-medium">
                    Messages
                  </Link>
                  <Link href="/bookings" className="text-gray-700  font-medium">
                    My Bookings
                  </Link>
                  <Link
                    href="/dashboard"
                    className="text-gray-700  font-medium"
                  >
                    Dashboard
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    variant="outline"
                    size="sm"
                    className="w-fit bg-transparent"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex space-x-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/sign-up">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
