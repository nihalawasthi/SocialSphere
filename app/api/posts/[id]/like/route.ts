import { type NextRequest, NextResponse } from "next/server"
import { toggleLike } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const postId = Number.parseInt(params.id)
    const post = await toggleLike(user.id, postId)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json({ post })
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
