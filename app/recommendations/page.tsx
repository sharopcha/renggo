import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RecommendationsPage } from "@/components/recommendations/recommendations-page"
import { getPersonalizedRecommendations } from "@/lib/ai-recommendations"

export default async function RecommendationsPageRoute() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile and preferences
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { data: preferences } = await supabase.from("user_preferences").select("*").eq("user_id", user.id).single()

  // Get personalized recommendations
  const recommendationsResult = await getPersonalizedRecommendations(user.id, 12)
  const recommendations = recommendationsResult.success ? recommendationsResult.recommendations : []

  // Get popular cars as fallback
  const { data: popularCars } = await supabase
    .from("cars")
    .select(`
      *,
      car_photos(photo_url, is_primary),
      profiles(full_name)
    `)
    .eq("is_active", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <div className="min-h-screen bg-gray-50">
      <RecommendationsPage
        user={user}
        profile={profile}
        preferences={preferences}
        recommendations={recommendations || []}
        popularCars={popularCars || []}
      />
    </div>
  )
}
