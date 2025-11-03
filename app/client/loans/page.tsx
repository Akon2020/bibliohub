"use client"

import { useState, useEffect } from "react"
import { getLoans, getBooks, getCurrentUser } from "@/lib/storage"
import { Calendar, BookOpen, AlertCircle, CheckCircle } from "lucide-react"

export default function ClientLoansPage() {
  const [loans, setLoans] = useState<any[]>([])
  const [books, setBooks] = useState<any[]>([])

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (currentUser) {
      const allLoans = getLoans()
      const userLoans = allLoans.filter((l: any) => l.subscriberId === currentUser.id)
      setLoans(userLoans)
    }
    setBooks(getBooks())
  }, [])

  const getBookTitle = (bookId: string) => {
    return books.find((b) => b.id === bookId)?.title || "Livre non trouvé"
  }

  const getBookAuthor = (bookId: string) => {
    return books.find((b) => b.id === bookId)?.author || ""
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && new Date()
  }

  const daysUntilDue = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 3600 * 24))
  }

  const activeLoans = loans.filter((l) => l.status === "active")
  const returnedLoans = loans.filter((l) => l.status === "returned")

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Mes emprunts</h1>
        <p className="text-muted-foreground mt-1">Suivez vos livres empruntés</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Prêts actifs</p>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{activeLoans.length}</p>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Livres retournés</p>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{returnedLoans.length}</p>
        </div>

        <div className="bg-card rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-muted-foreground">Total emprunts</p>
            <Calendar className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-bold text-foreground">{loans.length}</p>
        </div>
      </div>

      {/* Active Loans */}
      {activeLoans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Prêts en cours</h2>
          <div className="space-y-4">
            {activeLoans.map((loan) => {
              const daysLeft = daysUntilDue(loan.dueDate)
              const isLate = isOverdue(loan.dueDate)

              return (
                <div key={loan.id} className="bg-card rounded-lg p-6 border border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{getBookTitle(loan.bookId)}</h3>
                      <p className="text-sm text-muted-foreground">{getBookAuthor(loan.bookId)}</p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                        isLate
                          ? "bg-red-100 text-red-700"
                          : daysLeft <= 5
                            ? "bg-amber-100 text-amber-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isLate ? `${Math.abs(daysLeft)} jours de retard` : `${daysLeft} jours`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                    <div>
                      <p className="text-muted-foreground mb-1">Date de prêt</p>
                      <p className="font-medium text-foreground">
                        {new Date(loan.loanDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Date de retour</p>
                      <p className={`font-medium ${isLate ? "text-red-600" : "text-foreground"}`}>
                        {new Date(loan.dueDate).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>

                  {isLate && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                      <p className="text-xs text-red-700">
                        Ce livre est en retard. Veuillez le retourner dès que possible pour éviter les amendes.
                      </p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* No Active Loans */}
      {activeLoans.length === 0 && (
        <div className="bg-card rounded-lg p-12 border border-border text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground/40 mx-auto mb-4" />
          <p className="text-muted-foreground">Vous n'avez pas de prêts en cours</p>
          <a
            href="/client/books"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Découvrir le catalogue
          </a>
        </div>
      )}

      {/* Returned Loans */}
      {returnedLoans.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Historique de prêts</h2>
          <div className="bg-card rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Livre</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Auteur</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Retourné le</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {returnedLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">{getBookTitle(loan.bookId)}</td>
                    <td className="px-6 py-4 text-muted-foreground">{getBookAuthor(loan.bookId)}</td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {loan.returnDate ? new Date(loan.returnDate).toLocaleDateString("fr-FR") : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
