import { neon } from "@neondatabase/serverless"

// Get database URL from environment variables with fallback
const getDatabaseUrl = () => {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.NEON_DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING

  if (!url) {
    throw new Error("No database connection string found. Please set DATABASE_URL environment variable.")
  }

  return url
}

const sql = neon(getDatabaseUrl())

export interface User {
  id: number
  username: string
  email: string
  full_name: string
  bio?: string
  avatar_url?: string
  cover_url?: string
  is_verified: boolean
  is_private: boolean
  follower_count: number
  following_count: number
  post_count: number
  created_at: Date
  updated_at: Date
}

export interface Post {
  id: number
  user_id: number
  content: string
  image_url?: string
  video_url?: string
  like_count: number
  comment_count: number
  share_count: number
  is_pinned: boolean
  created_at: Date
  updated_at: Date
  user?: User
  liked?: boolean
  comments?: Comment[]
}

export interface Comment {
  id: number
  post_id: number
  user_id: number
  parent_comment_id?: number
  content: string
  like_count: number
  created_at: Date
  updated_at: Date
  user?: User
  replies?: Comment[]
}

export interface Story {
  id: number
  user_id: number
  content?: string
  image_url?: string
  video_url?: string
  view_count: number
  expires_at: Date
  created_at: Date
  user?: User
  viewed?: boolean
}

export interface Notification {
  id: number
  user_id: number
  type: string
  message: string
  related_user_id?: number
  related_post_id?: number
  is_read: boolean
  created_at: Date
  related_user?: User
}

export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  image_url?: string
  is_read: boolean
  created_at: Date
  sender?: User
  receiver?: User
}

// Optimized User operations
export async function getUsers(): Promise<User[]> {
  try {
    const users = await sql`
      SELECT id, username, email, full_name, bio, avatar_url, is_verified, 
             follower_count, following_count, post_count, created_at
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 50
    `
    return users as User[]
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export async function getUserById(id: number): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE id = ${id} LIMIT 1
    `
    return (users[0] as User) || null
  } catch (error) {
    console.error("Error fetching user by ID:", error)
    return null
  }
}

export async function getUserByUsername(username: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE username = ${username} LIMIT 1
    `
    return (users[0] as User) || null
  } catch (error) {
    console.error("Error fetching user by username:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const users = await sql`
      SELECT * FROM users WHERE email = ${email} LIMIT 1
    `
    return (users[0] as User) || null
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export async function createUser(userData: {
  username: string
  email: string
  full_name: string
  bio?: string
  avatar_url?: string
}): Promise<User> {
  const users = await sql`
    INSERT INTO users (username, email, full_name, bio, avatar_url)
    VALUES (${userData.username}, ${userData.email}, ${userData.full_name}, 
            ${userData.bio || ""}, ${userData.avatar_url || "/placeholder.svg?height=100&width=100"})
    RETURNING *
  `
  return users[0] as User
}

// Optimized Post operations with single query
export async function getPosts(limit = 10, offset = 0, userId?: number): Promise<Post[]> {
  try {
    const posts = await sql`
      SELECT 
        p.id, p.user_id, p.content, p.image_url, p.video_url, 
        p.like_count, p.comment_count, p.share_count, p.is_pinned, p.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified,
        ${userId ? sql`COALESCE((SELECT true FROM likes WHERE post_id = p.id AND user_id = ${userId} LIMIT 1), false)` : sql`false`} as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.user_id,
        username: post.username,
        full_name: post.full_name,
        avatar_url: post.avatar_url,
        is_verified: post.is_verified,
      },
    })) as Post[]
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export async function getPostsByUserId(userId: number, currentUserId?: number): Promise<Post[]> {
  try {
    const posts = await sql`
      SELECT 
        p.id, p.user_id, p.content, p.image_url, p.video_url, 
        p.like_count, p.comment_count, p.share_count, p.is_pinned, p.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified,
        ${currentUserId ? sql`COALESCE((SELECT true FROM likes WHERE post_id = p.id AND user_id = ${currentUserId} LIMIT 1), false)` : sql`false`} as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
      LIMIT 20
    `

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.user_id,
        username: post.username,
        full_name: post.full_name,
        avatar_url: post.avatar_url,
        is_verified: post.is_verified,
      },
    })) as Post[]
  } catch (error) {
    console.error("Error fetching posts by user ID:", error)
    return []
  }
}

