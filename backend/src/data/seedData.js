const { loadCustomersFromJson, loadProfilesFromJson } = require('./jsonLoader')

function buildSeedData() {
  return {
    customers: loadCustomersFromJson(),
    profiles: loadProfilesFromJson(),
  }
}

module.exports = {
  buildSeedData,
}
