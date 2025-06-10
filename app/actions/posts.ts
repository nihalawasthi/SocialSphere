"use server"

import { revalidatePath } from "next/cache"
import { createPost, toggleLike, toggleFollow } from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"

export async function createPostAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  const content = formData.get("content") as string
  const imageUrl = formData.get("imageUrl") as string

  if (!content.trim()) {
    return { error: "Content is required" }
  }

  try {
    const post = await createPost(user.id, content, imageUrl || undefined)
    revalidatePath("/")
    return { success: true, post }
  } catch (error) {
    return { error: "Failed to create post" }
  }
}

export async function toggleLikeAction(postId: number) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    const post = await toggleLike(user.id, postId)
    revalidatePath("/")
    return { success: true, post }
  } catch (error) {
    return { error: "Failed to toggle like" }
  }
}

export async function toggleFollowAction(userId: number) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return { error: "Not authenticated" }
  }

  try {
    const result = await toggleFollow(currentUser.id, userId)
    revalidatePath("/")
    return { success: true, ...result }
  } catch (error) {
    return { error: "Failed to toggle follow" }
  }
}
