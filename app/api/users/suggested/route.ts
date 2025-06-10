import { NextResponse } from "next/server"
import { getSuggestedUsers } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const suggestedUsers = await getSuggestedUsers(user.id)
    return NextResponse.json({ users: suggestedUsers })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 })
  }
}
