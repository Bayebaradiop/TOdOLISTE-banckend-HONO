import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

import { authRouter } from './routers/auth.router'
import { todoRouter } from './routers/todo.router'
import { authMiddleware } from './middlewares/auth.middleware'

const app = new Hono()

app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8080'],
  credentials: true,
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization']
}))


app.route('/api/auth', authRouter)

app.use('/api/todos/*', authMiddleware)

app.route('/api/todos', todoRouter)

app.notFound((c) => {
  return c.json({ error: 'Route not found' }, 404)
})

app.onError((err, c) => {
  console.error('Server error:', err)
  return c.json({
    success: false,
    error: 'Internal server error'
  }, 500)
})

export default app