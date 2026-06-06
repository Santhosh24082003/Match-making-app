const dotenv = require('dotenv')
const mongoose = require('mongoose')

const app = require('./src/app')
const { connectDatabase, ensureSeedData } = require('./src/config/database')
const { getDataSourceMode } = require('./src/data/dataSource')

dotenv.config()

const PORT = process.env.PORT || 5000

async function start() {
    await connectDatabase()
    await ensureSeedData()

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
        console.log(`MongoDB state: ${mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'}`)
        console.log(`Data source: ${getDataSourceMode()} (set DATA_SOURCE=json or DATA_SOURCE=mongodb in .env)`)
    })
}

start().catch((error) => {
    console.error('Failed to start server:', error.message)
    process.exit(1)
})