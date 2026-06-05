const router = require('express').Router()

const {
  listCustomers,
  getCustomerById,
  getMatchesForCustomer,
  addNote,
  sendMatch,
} = require('../controllers/customerController')
const { authRequired } = require('../middleware/auth')

router.get('/', authRequired, listCustomers)
router.get('/:customerId', authRequired, getCustomerById)
router.get('/:customerId/matches', authRequired, getMatchesForCustomer)
router.post('/:customerId/notes', authRequired, addNote)
router.post('/:customerId/matches/:profileId/send', authRequired, sendMatch)

module.exports = router