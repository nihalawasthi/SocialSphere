// Authentication utilities
import { cookies } from "next/headers"
import { getUserById, getUserByEmail, createUser } from "./db"

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  bio?: string
  avatar_url?: string
  is_verified: boolean
  follower_count: number
  following_count: number
  post_count: number
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const userCookie = cookieStore.get("user")

    if (!userCookie) {
      return null
    }

    const userData = JSON.parse(userCookie.value)
    return await getUserById(userData.id)
  } catch (error) {
    return null
  }
}

export async function setUserSession(user: User) {
  const cookieStore = await cookies()
  cookieStore.set("user", JSON.stringify({ id: user.id }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearUserSession() {
  const cookieStore = await cookies()
  cookieStore.delete("user")
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  // In a real app, you would hash and compare passwords
  const user = await getUserByEmail(email)

  if (user && password === "password123") {
    // Demo password
    return user
  }

  return null
}

export async function registerUser(userData: {
  username: string
  email: string
  full_name: string
  password: string
}): Promise<User | null> {
  try {
    // Check if user already exists
    const existingUser = await getUserByEmail(userData.email)
    if (existingUser) {
      throw new Error("Email already exists")
    }

    // Create new user
    const newUser = await createUser({
      username: userData.username,
      email: userData.email,
      full_name: userData.full_name,
      bio: "",
      avatar_url: "/placeholder.svg?height=100&width=100",
    })

    return newUser
  } catch (error) {
    console.error("Registration error:", error)
    return null
  }
}
