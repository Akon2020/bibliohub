"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { getBooks, getLoans, saveLoans, getCurrentUser } from "@/lib/storage"
import { BookOpen, ArrowLeft, Check, AlertCircle } from "lucide-react"

export default function BookDetailPage() {
  const router = useRouter()
  const params = useParams()
  const bookId = params.id as string

  const [book, setBook] = useState<any>(null)
  const [userLoans, setUserLoans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [borrowing, setBorrowing] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const books = getBooks()
    const foundBook = books.find((b: any) => b.id === bookId)
    setBook(foundBook)

    const currentUser = getCurrentUser()
    if (currentUser) {
      const allLoans = getLoans()
      const userSpecificLoans = allLoans.filter((l: any) => l.subscriberId === currentUser.id && l.status === "active")
      setUserLoans(userSpecificLoans)
    }

    setLoading(false)
  }, [bookId])

  const handleBorrow = () => {
    if (!book || book.availableCopies === 0) return

    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/auth/login")
      return
    }

    setBorrowing(true)

    try {
      // Update book availability
      const books = getBooks()
      const updatedBooks = books.map((b: any) =>
        b.id === bookId ? { ...b, availableCopies: b.availableCopies - 1 } : b,
      )

      // Create loan record
      const loans = getLoans()
      const newLoan = {
        id: Date.now().toString(),
        bookId,
        subscriberId: currentUser.id,
        loanDate: new Date().toISOString(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active",
      }

      saveLoans([...loans, newLoan])
      setMessage("Livre emprunté avec succès !")
      setBook({ ...book, availableCopies: book.availableCopies - 1 })

      setTimeout(() => {
        router.push("/client/loans")
      }, 1500)
    } catch (error) {
      setMessage("Erreur lors de l'emprunt du livre")
    } finally {
      setBorrowing(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Chargement...</div>
  }

  if (!book) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Livre non trouvé</p>
        <button onClick={() => router.back()} className="flex items-center gap-2 text-primary hover:text-primary/80">
          <ArrowLeft className="w-4 h-4" />
          Retour au catalogue
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </button>

      {/* Book Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Book Cover */}
        <div className="md:col-span-1">
          <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center sticky top-6">
            <BookOpen className="w-24 h-24 text-primary/40" />
          </div>
        </div>

        {/* Book Info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">{book.title}</h1>
            <p className="text-xl text-muted-foreground">{book.author}</p>
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {book.category}
            </span>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                book.availableCopies > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {book.availableCopies > 0
                ? `${book.availableCopies} disponible${book.availableCopies > 1 ? "s" : ""}`
                : "Indisponible"}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 bg-card rounded-lg p-6 border border-border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">ISBN</p>
              <p className="font-semibold text-foreground">{book.isbn}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total de copies</p>
              <p className="font-semibold text-foreground">{book.totalCopies}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">À propos de ce livre</h2>
            <p className="text-foreground leading-relaxed">{book.description}</p>
          </div>

          {/* Borrow Section */}
          <div className="space-y-4">
            {message && (
              <div
                className={`flex items-start gap-3 p-4 rounded-lg ${
                  message.includes("succès") ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}
              >
                {message.includes("succès") ? (
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                )}
                <p className={`text-sm ${message.includes("succès") ? "text-green-700" : "text-red-700"}`}>{message}</p>
              </div>
            )}

            <button
              onClick={handleBorrow}
              disabled={book.availableCopies === 0 || borrowing}
              className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                book.availableCopies === 0 || borrowing
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90 text-white"
              }`}
            >
              {borrowing ? "Emprunt en cours..." : "Emprunter ce livre"}
            </button>

            {book.availableCopies === 0 && (
              <p className="text-sm text-amber-600 text-center">
                Ce livre est actuellement indisponible. Vous pouvez demander une réservation auprès de la bibliothèque.
              </p>
            )}
          </div>

          {/* Loan Info */}
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
            <h3 className="font-semibold text-foreground mb-2">Conditions de prêt</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Durée de prêt : 30 jours</li>
              <li>• Renouvellement possible si aucune réservation</li>
              <li>• Amendes applicables en cas de retard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
