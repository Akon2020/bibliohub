"use client"

import { useState, useEffect } from "react"
import { getBooks } from "@/lib/storage"
import { Search, BookOpen, ChevronRight } from "lucide-react"
import Link from "next/link"

export default function ClientBooksPage() {
  const [books, setBooks] = useState<any[]>([])
  const [filteredBooks, setFilteredBooks] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    const loadedBooks = getBooks()
    setBooks(loadedBooks)
    setFilteredBooks(loadedBooks)

    const uniqueCategories = [...new Set(loadedBooks.map((b: any) => b.category))]
    setCategories(uniqueCategories as string[])
  }, [])

  useEffect(() => {
    let filtered = books

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter((book) => book.category === selectedCategory)
    }

    setFilteredBooks(filtered)
  }, [searchQuery, selectedCategory, books])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Catalogue de livres</h1>
        <p className="text-muted-foreground mt-1">Découvrez notre collection de livres</p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Rechercher un livre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary bg-background text-foreground"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map((book) => (
          <Link
            key={book.id}
            href={`/client/books/${book.id}`}
            className="group bg-card rounded-lg border border-border overflow-hidden hover:border-primary hover:shadow-lg transition-all"
          >
            {/* Book Cover */}
            <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-colors">
              <BookOpen className="w-12 h-12 text-primary/40 group-hover:text-primary/60 transition-colors" />
            </div>

            {/* Book Info */}
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {book.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  {book.category}
                </span>
                <span
                  className={`text-xs font-semibold ${book.availableCopies > 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {book.availableCopies > 0 ? `${book.availableCopies} disponible` : "Indisponible"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                <span className="text-sm font-semibold">Voir détails</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Aucun livre trouvé</p>
        </div>
      )}
    </div>
  )
}
