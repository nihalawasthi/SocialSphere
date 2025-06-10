import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

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

// User operations
export async function getUsers(): Promise<User[]> {
  const users = await sql`SELECT * FROM users ORDER BY created_at DESC`
  return users as User[]
}

export async function getUserById(id: number): Promise<User | null> {
  const users = await sql`SELECT * FROM users WHERE id = ${id}`
  return (users[0] as User) || null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const users = await sql`SELECT * FROM users WHERE username = ${username}`
  return (users[0] as User) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const users = await sql`SELECT * FROM users WHERE email = ${email}`
  return (users[0] as User) || null
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
    VALUES (${userData.username}, ${userData.email}, ${userData.full_name}, ${userData.bio || ""}, ${userData.avatar_url || "/placeholder.svg?height=100&width=100"})
    RETURNING *
  `
  return users[0] as User
}

// Post operations
export async function getPosts(limit = 10, offset = 0, userId?: number): Promise<Post[]> {
  let query
  if (userId) {
    query = sql`
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.is_verified,
             EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ${userId}) as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  } else {
    query = sql`
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.is_verified
      FROM posts p
      JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  }

  const posts = await query
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
}

export async function getPostsByUserId(userId: number, currentUserId?: number): Promise<Post[]> {
  let query
  if (currentUserId) {
    query = sql`
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.is_verified,
             EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ${currentUserId}) as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
    `
  } else {
    query = sql`
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.is_verified
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.user_id = ${userId}
      ORDER BY p.created_at DESC
    `
  }

  const posts = await query
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
}

export async function createPost(userId: number, content: string, imageUrl?: string): Promise<Post> {
  const posts = await sql`
    INSERT INTO posts (user_id, content, image_url)
    VALUES (${userId}, ${content}, ${imageUrl || null})
    RETURNING *
  `

  // Update user post count
  await sql`
    UPDATE users 
    SET post_count = post_count + 1 
    WHERE id = ${userId}
  `

  const user = await getUserById(userId)
  return {
    ...posts[0],
    user,
    liked: false,
  } as Post
}

// Like operations
export async function toggleLike(userId: number, postId: number): Promise<Post | null> {
  // Check if like exists
  const existingLike = await sql`
    SELECT id FROM likes WHERE user_id = ${userId} AND post_id = ${postId}
  `

  if (existingLike.length > 0) {
    // Unlike
    await sql`DELETE FROM likes WHERE user_id = ${userId} AND post_id = ${postId}`
    await sql`UPDATE posts SET like_count = like_count - 1 WHERE id = ${postId}`
  } else {
    // Like
    await sql`INSERT INTO likes (user_id, post_id) VALUES (${userId}, ${postId})`
    await sql`UPDATE posts SET like_count = like_count + 1 WHERE id = ${postId}`
  }

  // Get updated post
  const posts = await sql`
    SELECT p.*, u.username, u.full_name, u.avatar_url, u.is_verified,
           EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ${userId}) as liked
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ${postId}
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
}

