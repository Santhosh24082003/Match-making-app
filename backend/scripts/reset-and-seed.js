/**
 * Clears customers + profiles in MongoDB and re-imports from local JSON files.
 *
 * Run: node scripts/reset-and-seed.js
 */

const dotenv = require('dotenv')
const mongoose = require('mongoose')

dotenv.config()

const { connectDatabase } = require('../src/config/database')
const { Customer, Profile } = require('../src/models')
const { loadCustomersFromJson, loadProfilesFromJson, prepareForMongoInsert } = require('../src/data/jsonLoader')

async function resetAndSeed() {
  await connectDatabase()

  const customers = prepareForMongoInsert(loadCustomersFromJson())
  const profiles = prepareForMongoInsert(loadProfilesFromJson())

  await Promise.all([
    Customer.deleteMany({}),
    Profile.deleteMany({}),
  ])

  await Customer.insertMany(customers)
  await Profile.insertMany(profiles)

  console.log(`[DateCrew] Cleared and seeded ${customers.length} customers from JSON.`)
  console.log(`[DateCrew] Cleared and seeded ${profiles.length} profiles from JSON.`)

  await mongoose.disconnect()
}

resetAndSeed().catch((error) => {
  console.error('Reset and seed failed:', error.message)
  process.exit(1)
})
