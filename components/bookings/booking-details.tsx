"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, User, CreditCard, MessageCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BookingActions } from "./booking-actions"

interface BookingDetailsProps {
  booking: any
  isHost: boolean
}

export function BookingDetails({ booking, isHost }: BookingDetailsProps) {
  const primaryPhoto = booking.cars.car_photos.find((photo: any) => photo.is_primary) || booking.cars.car_photos[0]

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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const calculateDays = () => {
    const start = new Date(booking.start_date)
    const end = new Date(booking.end_date)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const days = calculateDays()
  const subtotal = days * booking.cars.daily_rate
  const serviceFee = subtotal * 0.1

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
          <p className="text-gray-600 mt-2">Booking ID: {booking.id.slice(0, 8)}</p>
        </div>
        <Badge className={getStatusColor(booking.status)} size="lg">
          {booking.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Car Information */}
          <Card>
            <CardHeader>
              <CardTitle>Vehicle Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="relative h-32 w-48 flex-shrink-0">
                  <Image
                    src={
                      primaryPhoto?.photo_url ||
                      `/placeholder.svg?height=128&width=192&query=${booking.cars.make || "/placeholder.svg"} ${booking.cars.model}`
                    }
                    alt={`${booking.cars.make} ${booking.cars.model}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {booking.cars.year} {booking.cars.make} {booking.cars.model}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{booking.cars.location_address}</span>
                  </div>
                  <p className="text-lg font-medium text-blue-600 mt-2">${booking.cars.daily_rate}/day</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Trip Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pickup</h4>
                  <p className="text-gray-700">{formatDate(booking.start_date)}</p>
                  <p className="text-gray-600">{formatTime(booking.start_date)}</p>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{booking.pickup_location}</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Return</h4>
                  <p className="text-gray-700">{formatDate(booking.end_date)}</p>
                  <p className="text-gray-600">{formatTime(booking.end_date)}</p>
                  <div className="flex items-center text-gray-600 mt-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{booking.dropoff_location}</span>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-gray-700">
                  <strong>Duration:</strong> {days} {days === 1 ? "day" : "days"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                {isHost ? "Renter" : "Host"} Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={
                      (isHost ? booking.profiles : booking.cars.profiles).profile_image_url ||
                      `/placeholder.svg?height=64&width=64&query=profile`
                    }
                    alt={(isHost ? booking.profiles : booking.cars.profiles).full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {(isHost ? booking.profiles : booking.cars.profiles).full_name}
                  </h3>
                  <p className="text-gray-600">{isHost ? "Renter" : "Host"}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/messages?booking=${booking.id}`}>
                    <Button variant="outline" size="sm" className="bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-1" />
                      Message
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          {booking.special_requests && (
            <Card>
              <CardHeader>
                <CardTitle>Special Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{booking.special_requests}</p>
              </CardContent>
            </Card>
          )}

          {/* Host Notes */}
          {booking.host_notes && (
            <Card>
              <CardHeader>
                <CardTitle>Host Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{booking.host_notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Booking Summary & Actions */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Booking Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      ${booking.cars.daily_rate} × {days} {days === 1 ? "day" : "days"}
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Service fee</span>
                    <span>${serviceFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold text-lg">
                      <span>Total</span>
                      <span>${booking.total_amount}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <BookingActions booking={booking} isHost={isHost} />
                  <Link href={`/messages?booking=${booking.id}`} className="block">
                    <Button variant="outline" className="w-full bg-transparent">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
