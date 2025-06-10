import { type NextRequest, NextResponse } from "next/server"
import { searchUsers, searchPosts } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json({ users: [], posts: [] })
    }

    const user = await getCurrentUser()
    const [users, posts] = await Promise.all([searchUsers(query), searchPosts(query, user?.id)])

    return NextResponse.json({ users, posts })
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
