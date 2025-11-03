"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getLoans, saveLoans, getBooks, getSubscribers } from "@/lib/storage"
import { Trash2, Plus, Search, X } from "lucide-react"
import type { Loan } from "@/lib/types"

export default function LoansPage() {
  const [loans, setLoans] = useState<Loan[]>([])
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [books, setBooks] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [formData, setFormData] = useState({
    bookId: "",
    subscriberId: "",
    returnDate: "",
  })

  useEffect(() => {
    const loadedLoans = getLoans()
    setLoans(loadedLoans)
    setFilteredLoans(loadedLoans)
    setBooks(getBooks())
    setSubscribers(getSubscribers())
  }, [])

  useEffect(() => {
    const filtered = loans.filter((loan) => {
      const book = books.find((b) => b.id === loan.bookId)
      const subscriber = subscribers.find((s) => s.id === loan.subscriberId)
      return (
        book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false ||
        subscriber?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        false
      )
    })
    setFilteredLoans(filtered)
  }, [searchQuery, loans, books, subscribers])

  const handleAddLoan = () => {
    setFormData({ bookId: "", subscriberId: "", returnDate: "" })
    setShowModal(true)
  }

  const handleReturnLoan = (id: string) => {
    const updatedLoans = loans.map((l) =>
      l.id === id ? { ...l, status: "returned", returnDate: new Date().toISOString() } : l,
    )
    setLoans(updatedLoans)
    saveLoans(updatedLoans)
  }

  const handleDeleteLoan = (id: string) => {
    const updatedLoans = loans.filter((l) => l.id !== id)
    setLoans(updatedLoans)
    saveLoans(updatedLoans)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dueDate = formData.returnDate
      ? new Date(formData.returnDate).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

    const newLoan: Loan = {
      id: Date.now().toString(),
      bookId: formData.bookId,
      subscriberId: formData.subscriberId,
      loanDate: new Date().toISOString(),
      dueDate: dueDate,
      status: "active",
    }

    const updatedLoans = [...loans, newLoan]
    setLoans(updatedLoans)
    saveLoans(updatedLoans)
    setShowModal(false)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-700"
      case "returned":
        return "bg-green-100 text-green-700"
      case "overdue":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getBookTitle = (id: string) => books.find((b) => b.id === id)?.title || "Inconnu"
  const getSubscriberName = (id: string) => subscribers.find((s) => s.id === id)?.name || "Inconnu"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des prêts</h1>
          <p className="text-muted-foreground mt-1">Enregistrez et suivez les prêts</p>
        </div>
        <button
          onClick={handleAddLoan}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Ajouter un prêt
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un prêt..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Loans Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Livre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Abonné</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date prêt</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date retour prévue</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Statut</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredLoans.map((loan) => (
              <tr key={loan.id} className="hover:bg-background transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{getBookTitle(loan.bookId)}</td>
                <td className="px-6 py-4 text-muted-foreground">{getSubscriberName(loan.subscriberId)}</td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(loan.loanDate).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(loan.dueDate).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(loan.status)}`}
                  >
                    {loan.status === "active" ? "En cours" : loan.status === "returned" ? "Retourné" : "Retard"}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {loan.status === "active" && (
                      <button
                        onClick={() => handleReturnLoan(loan.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                      >
                        Retour
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteLoan(loan.id)}
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

        {filteredLoans.length === 0 && <div className="p-12 text-center text-muted-foreground">Aucun prêt trouvé</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">Enregistrer un prêt</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-background rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Livre</label>
                <select
                  value={formData.bookId}
                  onChange={(e) => setFormData({ ...formData, bookId: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Sélectionner un livre</option>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.title} ({b.availableCopies} disponible{b.availableCopies !== 1 ? "s" : ""})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Abonné</label>
                <select
                  value={formData.subscriberId}
                  onChange={(e) => setFormData({ ...formData, subscriberId: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Sélectionner un abonné</option>
                  {subscribers.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Date prévue de retour</label>
                <input
                  type="date"
                  value={formData.returnDate}
                  onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  min={new Date().toISOString().split("T")[0]}
                />
                <p className="text-xs text-muted-foreground mt-1">Laissez vide pour 30 jours par défaut</p>
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
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
