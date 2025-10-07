import type { Todo } from '@prisma/client'
import type { CreateTodoInput, UpdateTodoInput } from '../validations/todo.validation'

export interface ITodoRepository {

  findAllByUserId(userId: number, page?: number, limit?: number): Promise<{ todos: Todo[], total: number }>

  findById(id: number): Promise<Todo | null>


  findByIdAndUserId(id: number, userId: number): Promise<Todo | null>


  create(data: CreateTodoInput, userId: number): Promise<Todo>

 
  update(id: number, data: UpdateTodoInput): Promise<Todo>

 
  delete(id: number): Promise<Todo>
}