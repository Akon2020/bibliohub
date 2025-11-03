"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { getUsers, setCurrentUser } from "@/lib/storage"
import { AlertCircle, BookOpen, Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("admin@bibliohub.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const users = getUsers()
      const user = users.find((u: any) => u.email === email && u.password === password)

      if (user) {
        setCurrentUser(user)
        router.push(user.role === "admin" ? "/admin/dashboard" : "/client/books")
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (err) {
      setError("Erreur lors de la connexion")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="w-12 h-12 text-white" />
            <h1 className="text-4xl font-bold text-white">BiblioHub</h1>
          </div>
          <p className="text-white text-lg">Système de Gestion de Bibliothèque</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-primary">Connexion</h2>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary mb-2">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Votre mot de passe"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          {/* Demo Info - Hidden */}
          {/* 
          <div className="pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">Comptes de démonstration :</p>
            <div className="space-y-2 text-xs text-muted-foreground">
              <p>
                <strong className="text-primary">Admin:</strong> admin@bibliohub.fr / admin123
              </p>
              <p className="text-muted-foreground/70">(Créez d'autres comptes abonnés dans l'interface admin)</p>
            </div>
          </div>
          */}
        </div>
      </div>
    </div>
  )
}
