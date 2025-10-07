import type { Context } from 'hono'
import { TodoService } from '../services/todo.service'
import { createTodoSchema, updateTodoSchema, todoQuerySchema } from '../validations/todo.validation'

export class TodoController {
  private todoService: TodoService

  constructor() {
    this.todoService = new TodoService()
  }

  getTodos = async (c: Context) => {
    try {
      const userId = c.get('userId') as number
      const query = c.req.query()
      
      // Validate query parameters
      const { page, limit } = todoQuerySchema.parse(query)

      // Get todos
      const result = await this.todoService.getTodos(userId, page, limit)

      return c.json({
        success: true,
        data: result
      })
    } catch (error) {
      if (error instanceof Error) {
        return c.json({
          success: false,
          error: error.message
        }, 400)
      }
      return c.json({
        success: false,
        error: 'Failed to get todos'
      }, 500)
    }
  }

  getTodoById = async (c: Context) => {
    try {
      const userId = c.get('userId') as number
      const id = parseInt(c.req.param('id'))

      if (isNaN(id)) {
        return c.json({
          success: false,
          error: 'Invalid todo ID'
        }, 400)
      }

      // Get todo by ID
      const todo = await this.todoService.getTodoById(id, userId)

      return c.json({
        success: true,
        data: { todo }
      })
    } catch (error) {
      if (error instanceof Error) {
        return c.json({
          success: false,
          error: error.message
        }, error.message.includes('not found') ? 404 : 400)
      }
      return c.json({
        success: false,
        error: 'Failed to get todo'
      }, 500)
    }
  }

  createTodo = async (c: Context) => {
    try {
      const userId = c.get('userId') as number
      const body = await c.req.json()
      
      // Validate input
      const validatedData = createTodoSchema.parse(body)

      // Create todo
      const todo = await this.todoService.createTodo(validatedData, userId)

      return c.json({
        success: true,
        message: 'Todo created successfully',
        data: { todo }
      }, 201)
    } catch (error) {
      if (error instanceof Error) {
        return c.json({
          success: false,
          error: error.message
        }, 400)
      }
      return c.json({
        success: false,
        error: 'Failed to create todo'
      }, 500)
    }
  }

  updateTodo = async (c: Context) => {
    try {
      const userId = c.get('userId') as number
      const id = parseInt(c.req.param('id'))
      const body = await c.req.json()
      
      // Validate input
      const validatedData = updateTodoSchema.parse(body)

      // Update todo
      const todo = await this.todoService.updateTodo(id, validatedData, userId)

      return c.json({
        success: true,
        message: 'Todo updated successfully',
        data: { todo }
      })
    } catch (error) {
      if (error instanceof Error) {
        return c.json({
          success: false,
          error: error.message
        }, error.message.includes('not found') ? 404 : 400)
      }
      return c.json({
        success: false,
        error: 'Failed to update todo'
      }, 500)
    }
  }

  deleteTodo = async (c: Context) => {
    try {
      const userId = c.get('userId') as number
      const id = parseInt(c.req.param('id'))

      // Delete todo
      await this.todoService.deleteTodo(id, userId)

      return c.json({
        success: true,
        message: 'Todo deleted successfully'
      })
    } catch (error) {
      if (error instanceof Error) {
        return c.json({
          success: false,
          error: error.message
        }, error.message.includes('not found') ? 404 : 400)
      }
      return c.json({
        success: false,
        error: 'Failed to delete todo'
      }, 500)
    }
  }
}