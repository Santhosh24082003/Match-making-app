const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { MatchmakerUser } = require('../models')

function signToken(user) {
  const JWT_SECRET = process.env.JWT_SECRET || 'datecrew-demo-secret'

  return jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      role: user.role,
      displayName: user.displayName,
    },
    JWT_SECRET,
    { expiresIn: '12h' },
  )
}

async function login(req, res) {
  const { username, password } = req.body || {}

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' })
  }

  const user = await MatchmakerUser.findOne({ username: username.toLowerCase() })

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  const isValid = await bcrypt.compare(password, user.passwordHash)

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid credentials.' })
  }

  return res.json({
    token: signToken(user),
    user: {
      id: user._id,
      username: user.username,
      displayName: user.displayName,
      role: user.role,
    },
  })
}

async function me(req, res) {
  const user = await MatchmakerUser.findById(req.user.sub).lean()

  if (!user) {
    return res.status(404).json({ message: 'Matchmaker not found.' })
  }

  return res.json({
    id: user._id,
    username: user.username,
    displayName: user.displayName,
    role: user.role,
  })
}

module.exports = {
  login,
  me,
}