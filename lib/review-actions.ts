"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "./supabase/server"

export async function submitReview(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("You must be logged in to submit a review")
  }

  const revieweeId = formData.get("revieweeId") as string
  const bookingId = formData.get("bookingId") as string
  const rating = Number.parseInt(formData.get("rating") as string)
  const comment = formData.get("comment") as string
  const type = formData.get("type") as "renter_to_host" | "host_to_renter"

  if (!revieweeId || !bookingId || !rating || !comment || !type) {
    throw new Error("Missing required fields")
  }

  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5")
  }

  if (comment.trim().length < 10) {
    throw new Error("Review must be at least 10 characters long")
  }

  // Check if user already reviewed this booking
  const { data: existingReview } = await supabase
    .from("reviews")
    .select("id")
    .eq("booking_id", bookingId)
    .eq("reviewer_id", user.id)
    .eq("type", type)
    .single()

  if (existingReview) {
    throw new Error("You have already reviewed this booking")
  }

  // Verify the booking exists and user is authorized
  const { data: booking } = await supabase
    .from("bookings")
    .select("id, renter_id, host_id, status")
    .eq("id", bookingId)
    .single()

  if (!booking) {
    throw new Error("Booking not found")
  }

  if (booking.status !== "completed") {
    throw new Error("You can only review completed bookings")
  }

  const isRenter = booking.renter_id === user.id
  const isHost = booking.host_id === user.id

  if (!isRenter && !isHost) {
    throw new Error("You are not authorized to review this booking")
  }

  if ((type === "renter_to_host" && !isRenter) || (type === "host_to_renter" && !isHost)) {
    throw new Error("Invalid review type for your role in this booking")
  }

  const { error } = await supabase.from("reviews").insert({
    reviewer_id: user.id,
    reviewee_id: revieweeId,
    booking_id: bookingId,
    rating,
    comment: comment.trim(),
    review_type: type,
  })

  if (error) {
    console.error("Error submitting review:", error)
    throw new Error("Failed to submit review")
  }

  revalidatePath("/reviews")
  revalidatePath("/dashboard")
}

export async function getReviewStats(userId: string) {
  const supabase = await createClient()

  // Get reviews received by this user
  const { data: receivedReviews, error: receivedError } = await supabase
    .from("reviews")
    .select("rating")
    .eq("reviewee_id", userId)

  if (receivedError) {
    console.error("Error fetching received reviews:", receivedError)
    return { averageRating: 0, totalReviews: 0 }
  }

  const totalReviews = receivedReviews?.length || 0
  const averageRating =
    totalReviews > 0 ? receivedReviews.reduce((sum, review) => sum + review.rating!, 0) / totalReviews : 0

  return {
    averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
    totalReviews,
  }
}
