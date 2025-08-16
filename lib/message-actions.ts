"use server"

import { cookies } from "next/headers"
import { createClient } from "./supabase/server"

export async function sendMessage(bookingId: string, content: string) {
  const cookieStore = cookies()
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Verify user is part of this booking
    const { data: booking } = await supabase.from("bookings").select("host_id, renter_id").eq("id", bookingId).single()

    if (!booking || (booking.host_id !== user.id && booking.renter_id !== user.id)) {
      return { success: false, error: "Not authorized to send messages for this booking" }
    }

    // Send message
    const { data, error } = await supabase
      .from("messages")
      .insert({
        booking_id: bookingId,
        sender_id: user.id,
        content: content.trim(),
      })
      .select()
      .single()

    if (error) {
      console.error("Message send error:", error)
      return { success: false, error: "Failed to send message" }
    }

    return { success: true, message: data }
  } catch (error) {
    console.error("Message action error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function markMessagesAsRead(bookingId: string) {
  const cookieStore = cookies()
  const supabase = await createClient()

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: "Not authenticated" }
    }

    // Mark all messages in this booking as read (except own messages)
    const { error } = await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("booking_id", bookingId)
      .neq("sender_id", user.id)

    if (error) {
      console.error("Mark as read error:", error)
      return { success: false, error: "Failed to mark messages as read" }
    }

    return { success: true }
  } catch (error) {
    console.error("Mark as read action error:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
