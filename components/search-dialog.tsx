"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, User, Hash } from "lucide-react"

interface SearchResult {
  users: Array<{
    id: number
    username: string
    full_name: string
    avatar_url: string
    is_verified: boolean
  }>
  posts: Array<{
    id: number
    content: string
    user: {
      username: string
      full_name: string
    }
  }>
}

export function SearchDialog() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult>({ users: [], posts: [] })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true)
        try {
          const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`)
          const data = await response.json()
          setResults(data)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults({ users: [], posts: [] })
      }
    }, 300)

    return () => clearTimeout(searchTimeout)
  }, [query])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search SocialSphere..."
            className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400 w-64 focus:ring-purple-500 focus:border-purple-500 cursor-pointer"
            readOnly
          />
        </div>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search SocialSphere</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search for users, posts, or hashtags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              autoFocus
            />
          </div>

          {isLoading && <div className="text-center py-4 text-gray-400">Searching...</div>}

          {!isLoading && query && (
            <div className="space-y-6 max-h-96 overflow-y-auto">
              {/* Users */}
              {results.users.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    Users
                  </h3>
                  <div className="space-y-2">
                    {results.users.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{user.full_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-1">
                            <p className="font-medium">{user.full_name}</p>
                            {user.is_verified && (
                              <div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs">✓</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">@{user.username}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Posts */}
              {results.posts.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-3 flex items-center">
                    <Hash className="w-4 h-4 mr-2" />
                    Posts
                  </h3>
                  <div className="space-y-2">
                    {results.posts.map((post) => (
                      <div key={post.id} className="p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
                        <p className="text-sm text-gray-300 mb-1">
                          {post.content.slice(0, 100)}
                          {post.content.length > 100 && "..."}
                        </p>
                        <p className="text-xs text-gray-500">by @{post.user.username}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {query && !isLoading && results.users.length === 0 && results.posts.length === 0 && (
                <div className="text-center py-8 text-gray-400">No results found for "{query}"</div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
