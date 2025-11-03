# BiblioHub - Système de Gestion de Bibliothèque

Une application web moderne et complète pour la gestion d'une bibliothèque, avec interfaces dédiées pour l'administration et les abonnés.

## Fonctionnalités

### Interface Admin
- **Tableau de bord** : Visualisation des statistiques principales
- **Gestion des livres** : Ajouter, modifier, supprimer des livres avec suivi des copies disponibles
- **Gestion des abonnés** : Gérer les informations des abonnés
- **Gestion des prêts** : Enregistrer les prêts et retours de livres
- **Statistiques** : Rapports détaillés avec graphiques sur l'activité de la bibliothèque

### Interface Client/Abonné
- **Catalogue** : Recherche et filtrage des livres par titre, auteur ou catégorie
- **Détails du livre** : Informations complètes et emprunt direct
- **Mes emprunts** : Suivi des livres actuellement empruntés avec dates de retour
- **Mon compte** : Gestion du profil personnel avec historique des emprunts

## Accès à l'Application

### Compte de démo
- **Email** : admin@bibliohub.com
- **Mot de passe** : admin123
- **Rôle** : Administrateur

L'interface admin permet de créer de nouveaux abonnés qui pourront ensuite se connecter avec leurs propres comptes.

- **Email** : akonkwaushindi@gmail.com
- **Mot de passe** : admin123
- **Rôle** : Subscriber (abonné)

L'interface client permet aux abonnés  de faire des reservations des livres si leurs statuts est disponible.

## Stack Technologique

- **Framework** : Next.js 16 (App Router)
- **Interface utilisateur** : React 19 avec TypeScript
- **Styling** : Tailwind CSS v4 avec système de design tokens
- **Composants** : Recharts pour les graphiques
- **Icônes** : Lucide React
- **Stockage** : localStorage (peut être remplacé par une base de données)

## Structure du Projet

\`\`\`
app/
├── auth/
│   ├── login/
│   └── layout.tsx
├── admin/
│   ├── layout.tsx
│   ├── dashboard/
│   ├── books/
│   ├── subscribers/
│   ├── loans/
│   └── statistics/
├── client/
│   ├── layout.tsx
│   ├── books/
│   ├── loans/
│   └── profile/
├── globals.css
├── layout.tsx
└── page.tsx

components/
├── navbar.tsx
└── sidebar.tsx

lib/
├── types.ts
└── storage.ts
\`\`\`

## Points clés du design

- **Responsive** : Adapté aux écrans mobiles, tablettes et desktop
- **Accessibilité** : Respecte les normes WCAG avec sémantique HTML appropriée
- **Thème cohérent** : Palette de couleurs professionnelle et consistante
- **Performance** : Composants optimisés avec rendering côté client minimal

## Futures améliorations

- Intégration avec une base de données (PostgreSQL, MongoDB)
- Système d'authentification sécurisé (JWT, session)
- Notifications par email pour les prêts
- Réservations de livres
- Génération de rapports PDF
- Système de notation et avis
- API REST complète

## Installation et Utilisation

1. Le projet est basé sur Next.js 16 - installez avec le CLI shadcn
2. Toutes les données sont stockées en localStorage pour la démo
3. Déconnexion avec le bouton "Déconnexion" en haut à droite
4. L'admin peut gérer tous les contenus via le tableau de bord

## Licence

MIT
