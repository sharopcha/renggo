import { type NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/rate-limit"
import { storeToFile } from "@/lib/file-storage"
import { sendToEmailService } from "@/lib/email-services"

interface SubscribeRequest {
  email: string
  consent: boolean
  website?: string // honeypot field
}

interface WaitlistEntry {
  timestamp: string
  email: string
  consent: boolean
  locale: string
  userAgent: string
  ip: string
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

    // Apply rate limiting
    const rateLimitResult = rateLimit(
      ip,
      Number.parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "1"),
      Number.parseInt(process.env.RATE_LIMIT_WINDOW_MS || "10000"),
    )

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          },
        },
      )
    }

    const body: SubscribeRequest = await request.json()

    // Honeypot spam protection
    if (body.website) {
      // Silent fail for spam bots
      return NextResponse.json({ success: true })
    }

    // Validate required fields
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    if (!body.consent) {
      return NextResponse.json({ error: "Consent is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Prepare waitlist entry
    const entry: WaitlistEntry = {
      timestamp: new Date().toISOString(),
      email: body.email.toLowerCase().trim(),
      consent: body.consent,
      locale: request.headers.get("accept-language")?.split(",")[0] || "en",
      userAgent: request.headers.get("user-agent") || "unknown",
      ip: ip,
    }

    // Store to file (default storage method)
    try {
      await storeToFile(entry)
    } catch (error) {
      console.error("Failed to store to file:", error)
      return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
    }

    // Optionally send to email service
    try {
      await sendToEmailService(entry)
    } catch (error) {
      // Log but don't fail the request if email service fails
      console.warn("Email service failed:", error)
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to waitlist",
    })
  } catch (error) {
    console.error("Subscribe API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 })
}
