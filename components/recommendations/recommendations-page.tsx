"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Settings, Sparkles, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { PreferencesSetup } from "./preferences-setup"
import { useState } from "react"

interface RecommendationsPageProps {
  user: any
  profile: any
  preferences: any
  recommendations: any[]
  popularCars: any[]
}

export function RecommendationsPage({
  user,
  profile,
  preferences,
  recommendations,
  popularCars,
}: RecommendationsPageProps) {
  const [showPreferences, setShowPreferences] = useState(!preferences)

  const CarCard = ({ car, badge }: { car: any; badge?: string }) => {
    const primaryPhoto = car.car_photos.find((photo: any) => photo.is_primary) || car.car_photos[0]

    return (
      <Link href={`/cars/${car.id}`}>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer">
          <div className="relative h-48 w-full">
            <Image
              src={primaryPhoto?.photo_url || `/placeholder.svg?height=200&width=300&query=${car.make} ${car.model}`}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover rounded-t-lg"
            />
            <Badge className="absolute top-3 left-3 bg-white text-gray-900 font-semibold">${car.daily_rate}/day</Badge>
            {badge && <Badge className="absolute top-3 right-3 bg-blue-600 text-white">{badge}</Badge>}
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

            <p className="text-sm text-gray-500">Hosted by {car.profiles.full_name}</p>
          </CardContent>
        </Card>
      </Link>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="h-8 w-8 text-blue-600 mr-3" />
              Recommendations for You
            </h1>
            <p className="text-gray-600 mt-2">Discover cars tailored to your preferences and booking history</p>
          </div>
          <Button onClick={() => setShowPreferences(!showPreferences)} variant="outline" className="bg-transparent">
            <Settings className="h-4 w-4 mr-2" />
            Preferences
          </Button>
        </div>
      </div>

      {/* Preferences Setup */}
      {showPreferences && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesSetup
              userId={user.id}
              currentPreferences={preferences}
              onSave={() => setShowPreferences(false)}
            />
          </CardContent>
        </Card>
      )}

      {/* Personalized Recommendations */}
      {recommendations.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center mb-6">
            <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Perfect Matches</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.slice(0, 6).map((car) => (
              <CarCard key={car.id} car={car} badge="Recommended" />
            ))}
          </div>
        </section>
      )}

      {/* Popular Cars */}
      <section className="mb-12">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">
            {recommendations.length > 0 ? "Also Popular" : "Popular Cars"}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularCars.map((car) => (
            <CarCard key={car.id} car={car} badge="Popular" />
          ))}
        </div>
      </section>

      {/* No Recommendations Message */}
      {recommendations.length === 0 && !preferences && (
        <Card className="text-center py-12">
          <CardContent>
            <Sparkles className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Personalized Recommendations</h3>
            <p className="text-gray-600 mb-6">
              Set your preferences to receive car recommendations tailored just for you
            </p>
            <Button onClick={() => setShowPreferences(true)} className="bg-blue-600 hover:bg-blue-700">
              Set Your Preferences
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Explore More</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/search">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Advanced Search</h3>
                <p className="text-gray-600">Find cars with specific features and filters</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search?sort=price">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Budget-Friendly</h3>
                <p className="text-gray-600">Discover affordable cars in your area</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/search?sort=newest">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Latest Models</h3>
                <p className="text-gray-600">Browse the newest cars on the platform</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>
    </div>
  )
}
