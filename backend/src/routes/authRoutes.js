const router = require('express').Router()

const { login, me } = require('../controllers/authController')
const { authRequired } = require('../middleware/auth')

router.post('/login', login)
router.get('/me', authRequired, me)

module.exports = router