export async function getPostById(postId: number, userId?: number): Promise<Post | null> {
  try {
    const posts = await sql`
      SELECT 
        p.id, p.user_id, p.content, p.image_url, p.video_url, 
        p.like_count, p.comment_count, p.share_count, p.is_pinned, p.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified,
        ${userId ? sql`COALESCE((SELECT true FROM likes WHERE post_id = p.id AND user_id = ${userId} LIMIT 1), false)` : sql`false`} as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ${postId}
      LIMIT 1
    `

    if (posts.length === 0) return null

    const post = posts[0]
    return {
      ...post,
      user: {
        id: post.user_id,
        username: post.username,
        full_name: post.full_name,
        avatar_url: post.avatar_url,
        is_verified: post.is_verified,
      },
    } as Post
  } catch (error) {
    console.error("Error fetching post by ID:", error)
    return null
  }
}

export async function createPost(userId: number, content: string, imageUrl?: string): Promise<Post> {
  const posts = await sql`
    INSERT INTO posts (user_id, content, image_url)
    VALUES (${userId}, ${content}, ${imageUrl || null})
    RETURNING *
  `

  // Update user post count in background
  sql`UPDATE users SET post_count = post_count + 1 WHERE id = ${userId}`.catch(console.error)

  const user = await getUserById(userId)
  return {
    ...posts[0],
    user,
    liked: false,
  } as Post
}

// Optimized Like operations
export async function toggleLike(userId: number, postId: number): Promise<Post | null> {
  try {
    // Check if like exists
    const existingLike = await sql`
      SELECT id FROM likes WHERE user_id = ${userId} AND post_id = ${postId} LIMIT 1
    `

    if (existingLike.length > 0) {
      // Unlike
      await sql`DELETE FROM likes WHERE user_id = ${userId} AND post_id = ${postId}`
      await sql`UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = ${postId}`
    } else {
      // Like
      await sql`INSERT INTO likes (user_id, post_id) VALUES (${userId}, ${postId})`
      await sql`UPDATE posts SET like_count = like_count + 1 WHERE id = ${postId}`
    }

    // Get updated post
    const posts = await sql`
      SELECT 
        p.id, p.user_id, p.content, p.image_url, p.video_url, 
        p.like_count, p.comment_count, p.share_count, p.is_pinned, p.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified,
        EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = ${userId}) as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ${postId}
      LIMIT 1
    `

    if (posts.length === 0) return null

    const post = posts[0]
    return {
      ...post,
      user: {
        id: post.user_id,
        username: post.username,
        full_name: post.full_name,
        avatar_url: post.avatar_url,
        is_verified: post.is_verified,
      },
    } as Post
  } catch (error) {
    console.error("Error toggling like:", error)
    return null
  }
}

// Comment operations
export async function getComments(postId: number, userId?: number): Promise<Comment[]> {
  try {
    const comments = await sql`
      SELECT 
        c.id, c.post_id, c.user_id, c.parent_comment_id, c.content, 
        c.like_count, c.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ${postId}
      ORDER BY c.created_at ASC
      LIMIT 50
    `

    return comments.map((comment) => ({
      ...comment,
      user: {
        id: comment.user_id,
        username: comment.username,
        full_name: comment.full_name,
        avatar_url: comment.avatar_url,
        is_verified: comment.is_verified,
      },
    })) as Comment[]
  } catch (error) {
    console.error("Error fetching comments:", error)
    return []
  }
}

