import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { CarDetails } from "@/components/cars/car-details"
import { BookingCard } from "@/components/cars/booking-card"

interface CarPageProps {
  params: {
    id: string
  }
}

export default async function CarPage({ params }: CarPageProps) {
  const supabase = await createClient()

  // Get car details with photos and host info
  const { data: car } = await supabase
    .from("cars")
    .select(`
      *,
      car_photos(photo_url, is_primary, display_order),
      profiles(full_name, profile_image_url, created_at)
    `)
    .eq("id", params.id)
    .eq("is_active", true)
    .single()

  if (!car) {
    notFound()
  }

  // Get reviews for this car (we'll implement this later)
  const { data: reviews } = await supabase
    .from("reviews")
    .select(`
      *,
      profiles(full_name, profile_image_url)
    `)
    .eq("reviewee_id", car.host_id)
    .eq("review_type", "renter_to_host")
    .order("created_at", { ascending: false })
    .limit(5)

  // Get current user for booking functionality
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CarDetails car={car} reviews={reviews || []} />
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <BookingCard car={car} user={user} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
