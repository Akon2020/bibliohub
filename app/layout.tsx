import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "BiblioHub - Gestion de Bibliothèque",
  description: "Système de gestion d'une bibliothèque",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="font-sans">{children}</body>
    </html>
  )
}
