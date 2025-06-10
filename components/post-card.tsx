"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal } from "lucide-react"
import { toggleLikeAction } from "@/app/actions/posts"

interface Post {
  id: number
  user: {
    id: number
    username: string
    full_name: string
    avatar_url: string
    is_verified: boolean
  }
  content: string
  image_url?: string
  like_count: number
  comment_count: number
  share_count: number
  created_at: Date
  liked: boolean
}

interface PostCardProps {
  post: Post
  index?: number
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isLiking, setIsLiking] = useState(false)

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    const optimisticLiked = !isLiked
    const optimisticCount = optimisticLiked ? likeCount + 1 : likeCount - 1

    // Optimistic update
    setIsLiked(optimisticLiked)
    setLikeCount(optimisticCount)

    try {
      const result = await toggleLikeAction(post.id)
      if (result.error) {
        // Revert on error
        setIsLiked(!optimisticLiked)
        setLikeCount(likeCount)
      } else if (result.post) {
        // Update with server response
        setIsLiked(result.post.liked)
        setLikeCount(result.post.like_count)
      }
    } catch (error) {
      // Revert on error
      setIsLiked(!optimisticLiked)
      setLikeCount(likeCount)
    } finally {
      setIsLiking(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "now"
    if (diffInHours < 24) return `${diffInHours}h ago`

    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <Card
      className="bg-gray-900 border-gray-700 hover:bg-gray-800 transition-all duration-300 animate-slide-up"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <CardContent className="p-6">
        {/* Post Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10 ring-2 ring-gray-700">
              <AvatarImage src={post.user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{post.user.full_name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-1">
                <p className="font-semibold text-white">{post.user.full_name}</p>
                {post.user.is_verified && (
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-400">
                @{post.user.username} • {formatTimeAgo(new Date(post.created_at))}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
          >
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {/* Post Content */}
        <p className="text-white mb-4 leading-relaxed">{post.content}</p>

        {/* Post Image */}
        {post.image_url && (
          <div className="mb-4 rounded-xl overflow-hidden">
            <img
              src={post.image_url || "/placeholder.svg"}
              alt="Post content"
              className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        {/* Post Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700">
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              disabled={isLiking}
              className={`transition-all duration-200 transform hover:scale-110 ${
                isLiked ? "text-red-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 ${isLiked ? "fill-current" : ""}`} />
              {likeCount}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400 transition-all duration-200 transform hover:scale-110"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              {post.comment_count}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-green-400 transition-all duration-200 transform hover:scale-110"
            >
              <Share className="w-5 h-5 mr-2" />
              {post.share_count}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-yellow-400 transition-all duration-200 transform hover:scale-110"
          >
            <Bookmark className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
