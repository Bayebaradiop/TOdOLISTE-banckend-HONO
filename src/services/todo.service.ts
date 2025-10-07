import { TodoRepository } from '../repositories/todo.repository'
import type { Todo } from '@prisma/client'
import type { CreateTodoInput, UpdateTodoInput } from '../validations/todo.validation'
import type { ITodoService } from '../interfaces/todo.service.interface'

export class TodoService implements ITodoService {
  private todoRepository: TodoRepository

  constructor() {
    this.todoRepository = new TodoRepository()
  }

  async getTodos(userId: number, page: number = 1, limit: number = 50): Promise<{
    todos: Todo[],
    total: number,
    page: number,
    totalPages: number,
    hasNext: boolean,
    hasPrev: boolean
  }> {
    const { todos, total } = await this.todoRepository.findAllByUserId(userId, page, limit)
    const totalPages = Math.ceil(total / limit)

    return {
      todos,
      total,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  }

  async getTodoById(id: number, userId: number): Promise<Todo> {
    const todo = await this.todoRepository.findByIdAndUserId(id, userId)
    if (!todo) {
      throw new Error('Todo not found or does not belong to user')
    }
    return todo
  }

  async createTodo(data: CreateTodoInput, userId: number): Promise<Todo> {
    return await this.todoRepository.create(data, userId)
  }

  async updateTodo(id: number, data: UpdateTodoInput, userId: number): Promise<Todo> {
    const existingTodo = await this.todoRepository.findByIdAndUserId(id, userId)
    if (!existingTodo) {
      throw new Error('Todo not found or does not belong to user')
    }

    return await this.todoRepository.update(id, data)
  }

  async deleteTodo(id: number, userId: number): Promise<Todo> {
    const existingTodo = await this.todoRepository.findByIdAndUserId(id, userId)
    if (!existingTodo) {
      throw new Error('Todo not found or does not belong to user')
    }

    return await this.todoRepository.delete(id)
  }
}