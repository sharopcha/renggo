import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's cars if they're a host
  const { data: userCars } = await supabase
    .from("cars")
    .select(`
      *,
      car_photos(photo_url, is_primary)
    `)
    .eq("host_id", user.id)

  // Get user's bookings
  const { data: userBookings } = await supabase
    .from("bookings")
    .select(`
      *,
      cars(make, model, year),
      profiles!bookings_host_id_fkey(full_name)
    `)
    .eq("renter_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardContent user={user} profile={profile} userCars={userCars || []} userBookings={userBookings || []} />
    </div>
  )
}
