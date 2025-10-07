import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { UserRepository } from '../repositories/user.repository'
import type { RegisterInput, LoginInput } from '../validations/auth.validation'
import type { User } from '@prisma/client'
import type { IAuthService } from '../interfaces/auth.service.interface'

export class AuthService implements IAuthService {
  private userRepository: UserRepository
  private jwtSecret: string
  private jwtExpiresIn: string

  constructor() {
    this.userRepository = new UserRepository()
    this.jwtSecret = process.env.JWT_SECRET || 'fallback-secret'
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d'
  }

  async register(data: RegisterInput): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(data.email)
    if (existingUser) {
      throw new Error('User already exists with this email')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12)

    // Create user
    const user = await this.userRepository.create(data.email, hashedPassword)

    // Generate token
    const token = this.generateToken(user.id)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  }

  async login(data: LoginInput): Promise<{ user: Omit<User, 'password'>, token: string }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(data.email)
    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(data.password, user.password)
    if (!isPasswordValid) {
      throw new Error('Invalid email or password')
    }

    // Generate token
    const token = this.generateToken(user.id)

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return { user: userWithoutPassword, token }
  }

  generateToken(userId: number): string {
    return jwt.sign({ userId }, this.jwtSecret, { expiresIn: this.jwtExpiresIn } as any)
  }

  verifyToken(token: string): { userId: number } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: number }
      return decoded
    } catch (error) {
      throw new Error('Invalid or expired token')
    }
  }
}