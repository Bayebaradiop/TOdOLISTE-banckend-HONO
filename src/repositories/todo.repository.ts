import { prisma } from '../prisma/client'
import type { Todo } from '@prisma/client'
import type { CreateTodoInput, UpdateTodoInput } from '../validations/todo.validation'
import type { ITodoRepository } from '../interfaces/todo.repository.interface'

export class TodoRepository implements ITodoRepository {
  async findAllByUserId(userId: number, page: number = 1, limit: number = 50): Promise<{ todos: Todo[], total: number }> {
    const skip = (page - 1) * limit
    
    const [todos, total] = await Promise.all([
      prisma.todo.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.todo.count({
        where: { userId }
      })
    ])

    return { todos, total }
  }

  async findById(id: number): Promise<Todo | null> {
    return await prisma.todo.findUnique({
      where: { id }
    })
  }

  async findByIdAndUserId(id: number, userId: number): Promise<Todo | null> {
    return await prisma.todo.findFirst({
      where: { id, userId }
    })
  }

  async create(data: CreateTodoInput, userId: number): Promise<Todo> {
    return await prisma.todo.create({
      data: {
        ...data,
        userId
      }
    })
  }

  async update(id: number, data: UpdateTodoInput): Promise<Todo> {
    return await prisma.todo.update({
      where: { id },
      data
    })
  }

  async delete(id: number): Promise<Todo> {
    return await prisma.todo.delete({
      where: { id }
    })
  }
}