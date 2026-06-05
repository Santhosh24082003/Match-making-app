const express = require('express')
const cors = require('cors')

const routes = require('./routes')

const app = express()
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*'

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  }),
)
app.use(express.json({ limit: '1mb' }))

app.get('/', (req, res) => {
  res.json({ message: 'Matchmaker API is running.' })
})

app.use('/api', routes)

app.use((error, req, res, next) => {
  console.error(error)
  return res.status(500).json({ message: 'Internal server error.' })
})

module.exports = app