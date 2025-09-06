import { getMessage } from "@/lib/messages"

export function ValueProps() {
  const valueProps = getMessage("valueProps") as string[]

  return (
    <section className="w-full py-16 bg-muted/30" aria-labelledby="features-heading">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 id="features-heading" className="sr-only">
          Key Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {valueProps.map((prop, index) => (
            <div key={index} className="text-center space-y-2">
              <div
                className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-4"
                role="img"
                aria-label="Feature icon"
              >
                <div className="w-6 h-6 bg-primary rounded-full" />
              </div>
              <h3 className="text-lg font-medium text-balance">{prop}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
