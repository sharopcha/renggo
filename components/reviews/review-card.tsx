import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star, Car } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

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

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.reviewer.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{review.reviewer.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{review.reviewer.full_name}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Car className="h-3 w-3" />
                {review.booking.car.year} {review.booking.car.make} {review.booking.car.model}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-4 w-4 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm leading-relaxed">{review.comment}</p>
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="secondary" className="text-xs">
            {review.type === "renter_to_host" ? "Host Review" : "Renter Review"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
