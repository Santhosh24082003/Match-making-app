const fs = require('fs')
const path = require('path')
const mongoose = require('mongoose')

const JSON_DIR = path.join(__dirname, 'json')

function readJsonArray(filename) {
  const filePath = path.join(JSON_DIR, filename)
  const raw = fs.readFileSync(filePath, 'utf8')
  const parsed = JSON.parse(raw)

  if (!Array.isArray(parsed)) {
    throw new Error(`${filename} must contain a JSON array.`)
  }

  return parsed
}

function toObjectId(value) {
  if (!value) {
    return value
  }

  if (value instanceof mongoose.Types.ObjectId) {
    return value
  }

  return new mongoose.Types.ObjectId(String(value))
}

function normalizeRecord(record) {
  const normalized = {
    ...record,
    _id: toObjectId(record._id),
    dateOfBirth: new Date(record.dateOfBirth),
  }

  return normalized
}

function loadCustomersFromJson() {
  return readJsonArray('customers.json').map(normalizeRecord)
}

function loadProfilesFromJson() {
  return readJsonArray('profiles.json').map(normalizeRecord)
}

function prepareForMongoInsert(records) {
  return records.map((record) => ({
    ...record,
    _id: toObjectId(record._id),
    dateOfBirth: new Date(record.dateOfBirth),
  }))
}

module.exports = {
  JSON_DIR,
  readJsonArray,
  loadCustomersFromJson,
  loadProfilesFromJson,
  prepareForMongoInsert,
  normalizeRecord,
  toObjectId,
}
