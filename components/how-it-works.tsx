import { Search, Calendar, Key, Star } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Find the Perfect Car",
      description: "Browse thousands of unique cars in your city, from daily drivers to luxury vehicles.",
    },
    {
      icon: Calendar,
      title: "Book Instantly",
      description: "Choose your dates and book instantly, or send a request to the host for custom arrangements.",
    },
    {
      icon: Key,
      title: "Unlock & Drive",
      description: "Meet your host or use our contactless pickup to get the keys and hit the road.",
    },
    {
      icon: Star,
      title: "Leave a Review",
      description: "Rate your experience and help build trust in our community of drivers and hosts.",
    },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How CarShare Works</h2>
          <p className="text-lg text-gray-600">Renting a car has never been easier</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
