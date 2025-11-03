"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import { getCurrentUser } from "@/lib/storage"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    if (!user || user.role !== "admin") {
      router.push("/auth/login")
    }
  }, [router])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar title="Administration" />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-background p-6">{children}</main>
      </div>
    </div>
  )
}
