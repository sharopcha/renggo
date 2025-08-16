import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { BookingDetails } from "@/components/bookings/booking-details"

interface BookingPageProps {
  params: {
    id: string
  }
  searchParams: {
    success?: string
  }
}

export default async function BookingPage({ params, searchParams }: BookingPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get booking details
  const { data: booking } = await supabase
    .from("bookings")
    .select(`
      *,
      cars(*,
        car_photos(photo_url, is_primary),
        profiles!cars_host_id_fkey(full_name, profile_image_url)
      ),
      profiles!bookings_renter_id_fkey(full_name, profile_image_url)
    `)
    .eq("id", params.id)
    .single()

  if (!booking) {
    notFound()
  }

  // Check if user is authorized to view this booking
  if (booking.renter_id !== user.id && booking.host_id !== user.id) {
    redirect("/bookings")
  }

  const isHost = booking.host_id === user.id

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {searchParams.success === "booking-created" && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
            Booking request sent successfully! The host will review your request and respond soon.
          </div>
        )}

        <BookingDetails booking={booking} isHost={isHost} />
      </div>
    </div>
  )
}
