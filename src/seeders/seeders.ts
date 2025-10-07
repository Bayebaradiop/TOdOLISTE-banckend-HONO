// Export du seeder principal unifié
export { default as MainSeeder, runMainSeeder } from './main.seeder'

// Export des types pour utilisation externe
export interface SeederOptions {
  type: 'all' | 'users' | 'todos' | 'clean'
  verbose?: boolean
}