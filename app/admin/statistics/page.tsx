"use client"

import { useState, useEffect } from "react"
import { getBooks, getSubscribers, getLoans } from "@/lib/storage"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown } from "lucide-react"

export default function StatisticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const books = getBooks()
    const subscribers = getSubscribers()
    const loans = getLoans()

    // Calculate statistics
    const loansByCategory = books.reduce((acc: any, book: any) => {
      const existing = acc.find((item: any) => item.name === book.category)
      if (existing) {
        existing.value += 1
      } else {
        acc.push({ name: book.category, value: 1 })
      }
      return acc
    }, [])

    const loansByStatus = [
      { name: "En cours", value: loans.filter((l: any) => l.status === "active").length },
      { name: "Retournés", value: loans.filter((l: any) => l.status === "returned").length },
      { name: "En retard", value: loans.filter((l: any) => l.status === "overdue").length },
    ]

    const availabilityData = [
      { name: "Disponibles", value: books.reduce((sum: number, b: any) => sum + b.availableCopies, 0) },
      { name: "Empruntés", value: books.reduce((sum: number, b: any) => sum + (b.totalCopies - b.availableCopies), 0) },
    ]

    const subscriberTrend = [
      { month: "Jan", count: Math.max(1, subscribers.length - 5) },
      { month: "Fév", count: Math.max(1, subscribers.length - 3) },
      { month: "Mar", count: Math.max(1, subscribers.length - 1) },
      { month: "Avr", count: subscribers.length },
    ]

    setStats({
      loansByCategory,
      loansByStatus,
      availabilityData,
      subscriberTrend,
      totalBooks: books.length,
      totalSubscribers: subscribers.length,
      totalLoans: loans.length,
      activeLoans: loans.filter((l: any) => l.status === "active").length,
      avgBooksPerSubscriber: (loans.length / Math.max(1, subscribers.length)).toFixed(2),
    })
  }, [])

  if (!stats) {
    return <div className="text-center py-12">Chargement...</div>
  }

  const COLORS = ["#1f2937", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistiques et Rapports</h1>
        <p className="text-muted-foreground mt-1">Analyse des activités de la bibliothèque</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Total des livres</h3>
            <TrendingUp className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.totalBooks}</div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Abonnés actifs</h3>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.totalSubscribers}</div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Prêts actifs</h3>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.activeLoans}</div>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground">Moy. prêts/abonné</h3>
            <TrendingDown className="w-5 h-5 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.avgBooksPerSubscriber}</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Livres par catégorie */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Livres par catégorie</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.loansByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Statut des prêts */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Statut des prêts</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.loansByStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Disponibilité des livres */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Disponibilité des livres</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.availabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => `${entry.name}: ${entry.value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {["#10b981", "#ef4444"].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Tendance des abonnés */}
        <div className="bg-card rounded-lg p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Tendance des abonnés</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.subscriberTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
              />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ fill: "#3b82f6", r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Report */}
      <div className="bg-card rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold text-foreground mb-4">Résumé du rapport</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          <div>
            <p className="text-muted-foreground mb-2">Total des opérations</p>
            <p className="text-2xl font-bold text-foreground">{stats.totalLoans}</p>
            <p className="text-xs text-muted-foreground mt-1">prêts enregistrés</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Taux de disponibilité</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.availabilityData.length > 0
                ? (
                    (stats.availabilityData[0].value /
                      (stats.availabilityData[0].value + stats.availabilityData[1].value)) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </p>
            <p className="text-xs text-muted-foreground mt-1">copies disponibles</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-2">Engagement</p>
            <p className="text-2xl font-bold text-foreground">
              {stats.totalSubscribers > 0 ? ((stats.activeLoans / stats.totalSubscribers) * 100).toFixed(0) : 0}%
            </p>
            <p className="text-xs text-muted-foreground mt-1">d'abonnés actifs</p>
          </div>
        </div>
      </div>
    </div>
  )
}
