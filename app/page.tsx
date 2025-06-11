import { getCurrentUser } from "@/lib/auth"
import { getPosts, getTrendingHashtags, getSuggestedUsers, getStories } from "@/lib/db"
import { redirect } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { CreatePost } from "@/components/create-post"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Mail, Home, Compass, PlusSquare, User, Settings } from "lucide-react"
import { logoutAction } from "./actions/auth"
import Link from "next/link"
import { StorySection } from "@/components/story-section"

export default async function SocialSphere() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch data in parallel for better performance
  const [posts, trendingHashtags, suggestedUsers, stories] = await Promise.all([
    getPosts(10, 0, user.id),
    getTrendingHashtags(),
    getSuggestedUsers(user.id),
    getStories(user.id),
  ])

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              SocialSphere
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/notifications">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
              >
                <Bell className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/messages">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
              >
                <Mail className="w-5 h-5" />
              </Button>
            </Link>
            <form action={logoutAction}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
              >
                Logout
              </Button>
            </form>
            <Link href={`/profile/${user.username}`}>
              <Avatar className="w-8 h-8 ring-2 ring-purple-500 ring-offset-2 ring-offset-black cursor-pointer">
                <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                <AvatarFallback>{user.full_name[0]}</AvatarFallback>
              </Avatar>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Sidebar */}
        <aside className="w-64 p-6 hidden lg:block">
          <nav className="space-y-2">
            {[
              { icon: Home, label: "Home", id: "home", href: "/" },
              { icon: Compass, label: "Explore", id: "explore", href: "/explore" },
              { icon: PlusSquare, label: "Create", id: "create", href: "/create" },
              { icon: User, label: "Profile", id: "profile", href: `/profile/${user.username}` },
              { icon: Settings, label: "Settings", id: "settings", href: "/settings" },
            ].map((item, index) => (
              <Link key={item.id} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start text-left hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 text-gray-300 ${
                    item.id === "home" ? "bg-gray-800 text-purple-400" : ""
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-2xl mx-auto p-6">
          {/* Stories */}
          {stories.length > 0 && <StorySection stories={stories} />}

          {/* Create Post */}
          <CreatePost user={user} />

          {/* Posts Feed */}
          <div className="space-y-6">
            {posts.length > 0 ? (
              posts.map((post, index) => <PostCard key={post.id} post={post} index={index} />)
            ) : (
              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-12 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">No posts yet</h3>
                  <p className="text-gray-400">Be the first to share something!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 p-6 hidden xl:block">
          {/* Trending */}
          {trendingHashtags.length > 0 && (
            <Card className="bg-gray-900 border-gray-700 mb-6 animate-fade-in">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Trending Now</h3>
                <div className="space-y-3">
                  {trendingHashtags.map((trend, index) => (
                    <div
                      key={trend.tag}
                      className="cursor-pointer hover:bg-gray-800 p-2 rounded-lg transition-all duration-200 animate-slide-in-right"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <p className="font-medium text-purple-400">{trend.tag}</p>
                      <p className="text-sm text-gray-400">{trend.posts}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Suggested Users */}
          {suggestedUsers.length > 0 && (
            <Card className="bg-gray-900 border-gray-700 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 text-white">Suggested for You</h3>
                <div className="space-y-4">
                  {suggestedUsers.map((suggestedUser, index) => (
                    <div
                      key={suggestedUser.id}
                      className="flex items-center justify-between animate-slide-in-right"
                      style={{ animationDelay: `${(index + 3) * 100}ms` }}
                    >
                      <Link href={`/profile/${suggestedUser.username}`} className="flex items-center space-x-3 flex-1">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={suggestedUser.avatar_url || "/placeholder.svg"} />
                          <AvatarFallback>{suggestedUser.full_name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-white">{suggestedUser.full_name}</p>
                          <p className="text-sm text-gray-400">{suggestedUser.mutual} mutual connections</p>
                        </div>
                      </Link>
                      <Button
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 transition-all duration-200 transform hover:scale-105"
                      >
                        Follow
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-800 px-4 py-2">
        <div className="flex justify-around">
          {[
            { icon: Home, id: "home", href: "/" },
            { icon: Compass, id: "explore", href: "/explore" },
            { icon: PlusSquare, id: "create", href: "/create" },
            { icon: Bell, id: "notifications", href: "/notifications" },
            { icon: User, id: "profile", href: `/profile/${user.username}` },
          ].map((item) => (
            <Link key={item.id} href={item.href}>
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-200 transform hover:scale-110 ${
                  item.id === "home" ? "text-purple-400" : "text-gray-400"
                }`}
              >
                <item.icon className="w-6 h-6" />
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  )
}
