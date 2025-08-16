"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, User, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingActions } from "./booking-actions"

interface BookingsListProps {
  renterBookings: any[]
  hostBookings: any[]
}

export function BookingsList({ renterBookings, hostBookings }: BookingsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "active":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const BookingCard = ({ booking, isHost = false }: { booking: any; isHost?: boolean }) => (
    <Card key={booking.id} className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {booking.cars.year} {booking.cars.make} {booking.cars.model}
            </h3>
            <div className="flex items-center text-gray-600 mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{booking.cars.location_address}</span>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Pickup</span>
            </div>
            <p className="text-sm">{formatDate(booking.start_date)}</p>
            <p className="text-sm text-gray-600">{formatTime(booking.start_date)}</p>
          </div>
          <div>
            <div className="flex items-center text-gray-600 mb-2">
              <Calendar className="h-4 w-4 mr-2" />
              <span className="text-sm font-medium">Return</span>
            </div>
            <p className="text-sm">{formatDate(booking.end_date)}</p>
            <p className="text-sm text-gray-600">{formatTime(booking.end_date)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center">
            <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-3">
              <Image
                src={booking.profiles.profile_image_url || `/placeholder.svg?height=32&width=32&query=profile`}
                alt={booking.profiles.full_name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-sm font-medium">
                {isHost ? "Renter" : "Host"}: {booking.profiles.full_name}
              </p>
              <p className="text-sm text-gray-600">${booking.total_amount}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/messages?booking=${booking.id}`}>
              <Button variant="outline" size="sm" className="bg-transparent">
                <MessageCircle className="h-4 w-4 mr-1" />
                Message
              </Button>
            </Link>
            <BookingActions booking={booking} isHost={isHost} />
          </div>
        </div>

        {booking.special_requests && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Special Requests:</p>
            <p className="text-sm text-gray-700">{booking.special_requests}</p>
          </div>
        )}

        {booking.host_notes && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Host Notes:</p>
            <p className="text-sm text-gray-700">{booking.host_notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Tabs defaultValue="renter" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="renter">My Rentals ({renterBookings.length})</TabsTrigger>
        <TabsTrigger value="host">My Hosting ({hostBookings.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="renter" className="space-y-6">
        {renterBookings.length > 0 ? (
          <div className="space-y-4">
            {renterBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isHost={false} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No rentals yet</h3>
              <p className="text-gray-600 mb-4">Start exploring cars in your area</p>
              <Link href="/search">
                <Button>Find Cars</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </TabsContent>

      <TabsContent value="host" className="space-y-6">
        {hostBookings.length > 0 ? (
          <div className="space-y-4">
            {hostBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} isHost={true} />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hosting requests yet</h3>
              <p className="text-gray-600 mb-4">List your car to start earning money</p>
              <Link href="/host/add-car">
                <Button>List Your Car</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </TabsContent>
    </Tabs>
  )
}