export async function createComment(
  userId: number,
  postId: number,
  content: string,
  parentCommentId?: number,
): Promise<Comment> {
  const comments = await sql`
    INSERT INTO comments (user_id, post_id, content, parent_comment_id)
    VALUES (${userId}, ${postId}, ${content}, ${parentCommentId || null})
    RETURNING *
  `

  // Update post comment count in background
  sql`UPDATE posts SET comment_count = comment_count + 1 WHERE id = ${postId}`.catch(console.error)

  const user = await getUserById(userId)
  return {
    ...comments[0],
    user,
  } as Comment
}

// Story operations
export async function getStories(userId?: number): Promise<Story[]> {
  try {
    const stories = await sql`
      SELECT 
        s.id, s.user_id, s.content, s.image_url, s.video_url, 
        s.view_count, s.expires_at, s.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified,
        ${userId ? sql`EXISTS(SELECT 1 FROM story_views WHERE story_id = s.id AND user_id = ${userId})` : sql`false`} as viewed
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.expires_at > NOW()
      ORDER BY s.created_at DESC
      LIMIT 20
    `

    return stories.map((story) => ({
      ...story,
      user: {
        id: story.user_id,
        username: story.username,
        full_name: story.full_name,
        avatar_url: story.avatar_url,
        is_verified: story.is_verified,
      },
    })) as Story[]
  } catch (error) {
    console.error("Error fetching stories:", error)
    return []
  }
}

export async function getStoriesByUserId(userId: number, viewerId?: number): Promise<Story[]> {
  try {
    const stories = await sql`
      SELECT 
        s.id, s.user_id, s.content, s.image_url, s.video_url, 
        s.view_count, s.expires_at, s.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified,
        ${viewerId ? sql`EXISTS(SELECT 1 FROM story_views WHERE story_id = s.id AND user_id = ${viewerId})` : sql`false`} as viewed
      FROM stories s
      JOIN users u ON s.user_id = u.id
      WHERE s.user_id = ${userId} AND s.expires_at > NOW()
      ORDER BY s.created_at DESC
    `

    return stories.map((story) => ({
      ...story,
      user: {
        id: story.user_id,
        username: story.username,
        full_name: story.full_name,
        avatar_url: story.avatar_url,
        is_verified: story.is_verified,
      },
    })) as Story[]
  } catch (error) {
    console.error("Error fetching stories by user ID:", error)
    return []
  }
}

export async function viewStory(storyId: number, userId: number): Promise<void> {
  try {
    await sql`
      INSERT INTO story_views (story_id, user_id) 
      VALUES (${storyId}, ${userId})
      ON CONFLICT (story_id, user_id) DO NOTHING
    `

    // Update view count in background
    sql`UPDATE stories SET view_count = view_count + 1 WHERE id = ${storyId}`.catch(console.error)
  } catch (error) {
    console.error("Error viewing story:", error)
  }
}

// Optimized Follow operations
export async function toggleFollow(
  followerId: number,
  followingId: number,
): Promise<{ isFollowing: boolean; followerCount: number } | null> {
  if (followerId === followingId) return null

  try {
    // Check if follow exists
    const existingFollow = await sql`
      SELECT id FROM follows WHERE follower_id = ${followerId} AND following_id = ${followingId} LIMIT 1
    `

    if (existingFollow.length > 0) {
      // Unfollow
      await sql`DELETE FROM follows WHERE follower_id = ${followerId} AND following_id = ${followingId}`
      await sql`UPDATE users SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = ${followingId}`
      await sql`UPDATE users SET following_count = GREATEST(following_count - 1, 0) WHERE id = ${followerId}`
    } else {
      // Follow
      await sql`INSERT INTO follows (follower_id, following_id) VALUES (${followerId}, ${followingId})`
      await sql`UPDATE users SET follower_count = follower_count + 1 WHERE id = ${followingId}`
      await sql`UPDATE users SET following_count = following_count + 1 WHERE id = ${followerId}`
    }

    // Get updated follower count
    const user = await getUserById(followingId)
    return {
      isFollowing: existingFollow.length === 0,
      followerCount: user?.follower_count || 0,
    }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return null
  }
}

