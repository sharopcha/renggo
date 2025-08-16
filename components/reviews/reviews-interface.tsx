"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, MessageSquare, Calendar, Car } from "lucide-react"
import { ReviewForm } from "./review-form"
import { ReviewCard } from "./review-card"
import { supabase } from "@/lib/supabase/client"

interface Review {
  id: string
  rating: number
  comment: string
  created_at: string
  reviewer_id: string
  reviewee_id: string
  booking_id: string
  type: "renter_to_host" | "host_to_renter"
  booking: {
    id: string
    start_date: string
    end_date: string
    car: {
      make: string
      model: string
      year: number
    }
  }
  reviewer: {
    full_name: string
    avatar_url: string
  }
  reviewee: {
    full_name: string
    avatar_url: string
  }
}

interface PendingReview {
  booking_id: string
  car_id: string
  other_user_id: string
  other_user_name: string
  car_make: string
  car_model: string
  car_year: number
  booking_start: string
  booking_end: string
  review_type: "renter_to_host" | "host_to_renter"
}

export function ReviewsInterface({ userId }: { userId: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    fetchReviews()
    fetchPendingReviews()
  }, [userId])

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        booking:bookings(
          id,
          start_date,
          end_date,
          car:cars(make, model, year)
        ),
        reviewer:profiles!reviews_reviewer_id_fkey(full_name, avatar_url),
        reviewee:profiles!reviews_reviewee_id_fkey(full_name, avatar_url)
      `)
      .or(`reviewer_id.eq.${userId},reviewee_id.eq.${userId}`)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching reviews:", error)
    } else {
      setReviews(data || [])
    }
  }

  const fetchPendingReviews = async () => {
    // Get completed bookings where user hasn't left a review yet
    const { data: completedBookings, error } = await supabase
      .from("bookings")
      .select(`
        id,
        renter_id,
        host_id,
        start_date,
        end_date,
        status,
        car:cars(id, make, model, year),
        host:profiles!bookings_host_id_fkey(id, full_name),
        renter:profiles!bookings_renter_id_fkey(id, full_name)
      `)
      .eq("status", "completed")
      .or(`renter_id.eq.${userId},host_id.eq.${userId}`)

    if (error) {
      console.error("Error fetching completed bookings:", error)
      setLoading(false)
      return
    }

    // Check which bookings don't have reviews from this user
    const pending: PendingReview[] = []

    for (const booking of completedBookings || []) {
      const isRenter = booking.renter_id === userId
      const reviewType = isRenter ? "renter_to_host" : "host_to_renter"

      // Check if user already left a review for this booking
      const { data: existingReview } = await supabase
        .from("reviews")
        .select("id")
        .eq("booking_id", booking.id)
        .eq("reviewer_id", userId)
        .eq("type", reviewType)
        .single()

      if (!existingReview) {
        pending.push({
          booking_id: booking.id,
          car_id: booking.car.id,
          other_user_id: isRenter ? booking.host_id : booking.renter_id,
          other_user_name: isRenter ? booking.host.full_name : booking.renter.full_name,
          car_make: booking.car.make,
          car_model: booking.car.model,
          car_year: booking.car.year,
          booking_start: booking.start_date,
          booking_end: booking.end_date,
          review_type: reviewType,
        })
      }
    }

    setPendingReviews(pending)
    setLoading(false)
  }

  const handleReviewSubmitted = () => {
    fetchReviews()
    fetchPendingReviews()
  }

  if (loading) {
    return <div>Loading reviews...</div>
  }

  const receivedReviews = reviews.filter((r) => r.reviewee_id === userId)
  const givenReviews = reviews.filter((r) => r.reviewer_id === userId)
  const avgRating =
    receivedReviews.length > 0 ? receivedReviews.reduce((sum, r) => sum + r.rating, 0) / receivedReviews.length : 0

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {avgRating.toFixed(1)}
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= avgRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Based on {receivedReviews.length} reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviews Given</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{givenReviews.length}</div>
            <p className="text-xs text-muted-foreground">Total reviews written</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting your review</p>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Pending ({pendingReviews.length})</TabsTrigger>
          <TabsTrigger value="received">Received ({receivedReviews.length})</TabsTrigger>
          <TabsTrigger value="given">Given ({givenReviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No pending reviews. All caught up!</p>
              </CardContent>
            </Card>
          ) : (
            pendingReviews.map((pending) => (
              <Card key={pending.booking_id}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    {pending.car_year} {pending.car_make} {pending.car_model}
                  </CardTitle>
                  <CardDescription>
                    {pending.review_type === "renter_to_host"
                      ? `Rate your experience with host ${pending.other_user_name}`
                      : `Rate your experience with renter ${pending.other_user_name}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ReviewForm
                    bookingId={pending.booking_id}
                    revieweeId={pending.other_user_id}
                    reviewType={pending.review_type}
                    onSubmitted={handleReviewSubmitted}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="received" className="space-y-4">
          {receivedReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No reviews received yet.</p>
              </CardContent>
            </Card>
          ) : (
            receivedReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </TabsContent>

        <TabsContent value="given" className="space-y-4">
          {givenReviews.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No reviews given yet.</p>
              </CardContent>
            </Card>
          ) : (
            givenReviews.map((review) => <ReviewCard key={review.id} review={review} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
