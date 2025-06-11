"use server"

import { revalidatePath } from "next/cache"
import { createPost, toggleLike, toggleFollow, createComment, viewStory } from "@/lib/db"
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

export async function createCommentAction(postId: number, content: string, parentCommentId?: number) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  if (!content.trim()) {
    return { error: "Comment content is required" }
  }

  try {
    const comment = await createComment(user.id, postId, content, parentCommentId)
    revalidatePath("/")
    return { success: true, comment }
  } catch (error) {
    return { error: "Failed to create comment" }
  }
}

export async function viewStoryAction(storyId: number) {
  const user = await getCurrentUser()
  if (!user) {
    return { error: "Not authenticated" }
  }

  try {
    await viewStory(storyId, user.id)
    return { success: true }
  } catch (error) {
    return { error: "Failed to view story" }
  }
}
