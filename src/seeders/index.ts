#!/usr/bin/env tsx

/**
 * Script d'exécution du seeder principal
 * Usage: npm run seed [type]
 * Types: all (défaut), users, todos, clean
 */

import { runMainSeeder } from './main.seeder'

async function main() {
  const args = process.argv.slice(2)
  const type = (args[0] as 'all' | 'users' | 'todos' | 'clean') || 'all'
  await runMainSeeder(type)
}

// Exécuter le script
main().catch((error) => {
  console.error('❌ Main seeder execution failed:', error)
  process.exit(1)
})