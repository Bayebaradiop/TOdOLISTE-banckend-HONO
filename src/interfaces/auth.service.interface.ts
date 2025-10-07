import type { User } from '@prisma/client'
import type { RegisterInput, LoginInput } from '../validations/auth.validation'

export interface IAuthService {

  register(data: RegisterInput): Promise<{ user: Omit<User, 'password'>, token: string }>

 
  login(data: LoginInput): Promise<{ user: Omit<User, 'password'>, token: string }>


  generateToken(userId: number): string

  
  verifyToken(token: string): { userId: number }
}