import { serve } from '@hono/node-server'
import app from './routes'

const port = parseInt(process.env.PORT || '3000', 10)

console.log(`🚀 Hono Todo API Server`)
console.log(`📍 Port: ${port}`)
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
console.log(`📖 API Endpoints:`)
console.log(`   - Root: http://localhost:${port}/`)
console.log(`   - Health: http://localhost:${port}/api/health`)
console.log(`   - Info: http://localhost:${port}/api/info`) 
console.log(`   - Auth: http://localhost:${port}/api/auth/*`)
console.log(`   - Todos: http://localhost:${port}/api/todos/*`)
console.log(`🎯 Ready to handle requests!`)
console.log('')

serve({
  fetch: app.fetch,
  port
})