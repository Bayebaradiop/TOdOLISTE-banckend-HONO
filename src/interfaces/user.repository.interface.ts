import type { User } from '@prisma/client'

export interface IUserRepository {

  findByEmail(email: string): Promise<User | null>


  findById(id: number): Promise<User | null>

 
  create(email: string, hashedPassword: string): Promise<User>
}