"use client"

import { useState, useEffect } from "react"
import { Book, Users, BookMarked, TrendingUp } from "lucide-react"
import { getBooks, getSubscribers, getLoans } from "@/lib/storage"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCopies: 0,
    availableCopies: 0,
    subscribers: 0,
    activeLoans: 0,
    overdueLoans: 0,
  })

  useEffect(() => {
    const books = getBooks()
    const subscribers = getSubscribers()
    const loans = getLoans()

    const totalCopies = books.reduce((sum: number, b: any) => sum + b.totalCopies, 0)
    const availableCopies = books.reduce((sum: number, b: any) => sum + b.availableCopies, 0)
    const activeLoans = loans.filter((l: any) => l.status === "active").length
    const overdueLoans = loans.filter((l: any) => l.status === "overdue").length

    setStats({
      totalBooks: books.length,
      totalCopies,
      availableCopies,
      subscribers: subscribers.length,
      activeLoans,
      overdueLoans,
    })
  }, [])

  const StatCard = ({ icon: Icon, label, value, color }: any) => (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <Icon className={`w-8 h-8 ${color}`} />
        <span className="text-sm text-muted-foreground">Stats</span>
      </div>
      <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-1">Vue d'ensemble de votre bibliothèque</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={Book} label="Titres de livres" value={stats.totalBooks} color="text-blue-600" />
        <StatCard icon={BookMarked} label="Copies disponibles" value={stats.availableCopies} color="text-green-600" />
        <StatCard icon={Book} label="Total de copies" value={stats.totalCopies} color="text-purple-600" />
        <StatCard icon={Users} label="Abonnés actifs" value={stats.subscribers} color="text-orange-600" />
        <StatCard icon={TrendingUp} label="Prêts actifs" value={stats.activeLoans} color="text-teal-600" />
        <StatCard icon={TrendingUp} label="Prêts en retard" value={stats.overdueLoans} color="text-red-600" />
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Accès rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/admin/books"
            className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="font-semibold text-foreground mb-1">Gestion des livres</div>
            <p className="text-sm text-muted-foreground">Ajouter, modifier ou supprimer des livres</p>
          </a>
          <a
            href="/admin/subscribers"
            className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="font-semibold text-foreground mb-1">Gestion des abonnés</div>
            <p className="text-sm text-muted-foreground">Gérer les informations des abonnés</p>
          </a>
          <a
            href="/admin/loans"
            className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="font-semibold text-foreground mb-1">Gestion des prêts</div>
            <p className="text-sm text-muted-foreground">Enregistrer prêts et retours</p>
          </a>
          <a
            href="/admin/statistics"
            className="p-4 bg-background rounded-lg border border-border hover:border-primary transition-colors"
          >
            <div className="font-semibold text-foreground mb-1">Statistiques</div>
            <p className="text-sm text-muted-foreground">Consulter les rapports</p>
          </a>
        </div>
      </div>
    </div>
  )
}
