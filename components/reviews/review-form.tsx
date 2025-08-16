"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase/client"

interface ReviewFormProps {
  bookingId: string
  revieweeId: string
  reviewType: "renter_to_host" | "host_to_renter"
  onSubmitted: () => void
}

export function ReviewForm({ bookingId, revieweeId, reviewType, onSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (rating === 0) {
      toast.error("Please select a rating")
      return
    }

    if (comment.trim().length < 10) {
      toast.error("Please write at least 10 characters in your review")
      return
    }

    setSubmitting(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast.error("You must be logged in to submit a review")
        return
      }

      const { error } = await supabase.from("reviews").insert({
        reviewer_id: user.id,
        reviewee_id: revieweeId,
        booking_id: bookingId,
        rating,
        comment: comment.trim(),
        type: reviewType,
      })

      if (error) {
        console.error("Error submitting review:", error)
        toast.error("Failed to submit review")
      } else {
        toast.success("Review submitted successfully!")
        setRating(0)
        setComment("")
        onSubmitted()
      }
    } catch (error) {
      console.error("Error submitting review:", error)
      toast.error("Failed to submit review")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Rating Stars */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-1"
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoveredRating || rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300 hover:text-yellow-200"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="space-y-2">
        <label htmlFor="comment" className="text-sm font-medium">
          Review
        </label>
        <Textarea
          id="comment"
          placeholder={
            reviewType === "renter_to_host"
              ? "How was your experience with this host and their car?"
              : "How was your experience with this renter?"
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
        />
        <p className="text-xs text-muted-foreground">Minimum 10 characters ({comment.length}/10)</p>
      </div>

      <Button type="submit" disabled={submitting || rating === 0 || comment.trim().length < 10}>
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  )
}
