import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { User, Bell, Shield, Palette, Globe, Lock, Eye, Mail, Smartphone, Download, Trash2 } from "lucide-react"

export default async function SettingsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900 border-gray-700 sticky top-24">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {[
                    { icon: User, label: "Profile", id: "profile" },
                    { icon: Bell, label: "Notifications", id: "notifications" },
                    { icon: Shield, label: "Privacy", id: "privacy" },
                    { icon: Palette, label: "Appearance", id: "appearance" },
                    { icon: Globe, label: "Language", id: "language" },
                  ].map((item) => (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-start text-left hover:bg-gray-800 transition-all duration-200 ${
                        item.id === "profile" ? "bg-gray-800 text-purple-400" : "text-gray-300"
                      }`}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Profile Settings */}
            <Card className="bg-gray-900 border-gray-700 animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-purple-400" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xl">{user.full_name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                      Change Photo
                    </Button>
                    <p className="text-sm text-gray-400 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-300">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      defaultValue={user.full_name}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-300">
                      Username
                    </Label>
                    <Input
                      id="username"
                      defaultValue={user.username}
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={user.email}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-gray-300">
                    Bio
                  </Label>
                  <Textarea
                    id="bio"
                    defaultValue={user.bio || ""}
                    placeholder="Tell us about yourself..."
                    className="bg-gray-800 border-gray-600 text-white resize-none"
                    rows={3}
                  />
                </div>

                <Button className="bg-purple-600 hover:bg-purple-700">Save Changes</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="bg-gray-900 border-gray-700 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="w-5 h-5 text-purple-400" />
                  <span>Notification Preferences</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Email notifications", description: "Receive notifications via email", icon: Mail },
                  {
                    label: "Push notifications",
                    description: "Receive push notifications on your device",
                    icon: Smartphone,
                  },
                  {
                    label: "Like notifications",
                    description: "Get notified when someone likes your posts",
                    icon: Bell,
                  },
                  {
                    label: "Comment notifications",
                    description: "Get notified when someone comments on your posts",
                    icon: Bell,
                  },
                  { label: "Follow notifications", description: "Get notified when someone follows you", icon: Bell },
                ].map((setting, index) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <setting.icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">{setting.label}</p>
                        <p className="text-sm text-gray-400">{setting.description}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={index < 3} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-gray-900 border-gray-700 animate-fade-in" style={{ animationDelay: "400ms" }}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>Privacy & Security</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Private account", description: "Only approved followers can see your posts", icon: Lock },
                  { label: "Show online status", description: "Let others see when you're online", icon: Eye },
                  {
                    label: "Allow message requests",
                    description: "Receive messages from people you don't follow",
                    icon: Mail,
                  },
                  { label: "Show in search results", description: "Allow others to find you in search", icon: Globe },
                ].map((setting, index) => (
                  <div
                    key={setting.label}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <setting.icon className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-white font-medium">{setting.label}</p>
                        <p className="text-sm text-gray-400">{setting.description}</p>
                      </div>
                    </div>
                    <Switch defaultChecked={index === 1 || index === 2} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="bg-gray-900 border-gray-700 animate-fade-in" style={{ animationDelay: "600ms" }}>
              <CardHeader>
                <CardTitle className="text-white">Account Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start border-gray-600 text-white hover:bg-gray-800">
                  <Download className="w-4 h-4 mr-3" />
                  Download your data
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-3" />
                  Delete account
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
