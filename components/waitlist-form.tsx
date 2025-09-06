"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { AccessibilityAnnouncer } from "@/components/accessibility-announcer"
import { getMessage } from "@/lib/messages"

interface FormState {
  email: string
  consent: boolean
  isSubmitting: boolean
  isSuccess: boolean
  error: string
}

export function WaitlistForm() {
  const [state, setState] = useState<FormState>({
    email: "",
    consent: false,
    isSubmitting: false,
    isSuccess: false,
    error: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Reset error state
    setState((prev) => ({ ...prev, error: "" }))

    // Validation
    if (!state.email) {
      setState((prev) => ({ ...prev, error: getMessage("emailRequired") }))
      return
    }

    if (!validateEmail(state.email)) {
      setState((prev) => ({ ...prev, error: getMessage("emailInvalid") }))
      return
    }

    if (!state.consent) {
      setState((prev) => ({ ...prev, error: getMessage("consentRequired") }))
      return
    }

    setState((prev) => ({ ...prev, isSubmitting: true }))

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: state.email,
          consent: state.consent,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to subscribe")
      }

      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        isSuccess: true,
        email: "",
        consent: false,
      }))
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isSubmitting: false,
        error: getMessage("error"),
      }))
    }
  }

  if (state.isSuccess) {
    return (
      <>
        <AccessibilityAnnouncer message={getMessage("successMessage")} priority="assertive" />
        <div className="text-center space-y-4 p-6 bg-primary/5 rounded-lg border border-primary/20">
          <div className="w-12 h-12 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-lg">{getMessage("success")}</h3>
            <p className="text-muted-foreground">{getMessage("successMessage")}</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {state.error && <AccessibilityAnnouncer message={state.error} priority="assertive" />}
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Honeypot field for spam protection */}
        <input type="text" name="website" style={{ display: "none" }} tabIndex={-1} autoComplete="off" />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Label htmlFor="email" className="sr-only">
              Email address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder={getMessage("emailPlaceholder")}
              value={state.email}
              onChange={(e) => setState((prev) => ({ ...prev, email: e.target.value }))}
              disabled={state.isSubmitting}
              className="h-12"
              aria-describedby={state.error ? "email-error" : undefined}
              aria-invalid={!!state.error}
              autoComplete="email"
              required
            />
          </div>
          <Button type="submit" disabled={state.isSubmitting} className="h-12 px-8 min-w-[140px] bg-primary">
            {state.isSubmitting ? getMessage("loading") : getMessage("joinWaitlist")}
          </Button>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="consent"
            checked={state.consent}
            onCheckedChange={(checked) => setState((prev) => ({ ...prev, consent: checked === true }))}
            disabled={state.isSubmitting}
            className="mt-0.5"
            aria-describedby="consent-description"
            required
          />
          <Label
            htmlFor="consent"
            id="consent-description"
            className="text-sm text-muted-foreground leading-relaxed cursor-pointer"
          >
            {getMessage("privacyConsent")}
          </Label>
        </div>

        {state.error && (
          <div id="email-error" className="text-sm text-destructive bg-destructive/10 p-3 rounded-md" role="alert">
            {state.error}
          </div>
        )}
      </form>
    </>
  )
}
