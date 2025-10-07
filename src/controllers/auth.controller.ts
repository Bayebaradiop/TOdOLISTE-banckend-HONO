import type { Context } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import { AuthService } from '../services/auth.service'
import { registerSchema, loginSchema } from '../validations/auth.validation'

export class AuthController {
  private authService: AuthService

  constructor() {
    this.authService = new AuthService()
  }

  register = async (c: Context) => {
    try {
      const body = await c.req.json()
      
      // Validate input
      const validatedData = registerSchema.parse(body)

      // Register user
      const { user, token } = await this.authService.register(validatedData)

      // Set http-only cookie
      setCookie(c, 'auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
      })

      return c.json({
        success: true,
        message: 'User registered successfully',
        data: { user }
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
        error: 'Registration failed'
      }, 500)
    }
  }

  login = async (c: Context) => {
    try {
      const body = await c.req.json()
      
      // Validate input
      const validatedData = loginSchema.parse(body)

      // Login user
      const { user, token } = await this.authService.login(validatedData)

      // Set http-only cookie
      setCookie(c, 'auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days in seconds
      })

      return c.json({
        success: true,
        message: 'Login successful',
        data: { user }
      })
    } catch (error) {
      if (error instanceof Error) {
        return c.json({
          success: false,
          error: error.message
        }, 401)
      }
      return c.json({
        success: false,
        error: 'Login failed'
      }, 500)
    }
  }

  logout = async (c: Context) => {
    try {
      // Delete the auth cookie
      deleteCookie(c, 'auth-token')

      return c.json({
        success: true,
        message: 'Logged out successfully'
      })
    } catch (error) {
      return c.json({
        success: false,
        error: 'Logout failed'
      }, 500)
    }
  }
}