import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { MessagesInterface } from "@/components/messages/messages-interface"

interface MessagesPageProps {
  searchParams: {
    booking?: string
    host?: string
    car?: string
  }
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user's conversations (bookings with messages)
  const { data: conversations } = await supabase
    .from("bookings")
    .select(`
      id,
      start_date,
      end_date,
      status,
      renter_id,
      host_id,
      cars(make, model, year, car_photos(photo_url, is_primary)),
      profiles!bookings_renter_id_fkey(id, full_name, profile_image_url),
      profiles!bookings_host_id_fkey(id, full_name, profile_image_url),
      messages(id, content, created_at, sender_id, is_read)
    `)
    .or(`renter_id.eq.${user.id},host_id.eq.${user.id}`)
    .order("updated_at", { ascending: false })

  // Filter conversations that have messages or match search params
  const activeConversations = conversations?.filter((conv) => {
    const hasMessages = conv.messages && conv.messages.length > 0
    const matchesSearch = searchParams.booking === conv.id
    return hasMessages || matchesSearch
  })

  // If specific booking is requested, ensure it's included
  let selectedBooking = null
  if (searchParams.booking) {
    selectedBooking = conversations?.find((conv) => conv.id === searchParams.booking)
  }

  return (
    <div className="h-screen bg-gray-50">
      <MessagesInterface
        conversations={activeConversations || []}
        selectedBookingId={searchParams.booking}
        selectedBooking={selectedBooking}
        currentUserId={user.id}
      />
    </div>
  )
}
