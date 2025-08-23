"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createClient } from "./supabase/server"


// Sign in action
export async function signIn(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email: email.toString(),
      password: password.toString(),
    })

    if (error) {
      console.error("Sign in error:", error)
      return { error: error.message }
    }

    return { success: true }
  } catch (error) {
    console.error("Login error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign up action
export async function signUp(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  const email = formData.get("email")
  const password = formData.get("password")
  const fullName = formData.get("full_name")

  if (!email || !password || !fullName) {
    return { error: "All fields are required" }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email: email.toString(),
      password: password.toString(),
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/dashboard`,
        data: {
          full_name: fullName.toString(),
        },
      },
    })

    if (error) {
      console.error("Sign up error:", error)
      return { error: error.message }
    }

    // Profile is now automatically created by database trigger
    return { success: "Check your email to confirm your account." }
  } catch (error) {
    console.error("Sign up error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

// Sign out action
export async function signOut() {
  try {
    const supabase = await createClient()

    await supabase.auth.signOut()
    redirect("/auth/login")
  } catch (error) {
    console.error("Sign out error:", error)
    throw new Error("Failed to sign out. Please try again.")
  }
}

// Update profile action
export async function updateProfile(prevState: any, formData: FormData) {
  if (!formData) {
    return { error: "Form data is missing" }
  }

  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return { error: "Not authenticated" }
    }

    const fullName = formData.get("full_name")
    const phone = formData.get("phone")
    const dateOfBirth = formData.get("date_of_birth")

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName?.toString(),
        phone: phone?.toString(),
        date_of_birth: dateOfBirth?.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (error) {
      console.error("Profile update error:", error)
      return { error: error.message }
    }

    return { success: "Profile updated successfully!" }
  } catch (error) {
    console.error("Profile update error:", error)
    return { error: "An unexpected error occurred. Please try again." }
  }
}

export async function signInWithProvider(formData: FormData) {
  const provider = formData.get("provider") as string

  if (!provider || !["google", "facebook"].includes(provider)) {
    throw new Error("Invalid provider")
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as "google" | "facebook",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
      },
    })

    if (error) {
      console.error("OAuth error:", error)
      throw new Error("Authentication failed")
    }

    if (data.url) {
      return { redirectUrl: data.url };
    }

    return { redirectUrl: null };
  } catch (error) {
    console.error("OAuth provider error:", error)
    throw new Error("Authentication service unavailable. Please try again.")
  }
}
