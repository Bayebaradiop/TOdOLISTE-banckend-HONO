import type { Todo } from '@prisma/client'
import type { CreateTodoInput, UpdateTodoInput } from '../validations/todo.validation'

export interface ITodoService {
 
  getTodos(userId: number, page?: number, limit?: number): Promise<{
    todos: Todo[]
    total: number
    page: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }>


  createTodo(data: CreateTodoInput, userId: number): Promise<Todo>

 
  updateTodo(id: number, data: UpdateTodoInput, userId: number): Promise<Todo>

  deleteTodo(id: number, userId: number): Promise<Todo>
}