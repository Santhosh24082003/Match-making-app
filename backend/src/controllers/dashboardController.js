const { MatchNote, MatchSend } = require('../models')
const { listCustomers } = require('../data/dataSource')
const { buildDashboardMetrics } = require('../utils/matchEngine')

async function getDashboard(req, res) {
  const [customers, notes, sentMatches] = await Promise.all([
    listCustomers(req.user.username),
    MatchNote.find({ matchmakerUsername: req.user.username }).sort({ createdAt: -1 }).lean(),
    MatchSend.find({ sentByUsername: req.user.username }).sort({ sentAt: -1 }).lean(),
  ])

  return res.json({
    metrics: buildDashboardMetrics(customers, notes, sentMatches),
    recentNotes: notes.slice(0, 5),
    recentSentMatches: sentMatches.slice(0, 5),
  })
}

module.exports = {
  getDashboard,
}