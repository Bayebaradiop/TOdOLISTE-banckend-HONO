// Export de toutes les interfaces
export type { ITodoRepository } from './todo.repository.interface'
export type { IUserRepository } from './user.repository.interface'
export type { ITodoService } from './todo.service.interface'
export type { IAuthService } from './auth.service.interface'

// Types communs pour les réponses API
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T = any> {
  todos: T[]
  total: number
  page: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Types pour les contextes Hono
export interface AuthenticatedContext {
  userId: number
}