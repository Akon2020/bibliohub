"use client"

import { useRouter } from "next/navigation"
import { getCurrentUser, setCurrentUser } from "@/lib/storage"
import { BookOpen, LogOut, User } from "lucide-react"

export default function Navbar({ title }: { title: string }) {
  const router = useRouter()
  const user = getCurrentUser()

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/auth/login")
  }

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8" />
          <div>
            <div className="text-xl font-bold">BiblioHub</div>
            <div className="text-xs text-primary-foreground/70">{title}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5" />
            <span className="text-sm">{user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 px-4 py-2 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  )
}
