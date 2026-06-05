const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const { MongoMemoryServer } = require('mongodb-memory-server')

const { Customer, Profile, MatchmakerUser, MatchNote, MatchSend } = require('../models')
const { buildSeedData } = require('../data/seedData')

let inMemoryServer = null

const legacyMatchmakerUsername = 'matchmaker@datecrew.com'
const activeMatchmakerUsername = 'sathosh@onlinematch.com'

async function connectDatabase() {
  const connectionUri = process.env.MONGODB_URI

  if (connectionUri) {
    await mongoose.connect(connectionUri, {
      dbName: process.env.MONGODB_DB || 'datecrew_mvp',
    })
    return
  }

  inMemoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: process.env.MONGODB_DB || 'datecrew_mvp',
    },
  })

  await mongoose.connect(inMemoryServer.getUri(), {
    dbName: process.env.MONGODB_DB || 'datecrew_mvp',
  })

  console.warn('[DateCrew] MONGODB_URI is missing. Using in-memory MongoDB for local development.')
}

async function ensureSeedData() {
  await Promise.all([
    Customer.updateMany({ assignedTo: legacyMatchmakerUsername }, { $set: { assignedTo: activeMatchmakerUsername } }),
    Profile.updateMany({ assignedTo: legacyMatchmakerUsername }, { $set: { assignedTo: activeMatchmakerUsername } }),
    MatchNote.updateMany({ matchmakerUsername: legacyMatchmakerUsername }, { $set: { matchmakerUsername: activeMatchmakerUsername } }),
    MatchSend.updateMany({ sentByUsername: legacyMatchmakerUsername }, { $set: { sentByUsername: activeMatchmakerUsername } }),
  ])

  const [userCount, customerCount, profileCount] = await Promise.all([
    MatchmakerUser.countDocuments(),
    Customer.countDocuments(),
    Profile.countDocuments(),
  ])

  if (userCount === 0) {
    const passwordHash = await bcrypt.hash('match123', 10)
    await MatchmakerUser.create({
      username: 'sathosh@onlinematch.com',
      passwordHash,
      displayName: 'santhosh',
      role: 'matchmaker',
    })
  }

  if (customerCount === 0 || profileCount === 0) {
    const seed = buildSeedData()

    if (customerCount === 0) {
      await Customer.insertMany(seed.customers)
    }

    if (profileCount === 0) {
      await Profile.insertMany(seed.profiles)
    }
  }
}

module.exports = {
  connectDatabase,
  ensureSeedData,
}