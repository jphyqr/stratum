// app/_layers/pages/AdminPage/types.ts
export interface User {
    id: string
    name: string
    email: string
    role: "admin" | "user"
    status: "active" | "suspended"
    createdAt: string
  }
  
  export interface PageInfo {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
  
  export interface SearchParams {
    page?: string
    search?: string
    status?: string
    role?: string
  }