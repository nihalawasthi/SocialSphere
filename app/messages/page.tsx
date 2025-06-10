import { getCurrentUser } from "@/lib/auth"
import { getConversations } from "@/lib/db"
import { redirect } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Send } from "lucide-react"
import Link from "next/link"

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return "now"
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

export default async function MessagesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const conversations = await getConversations(user.id)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex h-[calc(100vh-73px)]">
        {/* Conversations List */}
        <div className="w-80 border-r border-gray-800 flex flex-col">
          <div className="p-4 border-b border-gray-800">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search messages..."
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No messages yet</h3>
                <p className="text-gray-400 text-sm">Start a conversation with someone!</p>
              </div>
            ) : (
              conversations.map((conversation, index) => (
                <Link
                  key={conversation.other_user_id}
                  href={`/messages/${conversation.other_user_id}`}
                  className="block"
                >
                  <div
                    className="flex items-center space-x-3 p-4 hover:bg-gray-900 cursor-pointer border-b border-gray-800/50 animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={conversation.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback>{conversation.full_name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-black"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <p className="font-semibold text-white truncate">{conversation.full_name}</p>
                          {conversation.is_verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatTimeAgo(new Date(conversation.last_message_time))}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{conversation.last_message}</p>
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-xs text-white">{conversation.unread_count}</span>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Chat Area - Empty State */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <Card className="bg-gray-900 border-gray-700 max-w-md">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a conversation from the sidebar to start messaging.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
