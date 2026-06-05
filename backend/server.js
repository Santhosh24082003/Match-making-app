const dotenv = require('dotenv')
const mongoose = require('mongoose')

const app = require('./src/app')
const { connectDatabase, ensureSeedData } = require('./src/config/database')

dotenv.config()

const PORT = process.env.PORT || 5000

async function start() {
    await connectDatabase()
    await ensureSeedData()

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
        console.log(`MongoDB state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`)
    })
}

start().catch((error) => {
    console.error('Failed to start server:', error.message)
    process.exit(1)
})