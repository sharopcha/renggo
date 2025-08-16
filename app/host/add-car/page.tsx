import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AddCarForm } from "@/components/host/add-car-form"

export default async function AddCarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/host/add-car")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">List Your Car</h1>
          <p className="text-gray-600 mt-2">Share your car and earn money when you're not using it</p>
        </div>

        <AddCarForm />
      </div>
    </div>
  )
}
