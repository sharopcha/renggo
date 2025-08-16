import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface Car {
  id: string
  make: string
  model: string
  year: number
  daily_rate: number
  location_address: string
  car_photos: { photo_url: string; is_primary: boolean }[]
  profiles: { full_name: string }
}

interface FeaturedCarsProps {
  cars: Car[]
}

export function FeaturedCars({ cars }: FeaturedCarsProps) {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Cars</h2>
          <p className="text-lg text-gray-600">Discover amazing vehicles from trusted hosts in your area</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cars.map((car) => {
            const primaryPhoto = car.car_photos.find((photo) => photo.is_primary) || car.car_photos[0]

            return (
              <Link key={car.id} href={`/cars/${car.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative h-48 w-full">
                    <Image
                      src={
                        primaryPhoto?.photo_url ||
                        `/placeholder.svg?height=200&width=300&query=${car.make} ${car.model}`
                      }
                      alt={`${car.make} ${car.model}`}
                      fill
                      className="object-cover rounded-t-lg"
                    />
                    <Badge className="absolute top-3 left-3 bg-white text-gray-900">${car.daily_rate}/day</Badge>
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
                      <span className="text-sm">{car.location_address}</span>
                    </div>

                    <p className="text-sm text-gray-500">Hosted by {car.profiles.full_name}</p>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="text-center mt-12">
          <Link href="/search">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium">
              View All Cars
            </button>
          </Link>
        </div>
      </div>
    </section>
  )
}
