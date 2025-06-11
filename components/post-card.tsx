"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Heart, MessageCircle, Share, Bookmark, MoreHorizontal, Send } from "lucide-react"
import { toggleLikeAction, createCommentAction } from "@/app/actions/posts"
import type { Comment } from "@/lib/db"

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
  comments?: Comment[]
}

interface PostCardProps {
  post: Post
  index?: number
  showComments?: boolean
}

export function PostCard({ post, index = 0, showComments = false }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.liked)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [isLiking, setIsLiking] = useState(false)
  const [showCommentsSection, setShowCommentsSection] = useState(showComments)
  const [comments, setComments] = useState<Comment[]>(post.comments || [])
  const [newComment, setNewComment] = useState("")
  const [isCommenting, setIsCommenting] = useState(false)

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

  const handleComment = async () => {
    if (!newComment.trim() || isCommenting) return

    setIsCommenting(true)
    try {
      const result = await createCommentAction(post.id, newComment)
      if (result.success && result.comment) {
        setComments([...comments, result.comment])
        setNewComment("")
      }
    } catch (error) {
      console.error("Failed to create comment:", error)
    } finally {
      setIsCommenting(false)
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
              onClick={() => setShowCommentsSection(!showCommentsSection)}
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

        {/* Comments Section */}
        {showCommentsSection && (
          <div className="mt-6 pt-4 border-t border-gray-700">
            {/* Add Comment */}
            <div className="flex space-x-3 mb-4">
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex space-x-2">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 resize-none"
                  rows={2}
                />
                <Button
                  onClick={handleComment}
                  disabled={!newComment.trim() || isCommenting}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.user?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{comment.user?.full_name[0] || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center space-x-1 mb-1">
                        <p className="font-semibold text-white text-sm">{comment.user?.full_name}</p>
                        <span className="text-gray-400 text-xs">{formatTimeAgo(new Date(comment.created_at))}</span>
                      </div>
                      <p className="text-white text-sm">{comment.content}</p>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 ml-3">
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400 text-xs">
                        <Heart className="w-3 h-3 mr-1" />
                        {comment.like_count}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-blue-400 text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
