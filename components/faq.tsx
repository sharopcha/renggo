import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { getMessage } from "@/lib/messages"

export function FAQ() {
  const faqData = getMessage("faq") as Array<{ question: string; answer: string }>

  return (
    <section className="w-full py-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-balance">{getMessage("faqTitle")}</h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqData.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline py-6">
                <span className="font-medium">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="pb-6 text-muted-foreground">{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
