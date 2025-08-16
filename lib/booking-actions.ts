"use server"

import { createClient } from "./supabase/server"

interface CreateBookingData {
  carId: string
  hostId: string
  startDate: string
  endDate: string
  totalAmount: number
  specialRequests?: string
  pickupLocation: string
  dropoffLocation: string
}

export async function createBooking(data: CreateBookingData) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Check for conflicting bookings
    const { data: conflicts } = await supabase
      .from("bookings")
      .select("id")
      .eq("car_id", data.carId)
      .in("status", ["confirmed", "active"])
      .or(
        `and(start_date.lte.${data.startDate},end_date.gte.${data.startDate}),and(start_date.lte.${data.endDate},end_date.gte.${data.endDate}),and(start_date.gte.${data.startDate},end_date.lte.${data.endDate})`,
      )

    if (conflicts && conflicts.length > 0) {
      return { success: false, error: "Car is not available for the selected dates" }
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        car_id: data.carId,
        renter_id: user.id,
        host_id: data.hostId,
        start_date: data.startDate,
        end_date: data.endDate,
        total_amount: data.totalAmount,
        special_requests: data.specialRequests,
        pickup_location: data.pickupLocation,
        dropoff_location: data.dropoffLocation,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("Booking creation error:", error)
      return { success: false, error: "Failed to create booking" }
    }

    return { success: true, bookingId: booking.id }
  } catch (error) {
    console.error("Booking action error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

type UpdateBookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled" | null | undefined;

export async function updateBookingStatus(bookingId: string, status: UpdateBookingStatus, hostNotes?: string) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify user is the host or renter of this booking
    const { data: booking } = await supabase.from("bookings").select("host_id, renter_id").eq("id", bookingId).single()

    if (!booking || (booking.host_id !== user.id && booking.renter_id !== user.id)) {
      return { success: false, error: "Not authorized to update this booking" }
    }

    // Update booking
    const { error } = await supabase
      .from("bookings")
      .update({
        status,
        host_notes: hostNotes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", bookingId)

    if (error) {
      console.error("Booking update error:", error)
      return { success: false, error: "Failed to update booking" }
    }

    return { success: true }
  } catch (error) {
    console.error("Booking update action error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
