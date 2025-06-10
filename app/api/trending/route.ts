import { NextResponse } from "next/server"
import { getTrendingHashtags } from "@/lib/db"

export async function GET() {
  try {
    const hashtags = await getTrendingHashtags()
    return NextResponse.json({ hashtags })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trending" }, { status: 500 })
  }
}