// Optimized Search operations
export async function searchUsers(query: string): Promise<User[]> {
  try {
    if (!query.trim()) {
      // Return popular users when no query
      const users = await sql`
        SELECT id, username, full_name, avatar_url, is_verified, follower_count
        FROM users 
        ORDER BY follower_count DESC
        LIMIT 10
      `
      return users as User[]
    }

    const users = await sql`
      SELECT id, username, full_name, avatar_url, is_verified, follower_count
      FROM users 
      WHERE username ILIKE ${"%" + query + "%"} OR full_name ILIKE ${"%" + query + "%"}
      ORDER BY follower_count DESC
      LIMIT 10
    `
    return users as User[]
  } catch (error) {
    console.error("Error searching users:", error)
    return []
  }
}

export async function searchPosts(query: string, userId?: number): Promise<Post[]> {
  try {
    if (!query.trim()) return []

    const posts = await sql`
      SELECT 
        p.id, p.user_id, p.content, p.image_url, p.like_count, p.comment_count, p.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified,
        ${userId ? sql`COALESCE((SELECT true FROM likes WHERE post_id = p.id AND user_id = ${userId} LIMIT 1), false)` : sql`false`} as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.content ILIKE ${"%" + query + "%"}
      ORDER BY p.like_count DESC, p.created_at DESC
      LIMIT 10
    `

    return posts.map((post) => ({
      ...post,
      user: {
        id: post.user_id,
        username: post.username,
        full_name: post.full_name,
        avatar_url: post.avatar_url,
        is_verified: post.is_verified,
      },
    })) as Post[]
  } catch (error) {
    console.error("Error searching posts:", error)
    return []
  }
}

// Optimized Notification operations
export async function getNotifications(userId: number): Promise<Notification[]> {
  try {
    const notifications = await sql`
      SELECT 
        n.id, n.user_id, n.type, n.message, n.related_user_id, 
        n.related_post_id, n.is_read, n.created_at,
        u.username, u.full_name, u.avatar_url, u.is_verified
      FROM notifications n
      LEFT JOIN users u ON n.related_user_id = u.id
      WHERE n.user_id = ${userId}
      ORDER BY n.created_at DESC
      LIMIT 50
    `

    return notifications.map((notification) => ({
      ...notification,
      related_user: notification.related_user_id
        ? {
            id: notification.related_user_id,
            username: notification.username,
            full_name: notification.full_name,
            avatar_url: notification.avatar_url,
            is_verified: notification.is_verified,
          }
        : undefined,
    })) as Notification[]
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return []
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  try {
    await sql`UPDATE notifications SET is_read = true WHERE id = ${notificationId}`
  } catch (error) {
    console.error("Error marking notification as read:", error)
  }
}

export async function markAllNotificationsAsRead(userId: number): Promise<void> {
  try {
    await sql`UPDATE notifications SET is_read = true WHERE user_id = ${userId}`
  } catch (error) {
    console.error("Error marking all notifications as read:", error)
  }
}

// Optimized Message operations
export async function getConversations(userId: number): Promise<any[]> {
  try {
    const conversations = await sql`
      WITH latest_messages AS (
        SELECT 
          CASE 
            WHEN sender_id = ${userId} THEN receiver_id
            ELSE sender_id
          END as other_user_id,
          content as last_message,
          created_at as last_message_time,
          ROW_NUMBER() OVER (
            PARTITION BY CASE 
              WHEN sender_id = ${userId} THEN receiver_id
              ELSE sender_id
            END 
            ORDER BY created_at DESC
          ) as rn
        FROM messages 
        WHERE sender_id = ${userId} OR receiver_id = ${userId}
      ),
      unread_counts AS (
        SELECT 
          sender_id as other_user_id,
          COUNT(*) as unread_count
        FROM messages 
        WHERE receiver_id = ${userId} AND is_read = false
        GROUP BY sender_id
      )
      SELECT 
        u.id as other_user_id, u.username, u.full_name, u.avatar_url, u.is_verified,
        lm.last_message, lm.last_message_time,
        COALESCE(uc.unread_count, 0) as unread_count
      FROM latest_messages lm
      JOIN users u ON lm.other_user_id = u.id
      LEFT JOIN unread_counts uc ON lm.other_user_id = uc.other_user_id
      WHERE lm.rn = 1
      ORDER BY lm.last_message_time DESC
      LIMIT 20
    `

    return conversations
  } catch (error) {
    console.error("Error fetching conversations:", error)
    return []
  }
}

export async function getMessages(userId: number, otherUserId: number): Promise<Message[]> {
  try {
    const messages = await sql`
      SELECT 
        m.id, m.sender_id, m.receiver_id, m.content, m.image_url, m.is_read, m.created_at,
        s.username as sender_username, s.full_name as sender_name, s.avatar_url as sender_avatar,
        r.username as receiver_username, r.full_name as receiver_name, r.avatar_url as receiver_avatar
      FROM messages m
      JOIN users s ON m.sender_id = s.id
      JOIN users r ON m.receiver_id = r.id
      WHERE (m.sender_id = ${userId} AND m.receiver_id = ${otherUserId})
         OR (m.sender_id = ${otherUserId} AND m.receiver_id = ${userId})
      ORDER BY m.created_at ASC
      LIMIT 100
    `

    return messages.map((message) => ({
      ...message,
      sender: {
        id: message.sender_id,
        username: message.sender_username,
        full_name: message.sender_name,
        avatar_url: message.sender_avatar,
      },
      receiver: {
        id: message.receiver_id,
        username: message.receiver_username,
        full_name: message.receiver_name,
        avatar_url: message.receiver_avatar,
      },
    })) as Message[]
  } catch (error) {
    console.error("Error fetching messages:", error)
    return []
  }
}

export async function sendMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
  const messages = await sql`
    INSERT INTO messages (sender_id, receiver_id, content)
    VALUES (${senderId}, ${receiverId}, ${content})
    RETURNING *
  `

  const sender = await getUserById(senderId)
  const receiver = await getUserById(receiverId)

  return {
    ...messages[0],
    sender,
    receiver,
  } as Message
}

