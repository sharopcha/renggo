"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Car, Calendar, MessageCircle, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { ProfileSetup } from "./profile-setup"

interface DashboardContentProps {
  user: any
  profile: any
  userCars: any[]
  userBookings: any[]
}

export function DashboardContent({ user, profile, userCars, userBookings }: DashboardContentProps) {
  const isProfileComplete = profile?.full_name && profile?.phone && profile?.date_of_birth

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {profile?.full_name || user.email}!</h1>
        <p className="text-gray-600 mt-2">Manage your bookings, cars, and account settings</p>
      </div>

      {!isProfileComplete && (
        <div className="mb-8">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-900">Complete Your Profile</CardTitle>
              <CardDescription className="text-blue-700">
                Add your personal information to start booking cars or become a host
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileSetup profile={profile} />
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userBookings.filter((b) => b.status === "confirmed" || b.status === "active").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Cars</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCars.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest car rentals</CardDescription>
          </CardHeader>
          <CardContent>
            {userBookings.length > 0 ? (
              <div className="space-y-4">
                {userBookings.slice(0, 3).map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {booking.cars.year} {booking.cars.make} {booking.cars.model}
                      </p>
                      <p className="text-sm text-gray-600">Host: {booking.profiles.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(booking.start_date).toLocaleDateString()} -{" "}
                        {new Date(booking.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>{booking.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No bookings yet</p>
                <Link href="/search">
                  <Button>Find Your First Car</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* My Cars */}
        <Card>
          <CardHeader>
            <CardTitle>My Cars</CardTitle>
            <CardDescription>Cars you're hosting</CardDescription>
          </CardHeader>
          <CardContent>
            {userCars.length > 0 ? (
              <div className="space-y-4">
                {userCars.slice(0, 3).map((car) => (
                  <div key={car.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {car.year} {car.make} {car.model}
                      </p>
                      <p className="text-sm text-gray-600">${car.daily_rate}/day</p>
                    </div>
                    <Badge variant={car.status === "available" ? "default" : "secondary"}>{car.status}</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No cars listed yet</p>
                <Link href="/host/add-car">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Car
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/search">
            <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
              <Car className="h-6 w-6 mb-2" />
              Find Cars
            </Button>
          </Link>
          <Link href="/host/add-car">
            <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
              <Plus className="h-6 w-6 mb-2" />
              Add Car
            </Button>
          </Link>
          <Link href="/messages">
            <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
              <MessageCircle className="h-6 w-6 mb-2" />
              Messages
            </Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="outline" className="w-full h-20 flex flex-col bg-transparent">
              <Settings className="h-6 w-6 mb-2" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
