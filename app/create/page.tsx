import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreatePost } from "@/components/create-post"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Video, Mic, Calendar, MapPin, Users } from "lucide-react"

export default async function CreatePage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold">Create</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Create Post */}
          <div className="lg:col-span-2">
            <CreatePost user={user} />

            {/* Post Types */}
            <Card className="bg-gray-900 border-gray-700 mt-6 animate-fade-in">
              <CardHeader>
                <CardTitle className="text-white">What would you like to create?</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-600 text-white hover:bg-gray-800"
                >
                  <ImageIcon className="w-6 h-6 text-purple-400" />
                  <span>Photo Post</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-600 text-white hover:bg-gray-800"
                >
                  <Video className="w-6 h-6 text-blue-400" />
                  <span>Video Post</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-600 text-white hover:bg-gray-800"
                >
                  <Mic className="w-6 h-6 text-green-400" />
                  <span>Audio Post</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 border-gray-600 text-white hover:bg-gray-800"
                >
                  <Users className="w-6 h-6 text-pink-400" />
                  <span>Poll</span>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-700 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Calendar className="w-4 h-4 mr-3" />
                  Schedule Post
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <MapPin className="w-4 h-4 mr-3" />
                  Add Location
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
                >
                  <Users className="w-4 h-4 mr-3" />
                  Tag People
                </Button>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="bg-gray-900 border-gray-700 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle className="text-white">Tips for Great Posts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-400">
                <p>• Use relevant hashtags to reach more people</p>
                <p>• Add images or videos to increase engagement</p>
                <p>• Ask questions to encourage comments</p>
                <p>• Post consistently to build your audience</p>
                <p>• Engage with others' content too</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
