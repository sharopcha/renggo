"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar, Clock } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface BookingCardProps {
  car: any
  user: any
}

export function BookingCard({ car, user }: BookingCardProps) {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [startTime, setStartTime] = useState("10:00")
  const [endTime, setEndTime] = useState("10:00")

  const calculateTotal = () => {
    if (!startDate || !endDate) return 0

    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))

    return days > 0 ? days * car.daily_rate : 0
  }

  const total = calculateTotal()
  const serviceFee = total * 0.1 // 10% service fee
  const finalTotal = total + serviceFee

  const handleBooking = () => {
    if (!user) {
      // Redirect to login with return URL
      window.location.href = `/auth/login?redirect=/cars/${car.id}`
      return
    }

    // Create booking (we'll implement this in the booking workflow task)
    const bookingData = {
      carId: car.id,
      startDate: `${startDate}T${startTime}`,
      endDate: `${endDate}T${endTime}`,
      total: finalTotal,
    }

    // For now, redirect to a booking confirmation page
    const params = new URLSearchParams({
      car: car.id,
      start: `${startDate}T${startTime}`,
      end: `${endDate}T${endTime}`,
      total: finalTotal.toString(),
    })

    window.location.href = `/booking/confirm?${params.toString()}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>${car.daily_rate}/day</span>
          <div className="flex items-center text-sm text-gray-600">
            <span className="text-yellow-400 mr-1">★</span>
            4.8 (12 reviews)
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-10"
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-10"
                min={startDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>

        {/* Time Selection */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="pl-10" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="pl-10" />
            </div>
          </div>
        </div>

        {/* Price Breakdown */}
        {total > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>
                ${car.daily_rate} ×{" "}
                {Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Booking Button */}
        <Button
          onClick={handleBooking}
          disabled={!startDate || !endDate || total <= 0}
          className="w-full bg-blue-600 hover:bg-blue-700"
          size="lg"
        >
          {!user ? "Sign in to Book" : "Request to Book"}
        </Button>

        {/* Contact Host */}
        {user && (
          <Link href={`/messages?host=${car.host_id}&car=${car.id}`}>
            <Button variant="outline" className="w-full bg-transparent">
              Contact Host
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
