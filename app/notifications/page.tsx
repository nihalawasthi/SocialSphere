import { getCurrentUser } from "@/lib/auth"
import { getNotifications, markAllNotificationsAsRead } from "@/lib/db"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, MessageCircle, UserPlus, AtSign, Check, Bell } from "lucide-react"
import Link from "next/link"

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="w-5 h-5 text-red-500" />
    case "comment":
      return <MessageCircle className="w-5 h-5 text-blue-500" />
    case "follow":
      return <UserPlus className="w-5 h-5 text-green-500" />
    case "mention":
      return <AtSign className="w-5 h-5 text-purple-500" />
    default:
      return <Heart className="w-5 h-5 text-gray-500" />
  }
}

const formatTimeAgo = (date: Date) => {
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return "now"
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays}d ago`

  const diffInWeeks = Math.floor(diffInDays / 7)
  return `${diffInWeeks}w ago`
}

export default async function NotificationsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const notifications = await getNotifications(user.id)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && <p className="text-sm text-gray-400">{unreadCount} new notifications</p>}
          </div>
          {unreadCount > 0 && (
            <form action={markAllNotificationsAsRead.bind(null, user.id)}>
              <Button
                type="submit"
                variant="outline"
                size="sm"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                <Check className="w-4 h-4 mr-2" />
                Mark all as read
              </Button>
            </form>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {notifications.length === 0 ? (
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No notifications yet</h3>
              <p className="text-gray-400">When someone likes, comments, or follows you, you'll see it here.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-1">
            {notifications.map((notification, index) => (
              <Card
                key={notification.id}
                className={`border-gray-700 hover:bg-gray-800 transition-all duration-200 animate-fade-in ${
                  notification.is_read ? "bg-gray-900" : "bg-gray-800/50"
                }`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {notification.related_user ? (
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={notification.related_user.avatar_url || "/placeholder.svg"} />
                            <AvatarFallback>{notification.related_user.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-white">
                          {notification.related_user && (
                            <Link
                              href={`/profile/${notification.related_user.username}`}
                              className="font-semibold hover:text-purple-400 transition-colors"
                            >
                              {notification.related_user.full_name}
                            </Link>
                          )}
                          <span className="ml-1">
                            {notification.message.replace(notification.related_user?.full_name || "", "").trim()}
                          </span>
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-400">
                            {formatTimeAgo(new Date(notification.created_at))}
                          </span>
                          {!notification.is_read && <div className="w-2 h-2 bg-purple-500 rounded-full"></div>}
                        </div>
                      </div>

                      {notification.related_post_id && (
                        <Link
                          href={`/post/${notification.related_post_id}`}
                          className="text-sm text-gray-400 hover:text-gray-300 transition-colors mt-1 block"
                        >
                          View post →
                        </Link>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
