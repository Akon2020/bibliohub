"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, BookMarked, Users, BarChart3, ShoppingCart, User } from "lucide-react"
import { getCurrentUser } from "@/lib/storage"

export default function Sidebar() {
  const pathname = usePathname()
  const user = getCurrentUser()

  const adminLinks = [
    { label: "Tableau de bord", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Gestion des livres", href: "/admin/books", icon: BookMarked },
    { label: "Gestion des abonnés", href: "/admin/subscribers", icon: Users },
    { label: "Gestion des prêts", href: "/admin/loans", icon: ShoppingCart },
    { label: "Statistiques", href: "/admin/statistics", icon: BarChart3 },
  ]

  const clientLinks = [
    { label: "Catalogue", href: "/client/books", icon: BookMarked },
    { label: "Mes emprunts", href: "/client/loans", icon: ShoppingCart },
    { label: "Mon compte", href: "/client/profile", icon: User },
  ]

  const links = user?.role === "admin" ? adminLinks : clientLinks
  const isActive = (href: string) => pathname.startsWith(href)

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-primary mb-8">Menu</h2>
        <nav className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(link.href) ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-background"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
