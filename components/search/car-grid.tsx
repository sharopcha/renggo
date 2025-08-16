import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Fuel } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Car {
  id: string
  make: string
  model: string
  year: number
  daily_rate: number
  location_address: string
  seats: number
  fuel_type: string
  transmission: string
  car_photos: { photo_url: string; is_primary: boolean }[]
  profiles: { full_name: string }
}

interface CarGridProps {
  cars: Car[]
}

export function CarGrid({ cars }: CarGridProps) {
  if (cars.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No cars found</h3>
        <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {cars.map((car) => {
        const primaryPhoto = car.car_photos.find((photo) => photo.is_primary) || car.car_photos[0]

        return (
          <Link key={car.id} href={`/cars/${car.id}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 w-full">
                <Image
                  src={
                    primaryPhoto?.photo_url || `/placeholder.svg?height=200&width=300&query=${car.make} ${car.model}`
                  }
                  alt={`${car.make} ${car.model}`}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <Badge className="absolute top-3 left-3 bg-white text-gray-900 font-semibold">
                  ${car.daily_rate}/day
                </Badge>
              </div>

              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-lg">
                    {car.year} {car.make} {car.model}
                  </h3>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">4.8</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm truncate">{car.location_address}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>{car.seats} seats</span>
                  </div>
                  <div className="flex items-center">
                    <Fuel className="h-4 w-4 mr-1" />
                    <span className="capitalize">{car.fuel_type}</span>
                  </div>
                  <span className="capitalize">{car.transmission}</span>
                </div>

                <p className="text-sm text-gray-500">Hosted by {car.profiles.full_name}</p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
