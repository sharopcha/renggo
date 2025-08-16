import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Rent Cars from
          <span className="text-blue-600"> Local Hosts</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Skip the rental counter and find the perfect car for your next adventure. From daily errands to weekend
          getaways, discover unique vehicles in your neighborhood.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/search">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Find Cars Near You
            </Button>
          </Link>
          <Link href="/become-host">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
              Become a Host
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
