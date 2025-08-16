import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { BookingConfirmation } from "@/components/booking/booking-confirmation"

interface BookingConfirmPageProps {
  searchParams: {
    car?: string
    start?: string
    end?: string
    total?: string
  }
}

export default async function BookingConfirmPage({ searchParams }: BookingConfirmPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  if (!searchParams.car || !searchParams.start || !searchParams.end) {
    redirect("/search")
  }

  // Get car details
  const { data: car } = await supabase
    .from("cars")
    .select(`
      *,
      car_photos(photo_url, is_primary),
      profiles(full_name, profile_image_url)
    `)
    .eq("id", searchParams.car)
    .single()

  if (!car) {
    redirect("/search")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <BookingConfirmation
          car={car}
          user={user}
          profile={profile}
          startDate={searchParams.start}
          endDate={searchParams.end}
          total={Number.parseFloat(searchParams.total || "0")}
        />
      </div>
    </div>
  )
}
