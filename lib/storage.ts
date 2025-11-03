// Mock storage for the library system (replace with real DB)

const STORAGE_KEYS = {
  USERS: "library_users",
  BOOKS: "library_books",
  SUBSCRIBERS: "library_subscribers",
  LOANS: "library_loans",
  CURRENT_USER: "library_current_user",
}

export const initializeStorage = () => {
  const existingUsers = localStorage.getItem(STORAGE_KEYS.USERS)
  if (!existingUsers) {
    const defaultAdmin = {
      id: "1",
      email: "admin@bibliohub.com",
      name: "Administrateur",
      role: "admin" as const,
      password: "admin123",
      createdAt: new Date().toISOString(),
    }
    const defaultSubscriber = {
      id: "1",
      email: "akonkwaushindi@gmail.com",
      name: "Isaac Akonkwa",
      role: "subscriber" as const,
      password: "admin@123",
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify([defaultAdmin, defaultSubscriber]))
  }

  const existingBooks = localStorage.getItem(STORAGE_KEYS.BOOKS)
  if (!existingBooks) {
    const defaultBooks = [
      {
        id: "1",
        title: "Le Seigneur des Anneaux",
        author: "J.R.R. Tolkien",
        isbn: "978-2-253-05922-4",
        category: "Fantastique",
        description: "L'histoire épique de Frodon et de sa quête pour détruire l'anneau unique.",
        totalCopies: 3,
        availableCopies: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Les Misérables",
        author: "Victor Hugo",
        isbn: "978-2-07-036566-2",
        category: "Classique",
        description: "Un chef-d'œuvre de la littérature française.",
        totalCopies: 2,
        availableCopies: 1,
        createdAt: new Date().toISOString(),
      },
      {
        id: "3",
        title: "1984",
        author: "George Orwell",
        isbn: "978-2-07-032495-1",
        category: "Science-fiction",
        description: "Un roman dystopique fascinant sur un régime totalitaire.",
        totalCopies: 2,
        availableCopies: 2,
        createdAt: new Date().toISOString(),
      },
      {
        id: "4",
        title: "Orgueil et Préjugés",
        author: "Jane Austen",
        isbn: "978-2-07-031904-2",
        category: "Romance",
        description: "Un roman d'amour et de mariage en Angleterre regencienne.",
        totalCopies: 3,
        availableCopies: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: "5",
        title: "Fondation",
        author: "Isaac Asimov",
        isbn: "978-2-07-032459-3",
        category: "Science-fiction",
        description: "Le début d'une saga épique de science-fiction.",
        totalCopies: 2,
        availableCopies: 1,
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(defaultBooks))
  }

  const existingSubscribers = localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS)
  if (!existingSubscribers) {
    const defaultSubscribers = [
      {
        id: "1",
        name: "Isaac Akonkwa",
        email: "akonkwaushindi@gmail.com",
        phone: "+243 970 137 369",
        address: "258, Patrice Emery Lumumba, Bukavu",
        membershipDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "2",
        name: "Destin Biringanine",
        email: "destinbaseme@gmail.com",
        phone: "+243 987 654 321",
        address: "Avenue Maison, Bukavu",
        membershipDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "3",
        name: "Chrispin Mihigo",
        email: "chrispinmihigo@gmail.com",
        phone: "+243 123 456 789",
        address: "Avenue Travail, Bukavu",
        membershipDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
      {
        id: "4",
        name: "MiRCo Rubambura",
        email: "mircorubambura4@gmail.com",
        phone: "+243 998 877 665",
        address: "Avenue Mulindwa, Bukavu",
        membershipDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
        status: "active" as const,
      },
    ]
    localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(defaultSubscribers))
  }

  const existingLoans = localStorage.getItem(STORAGE_KEYS.LOANS)
  if (!existingLoans) {
    localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify([]))
  }
}

export const getUsers = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || "[]")
export const getBooks = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.BOOKS) || "[]")
export const getSubscribers = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.SUBSCRIBERS) || "[]")
export const getLoans = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.LOANS) || "[]")

export const saveUsers = (users: any) => localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
export const saveBooks = (books: any) => localStorage.setItem(STORAGE_KEYS.BOOKS, JSON.stringify(books))
export const saveSubscribers = (subscribers: any) =>
  localStorage.setItem(STORAGE_KEYS.SUBSCRIBERS, JSON.stringify(subscribers))
export const saveLoans = (loans: any) => localStorage.setItem(STORAGE_KEYS.LOANS, JSON.stringify(loans))

export const getCurrentUser = () => JSON.parse(localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || "null")
export const setCurrentUser = (user: any) => {
  if (user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
  }
}
