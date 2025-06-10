import { getCurrentUser } from "@/lib/auth"
import { getUserByUsername, getPostsByUserId, isFollowing } from "@/lib/db"
import { notFound, redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PostCard } from "@/components/post-card"
import { toggleFollowAction } from "@/app/actions/posts"
import { MapPin, Calendar, LinkIcon, MoreHorizontal } from "lucide-react"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const currentUser = await getCurrentUser()

  if (!currentUser) {
    redirect("/auth/login")
  }

  const profileUser = await getUserByUsername(params.username)

  if (!profileUser) {
    notFound()
  }

  const userPosts = await getPostsByUserId(profileUser.id, currentUser.id)
  const isOwnProfile = currentUser.id === profileUser.id
  const following = !isOwnProfile ? await isFollowing(currentUser.id, profileUser.id) : false

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold">{profileUser.full_name}</h1>
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="relative">
          {/* Cover Image */}
          <div className="h-48 bg-gradient-to-r from-purple-900 to-pink-900"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex items-end justify-between -mt-16 mb-4">
              <Avatar className="w-32 h-32 ring-4 ring-black">
                <AvatarImage src={profileUser.avatar_url || "/placeholder.svg"} />
                <AvatarFallback className="text-2xl">{profileUser.full_name[0]}</AvatarFallback>
              </Avatar>

              {!isOwnProfile && (
                <form action={toggleFollowAction.bind(null, profileUser.id)}>
                  <Button
                    type="submit"
                    className={`transition-all duration-200 ${
                      following ? "bg-gray-600 hover:bg-gray-700 text-white" : "bg-purple-600 hover:bg-purple-700"
                    }`}
                  >
                    {following ? "Following" : "Follow"}
                  </Button>
                </form>
              )}

              {isOwnProfile && (
                <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                  Edit Profile
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold">{profileUser.full_name}</h1>
                  {profileUser.is_verified && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
                <p className="text-gray-400">@{profileUser.username}</p>
              </div>

              {profileUser.bio && <p className="text-white leading-relaxed">{profileUser.bio}</p>}

              <div className="flex items-center space-x-4 text-gray-400 text-sm">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center space-x-1">
                  <LinkIcon className="w-4 h-4" />
                  <span className="text-purple-400">portfolio.com</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Joined{" "}
                    {new Date(profileUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </span>
                </div>
              </div>

              <div className="flex space-x-6 text-sm">
                <div>
                  <span className="font-bold text-white">{profileUser.following_count.toLocaleString()}</span>
                  <span className="text-gray-400 ml-1">Following</span>
                </div>
                <div>
                  <span className="font-bold text-white">{profileUser.follower_count.toLocaleString()}</span>
                  <span className="text-gray-400 ml-1">Followers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Navigation */}
        <div className="border-b border-gray-800">
          <div className="flex space-x-8 px-6">
            <Button variant="ghost" className="border-b-2 border-purple-500 text-purple-400 rounded-none px-0 py-4">
              Posts ({profileUser.post_count})
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white rounded-none px-0 py-4">
              Replies
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white rounded-none px-0 py-4">
              Media
            </Button>
            <Button variant="ghost" className="text-gray-400 hover:text-white rounded-none px-0 py-4">
              Likes
            </Button>
          </div>
        </div>

        {/* Posts */}
        <div className="p-6 space-y-6">
          {userPosts.length > 0 ? (
            userPosts.map((post, index) => <PostCard key={post.id} post={post} index={index} />)
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">No posts yet</p>
              {isOwnProfile && <p className="text-gray-500 mt-2">Share your first post to get started!</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
