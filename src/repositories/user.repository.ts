import { prisma } from '../prisma/client'
import type { User } from '@prisma/client'
import type { IUserRepository } from '../interfaces/user.repository.interface'

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    })
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    })
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    return await prisma.user.create({
      data: {
        email,
        password: hashedPassword
      }
    })
  }
}