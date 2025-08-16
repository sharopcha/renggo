import { Suspense } from "react"
import { ReviewsInterface } from "@/components/reviews/reviews-interface"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function ReviewsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Reviews & Ratings</h1>
        <Suspense fallback={<div>Loading reviews...</div>}>
          <ReviewsInterface userId={user.id} />
        </Suspense>
      </div>
    </div>
  )
}
