export const messages: any = {
  en: {
    // Header
    brandName: "Renggo",
    contact: "Contact",

    // Hero
    headline: "is coming soon.",
    subheadline: "Back office, simplified.",
    joinWaitlist: "Join the waitlist",
    emailPlaceholder: "Enter your email",

    // Privacy
    privacyConsent: "I agree to receive updates and accept the Privacy Policy.",
    privacyLink: "Privacy Policy",
    termsLink: "Terms of Service",

    // Value propositions
    valueProps: ["Clear fleet analytics", "Simple payouts & pricing", "Smooth maintenance & claims"],

    // FAQ
    faqTitle: "Frequently Asked Questions",
    faq: [
      {
        question: "What is Renggo?",
        answer:
          "Renggo is a comprehensive back office solution designed to simplify fleet management, analytics, and operations.",
      },
      {
        question: "When will Renggo launch?",
        answer:
          "We're working hard to bring Renggo to market. Join our waitlist to be the first to know when we launch.",
      },
      {
        question: "How will I be notified?",
        answer:
          "We'll send you an email notification as soon as Renggo is available, along with early access opportunities.",
      },
      {
        question: "Is Renggo a paid service?",
        answer:
          "Pricing details will be announced closer to launch. Waitlist members will receive exclusive early-bird pricing information.",
      },
    ],

    // Form states
    loading: "Joining...",
    success: "You're on the list!",
    successMessage: "Thanks for joining! We'll notify you when Renggo is ready.",
    error: "Something went wrong. Please try again.",
    emailRequired: "Email is required",
    emailInvalid: "Please enter a valid email address",
    consentRequired: "You must agree to receive updates",

    // Footer
    copyright: `© Renggo ${new Date().getFullYear()}.`,
    prelaunchBadge: "Pre-launch",
  },
}

export type MessageKey = keyof typeof messages.en
export const getMessage = (key: string, locale = "en") => {
  return messages.en[key]
}