// Follow operations
export async function toggleFollow(
  followerId: number,
  followingId: number,
): Promise<{ isFollowing: boolean; followerCount: number } | null> {
  if (followerId === followingId) return null

  // Check if follow exists
  const existingFollow = await sql`
    SELECT id FROM follows WHERE follower_id = ${followerId} AND following_id = ${followingId}
  `

  if (existingFollow.length > 0) {
    // Unfollow
    await sql`DELETE FROM follows WHERE follower_id = ${followerId} AND following_id = ${followingId}`
    await sql`UPDATE users SET follower_count = follower_count - 1 WHERE id = ${followingId}`
    await sql`UPDATE users SET following_count = following_count - 1 WHERE id = ${followerId}`
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
}

// Search operations
export async function searchUsers(query: string): Promise<User[]> {
  const users = await sql`
    SELECT * FROM users 
    WHERE username ILIKE ${"%" + query + "%"} OR full_name ILIKE ${"%" + query + "%"}
    ORDER BY follower_count DESC
    LIMIT 10
  `
  return users as User[]
}

export async function searchPosts(query: string, userId?: number): Promise<Post[]> {
  let posts
  if (userId) {
    posts = await sql`
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.is_verified,
             EXISTS(SELECT 1 FROM likes l WHERE l.post_id = p.id AND l.user_id = ${userId}) as liked
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.content ILIKE ${"%" + query + "%"}
      ORDER BY p.like_count DESC, p.created_at DESC
      LIMIT 10
    `
  } else {
    posts = await sql`
      SELECT p.*, u.username, u.full_name, u.avatar_url, u.is_verified
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.content ILIKE ${"%" + query + "%"}
      ORDER BY p.like_count DESC, p.created_at DESC
      LIMIT 10
    `
  }

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
}

// Notification operations
export async function getNotifications(userId: number): Promise<Notification[]> {
  const notifications = await sql`
    SELECT n.*, u.username, u.full_name, u.avatar_url, u.is_verified
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
}

export async function markNotificationAsRead(notificationId: number): Promise<void> {
  await sql`UPDATE notifications SET is_read = true WHERE id = ${notificationId}`
}

export async function markAllNotificationsAsRead(userId: number): Promise<void> {
  await sql`UPDATE notifications SET is_read = true WHERE user_id = ${userId}`
}

// Message operations
export async function getConversations(userId: number): Promise<any[]> {
  // First, get all unique conversation partners
  const conversationPartners = await sql`
    SELECT DISTINCT
      CASE 
        WHEN sender_id = ${userId} THEN receiver_id
        ELSE sender_id
      END as partner_id
    FROM messages 
    WHERE sender_id = ${userId} OR receiver_id = ${userId}
  `

  if (conversationPartners.length === 0) {
    return []
  }

  // Then get the details for each conversation
  const conversations = []
  for (const partner of conversationPartners) {
    const partnerId = partner.partner_id

    // Get user details
    const userDetails = await sql`
      SELECT id, username, full_name, avatar_url, is_verified
      FROM users 
      WHERE id = ${partnerId}
    `

    if (userDetails.length === 0) continue

    // Get last message
    const lastMessage = await sql`
      SELECT content, created_at
      FROM messages 
      WHERE (sender_id = ${userId} AND receiver_id = ${partnerId}) 
         OR (sender_id = ${partnerId} AND receiver_id = ${userId})
      ORDER BY created_at DESC 
      LIMIT 1
    `

    // Get unread count
    const unreadCount = await sql`
      SELECT COUNT(*) as count
      FROM messages 
      WHERE sender_id = ${partnerId} AND receiver_id = ${userId} AND is_read = false
    `

    const user = userDetails[0]
    const lastMsg = lastMessage[0]
    const unread = unreadCount[0]

    conversations.push({
      other_user_id: user.id,
      username: user.username,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      is_verified: user.is_verified,
      last_message: lastMsg?.content || "",
      last_message_time: lastMsg?.created_at || new Date(),
      unread_count: Number.parseInt(unread.count) || 0,
    })
  }

  // Sort by last message time
  conversations.sort((a, b) => new Date(b.last_message_time).getTime() - new Date(a.last_message_time).getTime())

  return conversations
}

export async function getMessages(userId: number, otherUserId: number): Promise<Message[]> {
  const messages = await sql`
    SELECT m.*, 
           s.username as sender_username, s.full_name as sender_name, s.avatar_url as sender_avatar,
           r.username as receiver_username, r.full_name as receiver_name, r.avatar_url as receiver_avatar
    FROM messages m
    JOIN users s ON m.sender_id = s.id
    JOIN users r ON m.receiver_id = r.id
    WHERE (m.sender_id = ${userId} AND m.receiver_id = ${otherUserId})
       OR (m.sender_id = ${otherUserId} AND m.receiver_id = ${userId})
    ORDER BY m.created_at ASC
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

// Trending and suggestions
export async function getTrendingHashtags(): Promise<any[]> {
  const hashtags = await sql`
    SELECT name, post_count 
    FROM hashtags 
    ORDER BY post_count DESC 
    LIMIT 10
  `
  return hashtags.map((h) => ({ tag: h.name, posts: `${(h.post_count / 1000).toFixed(1)}K posts` }))
}

export async function getSuggestedUsers(userId: number): Promise<any[]> {
  const users = await sql`
    SELECT u.*, 
           (SELECT COUNT(*) FROM follows f1 
            JOIN follows f2 ON f1.following_id = f2.following_id 
            WHERE f1.follower_id = ${userId} AND f2.follower_id = u.id) as mutual_count
    FROM users u
    WHERE u.id != ${userId}
      AND u.id NOT IN (SELECT following_id FROM follows WHERE follower_id = ${userId})
    ORDER BY u.follower_count DESC, mutual_count DESC
    LIMIT 3
  `

  return users.map((user) => ({
    ...user,
    mutual: user.mutual_count || Math.floor(Math.random() * 20) + 1,
  }))
}

export async function isFollowing(followerId: number, followingId: number): Promise<boolean> {
  const follows = await sql`
    SELECT id FROM follows WHERE follower_id = ${followerId} AND following_id = ${followingId}
  `
  return follows.length > 0
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
  createPost,
  toggleLike,
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
