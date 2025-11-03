export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "subscriber"
  password: string
  createdAt: string
}

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  category: string
  description: string
  totalCopies: number
  availableCopies: number
  image?: string
  createdAt: string
}

export interface Subscriber {
  id: string
  name: string
  email: string
  phone: string
  address: string
  membershipDate: string
  status: "active" | "inactive"
}

export interface Loan {
  id: string
  bookId: string
  subscriberId: string
  loanDate: string
  dueDate: string
  returnDate?: string
  status: "active" | "returned" | "overdue"
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
