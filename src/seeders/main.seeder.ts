#!/usr/bin/env tsx

/**
 * Seeder principal - Rassemble tous les seeders en un seul
 * Usage: npm run seed [type]
 * Types: all (défaut), users, todos, clean
 */

import bcrypt from 'bcrypt'
import { prisma } from '../prisma/client'

interface UserSeed {
  email: string
  password: string
}

interface TodoSeed {
  title: string
  description?: string
  completed: boolean
}

export class MainSeeder {
  // Données des utilisateurs
  private readonly users: UserSeed[] = [
    {
      email: 'admin@example.com',
      password: 'admin123'
    },
    {
      email: 'john.doe@example.com',
      password: 'password123'
    },
    {
      email: 'jane.smith@example.com',
      password: 'password123'
    },
    {
      email: 'alice.johnson@example.com',
      password: 'password123'
    },
    {
      email: 'bob.wilson@example.com',
      password: 'password123'
    }
  ]

  // Templates des todos
  private readonly todoTemplates: TodoSeed[] = [
    {
      title: 'Acheter du pain',
      description: 'Aller à la boulangerie du quartier avant 18h',
      completed: false
    },
    {
      title: 'Faire les courses',
      description: 'Acheter des légumes, du lait et des œufs',
      completed: true
    },
    {
      title: 'Rendez-vous médecin',
      description: 'Consultation annuelle chez le médecin généraliste',
      completed: false
    },
    {
      title: 'Réviser pour l\'examen',
      description: 'Revoir les chapitres 5 à 8 du cours de mathématiques',
      completed: false
    },
    {
      title: 'Nettoyer la maison',
      description: 'Passer l\'aspirateur et faire la poussière',
      completed: true
    },
    {
      title: 'Appeler maman',
      description: 'Prendre des nouvelles et organiser le repas du dimanche',
      completed: false
    },
    {
      title: 'Réparation vélo',
      description: 'Amener le vélo chez le réparateur pour changer la chaîne',
      completed: false
    },
    {
      title: 'Lecture du livre',
      description: 'Finir "Le Petit Prince" d\'Antoine de Saint-Exupéry',
      completed: true
    },
    {
      title: 'Sport - Jogging',
      description: 'Courir 5km dans le parc, objectif sous 30 minutes',
      completed: false
    },
    {
      title: 'Payer les factures',
      description: 'Régler électricité, eau et internet',
      completed: true
    },
    {
      title: 'Préparation présentation',
      description: 'Finaliser les slides pour la réunion de demain',
      completed: false
    },
    {
      title: 'Arroser les plantes',
      description: 'Arroser toutes les plantes d\'intérieur et du balcon',
      completed: false
    }
  ]

  /**
   * Seed complet - Utilisateurs + Todos
   */
  async seedAll(): Promise<void> {
    console.log('🚀 Starting complete database seeding...')
    console.log('=' .repeat(50))

    try {
      await this.seedUsers()
      console.log('')
      await this.seedTodos()
      console.log('')
      await this.showSummary()

      console.log('=' .repeat(50))
      console.log('✅ Complete database seeding finished successfully!')
    } catch (error) {
      console.error('❌ Error during complete seeding:', error)
      throw error
    }
  }

  /**
   * Seed uniquement les utilisateurs
   */
  async seedUsers(): Promise<void> {
    console.log('🌱 Seeding users...')

    // Supprimer les utilisateurs existants
    await prisma.user.deleteMany()
    console.log('🗑️ Existing users deleted')

    // Créer les nouveaux utilisateurs
    for (const userData of this.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 12)
      
      await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword
        }
      })
      
      console.log(`✅ User created: ${userData.email}`)
    }

    console.log(`🎉 ${this.users.length} users seeded successfully!`)
  }

  /**
   * Seed uniquement les todos
   */
  async seedTodos(): Promise<void> {
    console.log('🌱 Seeding todos...')

    // Récupérer tous les utilisateurs
    const users = await prisma.user.findMany()
    
    if (users.length === 0) {
      console.log('❌ No users found. Please seed users first.')
      return
    }

    // Supprimer les todos existants
    await prisma.todo.deleteMany()
    console.log('🗑️ Existing todos deleted')

    let totalTodos = 0

    // Créer des todos pour chaque utilisateur
    for (const user of users) {
      // Nombre aléatoire de todos par utilisateur (entre 3 et 8)
      const todoCount = Math.floor(Math.random() * 6) + 3
      const userTodos = this.getRandomTodos(todoCount)

      for (const todoData of userTodos) {
        await prisma.todo.create({
          data: {
            title: todoData.title,
            description: todoData.description,
            completed: todoData.completed,
            userId: user.id
          }
        })
        totalTodos++
      }

      console.log(`✅ ${todoCount} todos created for user: ${user.email}`)
    }

    console.log(`🎉 ${totalTodos} todos seeded successfully!`)
  }

  /**
   * Nettoyer toute la base de données
   */
  async clean(): Promise<void> {
    console.log('🧹 Cleaning database...')
    
    await prisma.todo.deleteMany()
    console.log('🗑️ All todos deleted')
    
    await prisma.user.deleteMany()
    console.log('🗑️ All users deleted')
    
    console.log('✅ Database cleaned successfully!')
  }

  /**
   * Afficher un résumé des données
   */
  private async showSummary(): Promise<void> {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    })

    const todoStats = await this.getTodoStats()

    console.log('📊 SEEDING SUMMARY')
    console.log('-' .repeat(30))
    console.log(`👥 Users: ${users.length}`)
    console.log(`📝 Total Todos: ${todoStats.total}`)
    console.log(`✅ Completed: ${todoStats.completed}`)
    console.log(`⏳ Pending: ${todoStats.pending}`)
    console.log('')

    console.log('👥 Created Users:')
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.email} (ID: ${user.id})`)
    })
  }

  /**
   * Obtenir des todos aléatoires
   */
  private getRandomTodos(count: number): TodoSeed[] {
    const shuffled = [...this.todoTemplates].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  /**
   * Obtenir les statistiques des todos
   */
  private async getTodoStats() {
    const total = await prisma.todo.count()
    const completed = await prisma.todo.count({ where: { completed: true } })
    const pending = total - completed

    return {
      total,
      completed,
      pending
    }
  }
}

// Fonction principale d'exécution
async function runMainSeeder(type: 'all' | 'users' | 'todos' | 'clean' = 'all') {
  const seeder = new MainSeeder()

  console.log('🌱 Hono Todo API - Main Database Seeder')
  console.log(`📅 ${new Date().toLocaleString()}`)
  console.log(`🎯 Type: ${type}`)
  console.log('')

  try {
    switch (type) {
      case 'users':
        await seeder.seedUsers()
        break
      case 'todos':
        await seeder.seedTodos()
        break
      case 'clean':
        await seeder.clean()
        break
      case 'all':
      default:
        await seeder.seedAll()
        break
    }
  } catch (error) {
    console.error('❌ Main seeding failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Exécuter le script si lancé directement
async function main() {
  const args = process.argv.slice(2)
  const type = (args[0] as 'all' | 'users' | 'todos' | 'clean') || 'all'
  await runMainSeeder(type)
}

// Point d'entrée
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Main seeder execution failed:', error)
    process.exit(1)
  })
}

export { runMainSeeder }
export default MainSeeder