import { serve } from '@hono/node-server'
import app from './routes'

const port = parseInt(process.env.PORT || '3000', 10)
console.log(`   - Root: http://localhost:${port}/`)
serve({
  fetch: app.fetch,
  port
})