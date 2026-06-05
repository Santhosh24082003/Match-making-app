const { Customer, MatchNote, MatchSend, Profile } = require('../models')
const {
  rankMatches,
  buildCustomerSummary,
} = require('../utils/matchEngine')
const {
  generateMatchExplanations,
  generateIntroMessage,
} = require('../services/geminiService')

async function listCustomers(req, res) {
  const customers = await Customer.find({ assignedTo: req.user.username }).sort({ createdAt: 1 }).lean()

  return res.json(
    customers.map((customer) => ({
      ...buildCustomerSummary(customer),
      matchCount: customer.matchCount || 0,
    })),
  )
}

async function getCustomerById(req, res) {
  const customer = await Customer.findOne({
    _id: req.params.customerId,
    assignedTo: req.user.username,
  }).lean()

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found.' })
  }

  const notes = await MatchNote.find({ customerId: customer._id }).sort({ createdAt: -1 }).lean()
  const sentMatches = await MatchSend.find({ customerId: customer._id }).sort({ sentAt: -1 }).lean()
  const matches = await Profile.find({ active: true }).lean()
  const rankedMatches = rankMatches(customer, matches).slice(0, 100)
  const explanationWindow = rankedMatches.slice(0, 20)
  const explanations = await generateMatchExplanations(customer, explanationWindow)

  return res.json({
    customer: {
      ...customer,
      notes,
      sentMatches,
    },
    matches: rankedMatches.map((match) => ({
      ...match,
      aiInsight: explanations[match._id.toString()] || match.aiInsight,
    })),
  })
}

async function getMatchesForCustomer(req, res) {
  const customer = await Customer.findOne({
    _id: req.params.customerId,
    assignedTo: req.user.username,
  }).lean()

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found.' })
  }

  const profiles = await Profile.find({ active: true }).lean()
  const rankedMatches = rankMatches(customer, profiles).slice(0, 100)
  const explanations = await generateMatchExplanations(customer, rankedMatches.slice(0, 20))

  return res.json({
    matches: rankedMatches.map((match, index) => ({
      ...match,
      aiInsight: explanations[match._id.toString()] || match.aiInsight || `Match score ${match.score}`,
      explanationSource: index < 20 ? 'gemini' : 'rule-based fallback',
    })),
  })
}

async function addNote(req, res) {
  const { note } = req.body || {}

  if (!note || !note.trim()) {
    return res.status(400).json({ message: 'Note text is required.' })
  }

  const customer = await Customer.findOne({
    _id: req.params.customerId,
    assignedTo: req.user.username,
  }).lean()

  if (!customer) {
    return res.status(404).json({ message: 'Customer not found.' })
  }

  const saved = await MatchNote.create({
    customerId: customer._id,
    customerName: `${customer.firstName} ${customer.lastName}`,
    note: note.trim(),
    matchmakerUsername: req.user.username,
    authorName: req.user.displayName,
  })

  return res.status(201).json({ note: saved })
}

async function sendMatch(req, res) {
  const customer = await Customer.findOne({
    _id: req.params.customerId,
    assignedTo: req.user.username,
  }).lean()

  const profile = await Profile.findById(req.params.profileId).lean()

  if (!customer || !profile) {
    return res.status(404).json({ message: 'Customer or profile not found.' })
  }

  const rankedMatch = rankMatches(customer, [profile])[0]
  const intro = await generateIntroMessage(customer, profile, rankedMatch)

  const saved = await MatchSend.create({
    customerId: customer._id,
    customerName: `${customer.firstName} ${customer.lastName}`,
    profileId: profile._id,
    profileName: `${profile.firstName} ${profile.lastName}`,
    score: rankedMatch.aiScore,
    normalScore: rankedMatch.normalScore,
    aiScore: rankedMatch.aiScore,
    label: rankedMatch.label,
    reasonSummary: rankedMatch.reasonSummary,
    sentByUsername: req.user.username,
    sentByName: req.user.displayName,
    emailSubject: intro.subject,
    emailBody: intro.body,
  })

  return res.status(201).json({
    sentMatch: saved,
    message: 'Mock match email prepared successfully.',
    intro,
    match: rankedMatch,
  })
}

module.exports = {
  listCustomers,
  getCustomerById,
  getMatchesForCustomer,
  addNote,
  sendMatch,
}