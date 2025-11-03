"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, initializeStorage } from "@/lib/storage"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    initializeStorage()
    const currentUser = getCurrentUser()

    if (currentUser) {
      if (currentUser.role === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/client/books")
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-4">BiblioHub</div>
        <div className="text-text-muted">Chargement...</div>
      </div>
    </div>
  )
}
