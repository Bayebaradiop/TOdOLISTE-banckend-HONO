import type { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { AuthService } from '../services/auth.service'

export const authMiddleware = async (c: Context, next: Next) => {
  try {
    // Get token from cookie
    const token = getCookie(c, 'auth-token')
    
    if (!token) {
      return c.json({ error: 'Authentication token required' }, 401)
    }

    // Verify token
    const authService = new AuthService()
    const { userId } = authService.verifyToken(token)

    // Add userId to context
    c.set('userId', userId)

    await next()
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
}