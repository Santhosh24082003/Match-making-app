const router = require('express').Router()

const authRoutes = require('./authRoutes')
const customerRoutes = require('./customerRoutes')
const dashboardRoutes = require('./dashboardRoutes')

router.get('/health', (req, res) => {
  res.json({ ok: true })
})

router.use('/auth', authRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/customers', customerRoutes)

module.exports = router