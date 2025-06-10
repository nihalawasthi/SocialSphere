"use server"

import { redirect } from "next/navigation"
import { authenticateUser, registerUser, setUserSession, clearUserSession } from "@/lib/auth"

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const user = await authenticateUser(email, password)

  if (!user) {
    return { error: "Invalid credentials" }
  }

  await setUserSession(user)
  redirect("/")
}

export async function signupAction(formData: FormData) {
  const username = formData.get("username") as string
  const email = formData.get("email") as string
  const full_name = formData.get("full_name") as string
  const password = formData.get("password") as string

  if (!username || !email || !full_name || !password) {
    return { error: "All fields are required" }
  }

  const user = await registerUser({ username, email, full_name, password })

  if (!user) {
    return { error: "Failed to create account" }
  }

  await setUserSession(user)
  redirect("/")
}

export async function logoutAction() {
  await clearUserSession()
  redirect("/auth/login")
}
