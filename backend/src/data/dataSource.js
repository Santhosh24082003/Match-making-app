const { Customer, Profile } = require('../models')
const { loadCustomersFromJson, loadProfilesFromJson, toObjectId } = require('./jsonLoader')

function getDataSourceMode() {
  return (process.env.DATA_SOURCE || 'mongodb').toLowerCase()
}

function isJsonMode() {
  return getDataSourceMode() === 'json'
}

function matchId(left, right) {
  return String(left) === String(right)
}

async function listCustomers(assignedTo) {
  if (isJsonMode()) {
    return loadCustomersFromJson()
      .filter((customer) => customer.assignedTo === assignedTo)
      .sort((left, right) => left._id.toString().localeCompare(right._id.toString()))
  }

  return Customer.find({ assignedTo }).sort({ createdAt: 1 }).lean()
}

async function getCustomerById(customerId, assignedTo) {
  if (isJsonMode()) {
    return loadCustomersFromJson().find(
      (customer) => matchId(customer._id, customerId) && customer.assignedTo === assignedTo,
    ) || null
  }

  return Customer.findOne({ _id: customerId, assignedTo }).lean()
}

async function getActiveProfiles() {
  if (isJsonMode()) {
    return loadProfilesFromJson().filter((profile) => profile.active !== false)
  }

  return Profile.find({ active: true }).lean()
}

async function getProfileById(profileId) {
  if (isJsonMode()) {
    return loadProfilesFromJson().find((profile) => matchId(profile._id, profileId)) || null
  }

  return Profile.findById(profileId).lean()
}

async function listAllCustomers() {
  if (isJsonMode()) {
    return loadCustomersFromJson().sort((left, right) =>
      left._id.toString().localeCompare(right._id.toString()),
    )
  }

  return Customer.find({}).sort({ createdAt: 1 }).lean()
}

module.exports = {
  getDataSourceMode,
  isJsonMode,
  listCustomers,
  getCustomerById,
  getActiveProfiles,
  getProfileById,
  listAllCustomers,
  toObjectId,
}
