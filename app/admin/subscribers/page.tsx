"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getSubscribers, saveSubscribers } from "@/lib/storage"
import { Pencil, Trash2, Plus, Search, X } from "lucide-react"
import type { Subscriber } from "@/lib/types"

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  })

  useEffect(() => {
    const loadedSubscribers = getSubscribers()
    setSubscribers(loadedSubscribers)
    setFilteredSubscribers(loadedSubscribers)
  }, [])

  useEffect(() => {
    const filtered = subscribers.filter(
      (sub) =>
        sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredSubscribers(filtered)
  }, [searchQuery, subscribers])

  const handleAddSubscriber = () => {
    setEditingId(null)
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
    })
    setShowModal(true)
  }

  const handleEditSubscriber = (sub: Subscriber) => {
    setEditingId(sub.id)
    setFormData({
      name: sub.name,
      email: sub.email,
      phone: sub.phone,
      address: sub.address,
    })
    setShowModal(true)
  }

  const handleDeleteSubscriber = (id: string) => {
    const updatedSubscribers = subscribers.filter((s) => s.id !== id)
    setSubscribers(updatedSubscribers)
    saveSubscribers(updatedSubscribers)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      const updatedSubscribers = subscribers.map((s) => (s.id === editingId ? { ...s, ...formData } : s))
      setSubscribers(updatedSubscribers)
      saveSubscribers(updatedSubscribers)
    } else {
      const newSubscriber: Subscriber = {
        id: Date.now().toString(),
        ...formData,
        membershipDate: new Date().toISOString(),
        status: "active",
      }
      const updatedSubscribers = [...subscribers, newSubscriber]
      setSubscribers(updatedSubscribers)
      saveSubscribers(updatedSubscribers)
    }

    setShowModal(false)
  }

  const getStatusBadge = (status: string) => {
    return status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des abonnés</h1>
          <p className="text-muted-foreground mt-1">Gérez les informations des abonnés</p>
        </div>
        <button
          onClick={handleAddSubscriber}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Ajouter un abonné
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un abonné..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Subscribers Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Nom</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Téléphone</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Membre depuis</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredSubscribers.map((sub) => (
              <tr key={sub.id} className="hover:bg-background transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{sub.name}</td>
                <td className="px-6 py-4 text-muted-foreground">{sub.email}</td>
                <td className="px-6 py-4 text-muted-foreground">{sub.phone}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(sub.status)}`}
                  >
                    {sub.status === "active" ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(sub.membershipDate).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditSubscriber(sub)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteSubscriber(sub.id)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredSubscribers.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">Aucun abonné trouvé</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {editingId ? "Modifier l'abonné" : "Ajouter un abonné"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-background rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nom complet</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Téléphone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Adresse</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
                >
                  {editingId ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
