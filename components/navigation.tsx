"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Car, Menu, User, MessageCircle, Calendar } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

interface NavigationProps {
  user?: any
}

export function Navigation({ user }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    // router.replace('/')
  }

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
            <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
              Find Cars
            </Link>
            <Link href="/become-host" className="text-gray-700 hover:text-blue-600 font-medium">
              Become a Host
            </Link>

            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/messages" className="text-gray-700 hover:text-blue-600">
                  <MessageCircle className="h-5 w-5" />
                </Link>
                <Link href="/bookings" className="text-gray-700 hover:text-blue-600">
                  <Calendar className="h-5 w-5" />
                </Link>
                <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                  <User className="h-5 w-5" />
                </Link>
                <Button onClick={handleSignOut} variant="outline" size="sm">
                  Sign Out
                </Button>
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
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 font-medium">
                Find Cars
              </Link>
              <Link href="/become-host" className="text-gray-700 hover:text-blue-600 font-medium">
                Become a Host
              </Link>

              {user ? (
                <>
                  <Link href="/messages" className="text-gray-700 hover:text-blue-600 font-medium">
                    Messages
                  </Link>
                  <Link href="/bookings" className="text-gray-700 hover:text-blue-600 font-medium">
                    My Bookings
                  </Link>
                  <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                    Dashboard
                  </Link>
                  <Button onClick={handleSignOut} variant="outline" size="sm" className="w-fit bg-transparent">
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
  )
}
