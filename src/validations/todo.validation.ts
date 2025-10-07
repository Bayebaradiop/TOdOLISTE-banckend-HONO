import { z } from 'zod'

export const createTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().optional()
})

export const updateTodoSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional()
})

export const todoQuerySchema = z.object({
  page: z.string().optional().transform((val: string | undefined) => val ? parseInt(val, 10) : 1),
  limit: z.string().optional().transform((val: string | undefined) => val ? parseInt(val, 10) : 50)
})

export type CreateTodoInput = z.infer<typeof createTodoSchema>
export type UpdateTodoInput = z.infer<typeof updateTodoSchema>
export type TodoQueryInput = z.infer<typeof todoQuerySchema>