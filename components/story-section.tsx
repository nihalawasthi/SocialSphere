"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StoryViewer } from "@/components/story-viewer"
import { PlusSquare } from "lucide-react"
import type { Story } from "@/lib/db"

interface StorySectionProps {
  stories: Story[]
}

export function StorySection({ stories }: StorySectionProps) {
  const [showViewer, setShowViewer] = useState(false)
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0)

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index)
    setShowViewer(true)
  }

  return (
    <>
      <div className="mb-8">
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {/* Add Story Button */}
          <div className="flex-shrink-0 text-center cursor-pointer group animate-fade-in">
            <div className="relative transition-transform duration-200 group-hover:scale-110">
              <div className="p-1 rounded-full bg-gray-700">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    <PlusSquare className="w-8 h-8 text-gray-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            <p className="text-xs mt-2 text-gray-400 group-hover:text-white transition-colors duration-200 truncate w-16">
              Your Story
            </p>
          </div>

          {/* Stories */}
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="flex-shrink-0 text-center cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${(index + 1) * 100}ms` }}
              onClick={() => handleStoryClick(index)}
            >
              <div className="relative transition-transform duration-200 group-hover:scale-110">
                <div
                  className={`p-1 rounded-full ${
                    story.viewed ? "bg-gray-600" : "bg-gradient-to-r from-purple-400 to-pink-400"
                  }`}
                >
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={story.user?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{story.user?.full_name[0]}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
              <p className="text-xs mt-2 text-gray-400 group-hover:text-white transition-colors duration-200 truncate w-16">
                {story.user?.full_name}
              </p>
            </div>
          ))}
        </div>
      </div>

      <StoryViewer
        stories={stories}
        initialIndex={selectedStoryIndex}
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
      />
    </>
  )
}
