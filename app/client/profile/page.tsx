"use client"

import { useState, useEffect } from "react"
import { getCurrentUser, getSubscribers, getLoans, setCurrentUser } from "@/lib/storage"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, MapPin, Calendar, LogOut, Edit2, Save, X } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [subscriber, setSubscriber] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({ name: "", email: "", phone: "", address: "" })
  const [loans, setLoans] = useState<any[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    if (currentUser) {
      const subscribers = getSubscribers()
      const userSubscriber = subscribers.find((s: any) => s.email === currentUser.email)
      setSubscriber(userSubscriber)

      if (userSubscriber) {
        setEditData({
          name: userSubscriber.name,
          email: userSubscriber.email,
          phone: userSubscriber.phone,
          address: userSubscriber.address,
        })
      }

      const allLoans = getLoans()
      const userLoans = allLoans.filter((l: any) => l.subscriberId === currentUser.id)
      setLoans(userLoans)
    }
  }, [])

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/auth/login")
  }

  const handleSaveProfile = () => {
    // In a real app, this would update the subscriber data
    setIsEditing(false)
  }

  if (!user || !subscriber) {
    return <div className="text-center py-12">Chargement...</div>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mon profil</h1>
        <p className="text-muted-foreground mt-1">Gérez vos informations personnelles</p>
      </div>

      {/* Profile Card */}
      <div className="bg-card rounded-lg border border-border p-8">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{subscriber.name}</h2>
              <p className="text-muted-foreground">
                Abonné depuis {new Date(subscriber.membershipDate).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors text-foreground"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Nom complet</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Adresse</label>
                <textarea
                  value={editData.address}
                  onChange={(e) => setEditData({ ...editData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  rows={3}
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveProfile}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Enregistrer
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-background transition-colors"
                >
                  <X className="w-4 h-4" />
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nom complet</p>
                    <p className="font-semibold text-foreground">{subscriber.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-semibold text-foreground">{subscriber.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Téléphone</p>
                    <p className="font-semibold text-foreground">{subscriber.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-muted-foreground">Membre depuis</p>
                    <p className="font-semibold text-foreground">
                      {new Date(subscriber.membershipDate).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-2 flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Adresse</p>
                    <p className="font-semibold text-foreground">{subscriber.address}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="mt-6 flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Modifier le profil
              </button>
            </>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Prêts totals</p>
          <p className="text-3xl font-bold text-foreground">{loans.length}</p>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Prêts actifs</p>
          <p className="text-3xl font-bold text-foreground">{loans.filter((l) => l.status === "active").length}</p>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Prêts retournés</p>
          <p className="text-3xl font-bold text-foreground">{loans.filter((l) => l.status === "returned").length}</p>
        </div>
      </div>
    </div>
  )
}
