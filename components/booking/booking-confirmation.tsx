"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User, CreditCard } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBooking } from "@/lib/booking-actions"

interface BookingConfirmationProps {
  car: any
  user: any
  profile: any
  startDate: string
  endDate: string
  total: number
}

export function BookingConfirmation({ car, user, profile, startDate, endDate, total }: BookingConfirmationProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [specialRequests, setSpecialRequests] = useState("")

  const primaryPhoto = car.car_photos.find((photo: any) => photo.is_primary) || car.car_photos[0]

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
    const start = new Date(startDate)
    const end = new Date(endDate)
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  }

  const days = calculateDays()
  const subtotal = days * car.daily_rate
  const serviceFee = subtotal * 0.1
  const finalTotal = subtotal + serviceFee

  const handleConfirmBooking = async () => {
    setLoading(true)

    try {
      const result = await createBooking({
        carId: car.id,
        hostId: car.host_id,
        startDate,
        endDate,
        totalAmount: finalTotal,
        specialRequests,
        pickupLocation: car.location_address,
        dropoffLocation: car.location_address,
      })

      if (result.success) {
        router.push(`/bookings/${result.bookingId}?success=booking-created`)
      } else {
        alert(result.error || "Failed to create booking")
      }
    } catch (error) {
      console.error("Booking error:", error)
      alert("An error occurred while creating your booking")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Confirm Your Booking</h1>
        <p className="text-gray-600 mt-2">Review your booking details before confirming</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Booking Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Car Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative h-24 w-32 flex-shrink-0">
                  <Image
                    src={
                      primaryPhoto?.photo_url || `/placeholder.svg?height=96&width=128&query=${car.make} ${car.model}`
                    }
                    alt={`${car.make} ${car.model}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{car.location_address}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-2">
                      <Image
                        src={car.profiles.profile_image_url || `/placeholder.svg?height=32&width=32&query=profile`}
                        alt={car.profiles.full_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="text-sm text-gray-600">Hosted by {car.profiles.full_name}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trip Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Trip Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Pickup</h4>
                  <p className="text-sm text-gray-600">{formatDate(startDate)}</p>
                  <p className="text-sm text-gray-600">{formatTime(startDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Return</h4>
                  <p className="text-sm text-gray-600">{formatDate(endDate)}</p>
                  <p className="text-sm text-gray-600">{formatTime(endDate)}</p>
                </div>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-gray-600">
                  <strong>Duration:</strong> {days} {days === 1 ? "day" : "days"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Renter Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Renter Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <strong>Name:</strong> {profile?.full_name || user.email}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                {profile?.phone && (
                  <p>
                    <strong>Phone:</strong> {profile.phone}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Special Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any special requests or notes for the host..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
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
                    ${car.daily_rate} × {days} {days === 1 ? "day" : "days"}
                  </span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Badge variant="secondary" className="w-full justify-center mb-4">
                  Request to Book
                </Badge>
                <p className="text-xs text-gray-600 mb-4">
                  Your booking request will be sent to the host for approval. You won't be charged until the host
                  accepts your request.
                </p>
              </div>

              <Button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {loading ? "Creating Booking..." : "Confirm Booking"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