// Optimized Trending and suggestions
export async function getTrendingHashtags(): Promise<any[]> {
  try {
    const hashtags = await sql`
      SELECT name, post_count 
      FROM hashtags 
      ORDER BY post_count DESC 
      LIMIT 10
    `
    return hashtags.map((h) => ({ tag: h.name, posts: `${(h.post_count / 1000).toFixed(1)}K posts` }))
  } catch (error) {
    console.error("Error fetching trending hashtags:", error)
    return []
  }
}

export async function getSuggestedUsers(userId: number): Promise<any[]> {
  try {
    const users = await sql`
      SELECT u.id, u.username, u.full_name, u.avatar_url, u.is_verified, u.follower_count
      FROM users u
      WHERE u.id != ${userId}
        AND u.id NOT IN (SELECT following_id FROM follows WHERE follower_id = ${userId})
      ORDER BY u.follower_count DESC
      LIMIT 5
    `

    return users.map((user) => ({
      ...user,
      mutual: Math.floor(Math.random() * 20) + 1,
    }))
  } catch (error) {
    console.error("Error fetching suggested users:", error)
    return []
  }
}

export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
  try {
    const follows = await sql`
      SELECT 1 FROM follows WHERE follower_id = ${followerId} AND following_id = ${followingId} LIMIT 1
    `
    return follows.length > 0
  } catch (error) {
    console.error("Error checking follow status:", error)
    return false
  }
}

// Backward compatibility export
export const db = {
  getUsers,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  getPosts,
  getPostsByUserId,
  getPostById,
  createPost,
  toggleLike,
  getComments,
  createComment,
  getStories,
  getStoriesByUserId,
  viewStory,
  toggleFollow,
  searchUsers,
  searchPosts,
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getConversations,
  getMessages,
  sendMessage,
  getTrendingHashtags,
  getSuggestedUsers,
  isFollowing,
}
