const router = require('express').Router()

const { getDashboard } = require('../controllers/dashboardController')
const { authRequired } = require('../middleware/auth')

router.get('/', authRequired, getDashboard)

module.exports = router