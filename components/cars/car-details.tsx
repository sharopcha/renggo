"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Users, Fuel, Gauge, Calendar, Shield } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface CarDetailsProps {
  car: any
  reviews: any[]
}

export function CarDetails({ car, reviews }: CarDetailsProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0)

  // Sort photos by display order, with primary photo first
  const sortedPhotos = car.car_photos.sort((a: any, b: any) => {
    if (a.is_primary) return -1
    if (b.is_primary) return 1
    return a.display_order - b.display_order
  })

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 4.8

  return (
    <div className="space-y-6">
      {/* Photo Gallery */}
      <Card>
        <CardContent className="p-0">
          <div className="relative h-96 w-full">
            <Image
              src={
                sortedPhotos[selectedPhotoIndex]?.photo_url ||
                `/placeholder.svg?height=400&width=600&query=${car.make} ${car.model}`
              }
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
          {sortedPhotos.length > 1 && (
            <div className="p-4">
              <div className="flex gap-2 overflow-x-auto">
                {sortedPhotos.map((photo: any, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedPhotoIndex(index)}
                    className={`relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden border-2 ${
                      selectedPhotoIndex === index ? "border-blue-600" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={photo.photo_url || "/placeholder.svg"}
                      alt={`${car.make} ${car.model} photo ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Car Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {car.year} {car.make} {car.model}
              </h1>
              <div className="flex items-center mt-2">
                <Star className="h-5 w-5 text-yellow-400 fill-current" />
                <span className="text-lg font-medium ml-1">{averageRating.toFixed(1)}</span>
                <span className="text-gray-600 ml-2">({reviews.length} reviews)</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">${car.daily_rate}</div>
              <div className="text-gray-600">per day</div>
            </div>
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <MapPin className="h-5 w-5 mr-2" />
            <span>{car.location_address}</span>
          </div>

          {/* Car Specs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">{car.seats} seats</span>
            </div>
            <div className="flex items-center">
              <Fuel className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm capitalize">{car.fuel_type}</span>
            </div>
            <div className="flex items-center">
              <Gauge className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm capitalize">{car.transmission}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm">{car.year}</span>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature: string) => (
                  <Badge key={feature} variant="secondary" className="capitalize">
                    {feature.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {car.description && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-700 leading-relaxed">{car.description}</p>
            </div>
          )}

          {/* House Rules */}
          {car.house_rules && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">House Rules</h3>
              <p className="text-gray-700 leading-relaxed">{car.house_rules}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Host Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center mb-4">
            <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-200 mr-4">
              <Image
                src={car.profiles.profile_image_url || `/placeholder.svg?height=48&width=48&query=profile`}
                alt={car.profiles.full_name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Hosted by {car.profiles.full_name}</h3>
              <p className="text-gray-600 text-sm">Host since {new Date(car.profiles.created_at).getFullYear()}</p>
            </div>
          </div>
          <div className="flex items-center">
            <Shield className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-sm text-gray-700">Verified host</span>
          </div>
        </CardContent>
      </Card>

      {/* Reviews */}
      {reviews.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Reviews</h3>
            <div className="space-y-4">
              {reviews.slice(0, 3).map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <div className="flex items-center mb-2">
                    <div className="relative h-8 w-8 rounded-full overflow-hidden bg-gray-200 mr-3">
                      <Image
                        src={review.profiles.profile_image_url || `/placeholder.svg?height=32&width=32&query=profile`}
                        alt={review.profiles.full_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{review.profiles.full_name}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
