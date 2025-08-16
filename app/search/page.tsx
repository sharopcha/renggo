import { createClient } from "@/lib/supabase/server"
import { SearchFilters } from "@/components/search/search-filters"
import { CarGrid } from "@/components/search/car-grid"
import { SearchBar } from "@/components/search-bar"

interface SearchPageProps {
  searchParams: {
    location?: string
    start?: string
    end?: string
    minPrice?: string
    maxPrice?: string
    make?: string
    transmission?: string
    fuelType?: string
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const supabase = await createClient()

  // Build query based on search params
  let query = supabase
    .from("cars")
    .select(`
      *,
      car_photos(photo_url, is_primary),
      profiles(full_name)
    `)
    .eq("is_active", true)
    .eq("status", "available")

  // Apply filters
  if (searchParams.location) {
    query = query.ilike("location_address", `%${searchParams.location}%`)
  }

  if (searchParams.minPrice) {
    query = query.gte("daily_rate", Number.parseFloat(searchParams.minPrice))
  }

  if (searchParams.maxPrice) {
    query = query.lte("daily_rate", Number.parseFloat(searchParams.maxPrice))
  }

  if (searchParams.make) {
    query = query.eq("make", searchParams.make)
  }

  if (searchParams.transmission) {
    query = query.eq("transmission", searchParams.transmission)
  }

  if (searchParams.fuelType) {
    query = query.eq("fuel_type", searchParams.fuelType)
  }

  const { data: cars } = await query.order("created_at", { ascending: false })

  // Get unique makes for filter options
  const { data: makes } = await supabase.from("cars").select("make").eq("is_active", true).eq("status", "available")

  const uniqueMakes = [...new Set(makes?.map((car) => car.make) || [])]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Find Your Perfect Car</h1>
          <SearchBar />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <SearchFilters makes={uniqueMakes} searchParams={searchParams} />
          </div>
          <div className="lg:w-3/4">
            <div className="mb-4">
              <p className="text-gray-600">
                {cars?.length || 0} cars available
                {searchParams.location && ` in ${searchParams.location}`}
              </p>
            </div>
            <CarGrid cars={cars || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
