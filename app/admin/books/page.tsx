"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { getBooks, saveBooks } from "@/lib/storage"
import { Pencil, Trash2, Plus, Search, X } from "lucide-react"
import type { Book } from "@/lib/types"

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    description: "",
    totalCopies: 1,
  })

  useEffect(() => {
    const loadedBooks = getBooks()
    setBooks(loadedBooks)
    setFilteredBooks(loadedBooks)
  }, [])

  useEffect(() => {
    const filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredBooks(filtered)
  }, [searchQuery, books])

  const handleAddBook = () => {
    setEditingId(null)
    setFormData({
      title: "",
      author: "",
      isbn: "",
      category: "",
      description: "",
      totalCopies: 1,
    })
    setShowModal(true)
  }

  const handleEditBook = (book: Book) => {
    setEditingId(book.id)
    setFormData({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      category: book.category,
      description: book.description,
      totalCopies: book.totalCopies,
    })
    setShowModal(true)
  }

  const handleDeleteBook = (id: string) => {
    const updatedBooks = books.filter((b) => b.id !== id)
    setBooks(updatedBooks)
    saveBooks(updatedBooks)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingId) {
      const updatedBooks = books.map((b) => (b.id === editingId ? { ...b, ...formData } : b))
      setBooks(updatedBooks)
      saveBooks(updatedBooks)
    } else {
      const newBook: Book = {
        id: Date.now().toString(),
        ...formData,
        availableCopies: formData.totalCopies,
        createdAt: new Date().toISOString(),
      }
      const updatedBooks = [...books, newBook]
      setBooks(updatedBooks)
      saveBooks(updatedBooks)
    }

    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des livres</h1>
          <p className="text-muted-foreground mt-1">Gérez votre catalogue de livres</p>
        </div>
        <button
          onClick={handleAddBook}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-3 rounded-lg transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          Ajouter un livre
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
        <input
          type="text"
          placeholder="Rechercher un livre..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Books Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Titre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Auteur</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Catégorie</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Disponibles</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Total</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredBooks.map((book) => (
              <tr key={book.id} className="hover:bg-background transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{book.title}</td>
                <td className="px-6 py-4 text-muted-foreground">{book.author}</td>
                <td className="px-6 py-4 text-muted-foreground">{book.category}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {book.availableCopies}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{book.totalCopies}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEditBook(book)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteBook(book.id)}
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

        {filteredBooks.length === 0 && <div className="p-12 text-center text-muted-foreground">Aucun livre trouvé</div>}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-lg max-w-md w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">
                {editingId ? "Modifier le livre" : "Ajouter un livre"}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-background rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Titre</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Auteur</label>
                <input
                  type="text"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">ISBN</label>
                <input
                  type="text"
                  value={formData.isbn}
                  onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Catégorie</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Nombre de copies</label>
                <input
                  type="number"
                  min="1"
                  value={formData.totalCopies}
                  onChange={(e) => setFormData({ ...formData, totalCopies: Number.parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary"
                  required
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
