"use client"

import { useState, useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Video, Smile } from "lucide-react"
import { createPostAction } from "@/app/actions/posts"

interface CreatePostProps {
  user: {
    id: number
    username: string
    full_name: string
    avatar_url: string
  }
}

export function CreatePost({ user }: CreatePostProps) {
  const [content, setContent] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    if (!content.trim()) return

    startTransition(async () => {
      const result = await createPostAction(formData)
      if (result.success) {
        setContent("")
      }
    })
  }

  return (
    <Card className="mb-8 bg-gray-900 border-gray-700 animate-slide-up">
      <CardContent className="p-6">
        <form action={handleSubmit}>
          <div className="flex space-x-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{user.full_name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                name="content"
                placeholder="What's on your mind?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-transparent border-none text-white placeholder-gray-400 resize-none focus:ring-0 text-lg"
                rows={3}
              />
              <div className="flex items-center justify-between mt-4">
                <div className="flex space-x-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    <ImageIcon className="w-5 h-5 mr-2" />
                    Photo
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    <Video className="w-5 h-5 mr-2" />
                    Video
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-purple-400 transition-colors duration-200"
                  >
                    <Smile className="w-5 h-5 mr-2" />
                    Emoji
                  </Button>
                </div>
                <Button
                  type="submit"
                  disabled={!content.trim() || isPending}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 transform hover:scale-105"
                >
                  {isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
