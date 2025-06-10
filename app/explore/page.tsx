import { getCurrentUser } from "@/lib/auth"
import { getPosts, getTrendingHashtags, searchUsers } from "@/lib/db"
import { redirect } from "next/navigation"
import { PostCard } from "@/components/post-card"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { TrendingUp, Users, Hash, Star } from "lucide-react"
import Link from "next/link"

export default async function ExplorePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const posts = await getPosts(20, 0, user.id)
  const trendingHashtags = await getTrendingHashtags()
  const featuredUsers = await searchUsers("") // Get popular users

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold">Explore</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Trending Topics */}
          <Card className="bg-gray-900 border-gray-700 mb-8 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Trending Now</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingHashtags.map((trend, index) => (
                  <div
                    key={trend.tag}
                    className="p-4 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Hash className="w-4 h-4 text-purple-400" />
                      <p className="font-semibold text-purple-400">{trend.tag}</p>
                    </div>
                    <p className="text-sm text-gray-400">{trend.posts}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Users */}
          <Card className="bg-gray-900 border-gray-700 mb-8 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Star className="w-5 h-5 text-yellow-400" />
                <h2 className="text-xl font-bold text-white">Featured Creators</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {featuredUsers.slice(0, 4).map((featuredUser, index) => (
                  <div
                    key={featuredUser.id}
                    className="flex items-center space-x-3 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-all duration-200 animate-slide-up"
                    style={{ animationDelay: `${(index + 3) * 100}ms` }}
                  >
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={featuredUser.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback>{featuredUser.full_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-1">
                        <p className="font-semibold text-white">{featuredUser.full_name}</p>
                        {featuredUser.is_verified && (
                          <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs">✓</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">@{featuredUser.username}</p>
                      <p className="text-sm text-gray-400">{featuredUser.follower_count.toLocaleString()} followers</p>
                    </div>
                    <Link href={`/profile/${featuredUser.username}`}>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Discover Posts */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center">
              <Users className="w-5 h-5 mr-2 text-purple-400" />
              Discover Posts
            </h2>
            {posts.map((post, index) => (
              <PostCard key={post.id} post={post} index={index} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 p-6 hidden lg:block">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4 text-white">Popular Categories</h3>
              <div className="space-y-3">
                {[
                  { name: "Technology", count: "2.1M posts", color: "bg-blue-500" },
                  { name: "Design", count: "1.8M posts", color: "bg-purple-500" },
                  { name: "Photography", count: "1.5M posts", color: "bg-pink-500" },
                  { name: "Travel", count: "1.2M posts", color: "bg-green-500" },
                  { name: "Food", count: "980K posts", color: "bg-yellow-500" },
                ].map((category, index) => (
                  <div
                    key={category.name}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200 animate-slide-in-right"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <div className="flex-1">
                      <p className="font-medium text-white">{category.name}</p>
                      <p className="text-sm text-gray-400">{category.count}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
