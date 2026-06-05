const jwt = require('jsonwebtoken')

function authRequired(req, res, next) {
  const JWT_SECRET = process.env.JWT_SECRET || 'datecrew-demo-secret'
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) {
    return res.status(401).json({ message: 'Missing auth token.' })
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET)
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' })
  }
}

module.exports = {
  authRequired,
}