import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookingsList } from "@/components/bookings/bookings-list"

export default async function BookingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's bookings as a renter
  const { data: renterBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      cars(make, model, year, daily_rate, location_address),
      profiles!bookings_host_id_fkey(full_name, profile_image_url)
    `)
    .eq("renter_id", user.id)
    .order("created_at", { ascending: false })

  // Get user's bookings as a host
  const { data: hostBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      cars(make, model, year, daily_rate, location_address),
      profiles!bookings_renter_id_fkey(full_name, profile_image_url)
    `)
    .eq("host_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your car rentals and hosting requests</p>
        </div>

        <BookingsList renterBookings={renterBookings || []} hostBookings={hostBookings || []} />
      </div>
    </div>
  )
}
