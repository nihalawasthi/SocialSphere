"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react"
import type { Story } from "@/lib/db"
import { viewStoryAction } from "@/app/actions/posts"

interface StoryViewerProps {
  stories: Story[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function StoryViewer({ stories, initialIndex, isOpen, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [progress, setProgress] = useState(0)

  const currentStory = stories[currentIndex]

  useEffect(() => {
    if (!isOpen || !currentStory) return

    // Mark story as viewed
    viewStoryAction(currentStory.id)

    // Auto-progress timer
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          nextStory()
          return 0
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(timer)
  }, [currentIndex, isOpen, currentStory])

  const nextStory = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setProgress(0)
    } else {
      onClose()
    }
  }

  const prevStory = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setProgress(0)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    if (diffInHours < 1) return "now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (!currentStory) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[80vh] p-0 bg-black border-none">
        <div className="relative w-full h-full flex flex-col">
          {/* Progress bars */}
          <div className="flex space-x-1 p-2">
            {stories.map((_, index) => (
              <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{
                    width: index < currentIndex ? "100%" : index === currentIndex ? `${progress}%` : "0%",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="w-8 h-8 ring-2 ring-white">
                <AvatarImage src={currentStory.user?.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{currentStory.user?.full_name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white font-semibold text-sm">{currentStory.user?.full_name}</p>
                <p className="text-gray-300 text-xs">{formatTimeAgo(new Date(currentStory.created_at))}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-gray-800">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Story Content */}
          <div className="flex-1 relative">
            {currentStory.image_url ? (
              <img
                src={currentStory.image_url || "/placeholder.svg"}
                alt="Story"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                <p className="text-white text-lg font-semibold p-6 text-center">{currentStory.content}</p>
              </div>
            )}

            {/* Navigation */}
            <button
              onClick={prevStory}
              className="absolute left-0 top-0 w-1/2 h-full z-10"
              disabled={currentIndex === 0}
            />
            <button onClick={nextStory} className="absolute right-0 top-0 w-1/2 h-full z-10" />

            {/* Navigation indicators */}
            {currentIndex > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={prevStory}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-800"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
            )}
            {currentIndex < stories.length - 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={nextStory}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:bg-gray-800"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Heart className="w-5 h-5" />
            </Button>
            <div className="flex-1 bg-gray-800 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Reply to story..."
                className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
              />
            </div>
            <Button variant="ghost" size="icon" className="text-white hover:bg-gray-800">
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
