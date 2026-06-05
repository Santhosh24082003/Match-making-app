function toAge(dateValue) {
  const birth = new Date(dateValue)
  const ageDifMs = Date.now() - birth.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function normalizeString(value) {
  return String(value || '').trim().toLowerCase()
}
function toAge(dateValue) {
  const birth = new Date(dateValue)
  const ageDifMs = Date.now() - birth.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

function normalizeString(value) {
  return String(value || '').trim().toLowerCase()
}

function clampScore(score) {
  return Math.max(0, Math.min(100, Math.round(score)))
}

function matchLabel(score) {
  if (score >= 86) return 'High Potential Match'
  if (score >= 72) return 'Strong Match'
  if (score >= 58) return 'Promising Match'
  return 'Exploratory Match'
}

function buildReasonSummary(reasons) {
  if (!reasons.length) {
    return 'Balanced on the basics but needs a closer review.'
  }

  return reasons.slice(0, 3).join(' • ')
}

function pushReason(bucket, text, points) {
  bucket.score += points
  bucket.reasons.push(text)
}

function hasSharedHobby(customer, profile) {
  return Boolean(profile.hobbies?.some((hobby) => customer.hobbies?.includes(hobby)))
}

function scoreMaritalFit(customer, profile, bucket, points = 2, penalty = -2) {
  if (normalizeString(customer.maritalStatus) === normalizeString(profile.maritalStatus)) {
    pushReason(bucket, 'Marital history is aligned', points)
  } else {
    pushReason(bucket, 'Marital history needs closer review', penalty)
  }
}

function scoreSharedSignals(customer, profile, bucket) {
  if (normalizeString(profile.city) === normalizeString(customer.city)) {
    pushReason(bucket, 'Same-city convenience supports easier planning', 4)
  } else if (normalizeString(profile.openToRelocate) === 'yes') {
    pushReason(bucket, 'Open to relocation despite city difference', 3)
  }

  if (profile.profileVerified) {
    pushReason(bucket, 'Profile is verified', 4)
  }

  if (hasSharedHobby(customer, profile)) {
    pushReason(bucket, 'There is a genuine shared-interest hook', 3)
  }

  if (normalizeString(profile.religion) === normalizeString(customer.religion)) {
    pushReason(bucket, 'Religion aligns', 4)
  } else {
    pushReason(bucket, 'Religion does not align closely', -2)
  }

  if (normalizeString(profile.community) === normalizeString(customer.community)) {
    pushReason(bucket, 'Community overlap supports family-fit confidence', 4)
  }

  if (normalizeString(profile.motherTongue) === normalizeString(customer.motherTongue)) {
    pushReason(bucket, 'Mother tongue is aligned', 3)
  }

  if (normalizeString(profile.diet) === normalizeString(customer.diet)) {
    pushReason(bucket, 'Dietary compatibility is strong', 3)
  }

  if (normalizeString(profile.familyType) === normalizeString(customer.familyType)) {
    pushReason(bucket, 'Family setup feels familiar', 2)
  }

  if (normalizeString(profile.manglikStatus) === normalizeString(customer.manglikStatus)) {
    pushReason(bucket, 'Manglik compatibility is aligned', 2)
  }
}

function scoreMalePreference(customer, profile, bucket) {
  const customerAge = toAge(customer.dateOfBirth)
  const profileAge = toAge(profile.dateOfBirth)
  const ageGap = customerAge - profileAge

  if (ageGap >= 1 && ageGap <= 5) {
    pushReason(bucket, `${profile.firstName} is younger in the preferred age band`, 12)
  } else if (ageGap > 5 && ageGap <= 8) {
    pushReason(bucket, `${profile.firstName} is younger, though slightly outside the ideal band`, 7)
  } else if (ageGap > 8 && ageGap <= 12) {
    pushReason(bucket, `${profile.firstName} is younger, but the age gap is wider`, 3)
  } else if (ageGap <= 0) {
    pushReason(bucket, `${profile.firstName} is older than the stated preference`, -10)
  }

  if (profile.income < customer.income * 0.8) {
    pushReason(bucket, 'Income sits comfortably below his level, which matches the requested dynamic', 8)
  } else if (profile.income < customer.income) {
    pushReason(bucket, 'Income is below his level, though the gap is modest', 4)
  } else {
    pushReason(bucket, 'Income is not lower than the customer profile', -4)
  }

  if (profile.heightCm < customer.heightCm) {
    pushReason(bucket, 'Height preference lines up with a shorter partner', 7)
  } else if (Math.abs(profile.heightCm - customer.heightCm) <= 4) {
    pushReason(bucket, 'Height is very close to the preferred range', 3)
  } else {
    pushReason(bucket, 'Height is above the preferred range', -3)
  }

  if (normalizeString(profile.wantKids) === normalizeString(customer.wantKids)) {
    pushReason(bucket, 'Children preference matches exactly', 10)
  } else {
    pushReason(bucket, 'Children preference is not aligned', -8)
  }

  if (normalizeString(profile.openToRelocate) === normalizeString(customer.openToRelocate) || normalizeString(customer.openToRelocate) === 'yes') {
    pushReason(bucket, 'Relocation preferences are workable', 4)
  } else {
    pushReason(bucket, 'Relocation preference is not aligned', -2)
  }

  if (normalizeString(profile.smoking) === normalizeString(customer.smoking)) {
    pushReason(bucket, 'Smoking preference is compatible', 2)
  }

  if (normalizeString(profile.drinking) === normalizeString(customer.drinking)) {
    pushReason(bucket, 'Drinking preference is compatible', 2)
  }

  scoreMaritalFit(customer, profile, bucket, 3, -3)
  scoreSharedSignals(customer, profile, bucket)
}

function scoreFemalePreference(customer, profile, bucket) {
  const customerAge = toAge(customer.dateOfBirth)
  const profileAge = toAge(profile.dateOfBirth)
  const ageGap = profileAge - customerAge

  if (ageGap >= 1 && ageGap <= 6) {
    pushReason(bucket, `${profile.firstName} is slightly older, which can feel balanced`, 8)
  } else if (Math.abs(ageGap) <= 2) {
    pushReason(bucket, `${profile.firstName} is close in age`, 6)
  } else if (ageGap < 0) {
    pushReason(bucket, `${profile.firstName} is younger than the preferred age band`, -5)
  }

  const stableRoles = ['manager', 'lead', 'director', 'founder', 'consultant', 'doctor', 'architect', 'lawyer', 'analyst', 'engineer']
  const roleText = normalizeString(profile.designation)
  if (stableRoles.some((role) => roleText.includes(role))) {
    pushReason(bucket, 'Profession signals stability and growth mindset', 9)
  }

  if (normalizeString(profile.currentCompany) && normalizeString(profile.currentCompany) !== 'unknown') {
    pushReason(bucket, 'Career continuity is visible', 4)
  }

  if (profile.income >= customer.income * 0.85) {
    pushReason(bucket, 'Income level supports a comparable lifestyle', 7)
  } else if (profile.income >= customer.income * 0.7) {
    pushReason(bucket, 'Income is somewhat lower but still reasonable', 2)
  } else {
    pushReason(bucket, 'Income is lower than her current bracket', -6)
  }

  if (normalizeString(profile.wantKids) === normalizeString(customer.wantKids)) {
    pushReason(bucket, 'Children preference is aligned', 9)
  } else {
    pushReason(bucket, 'Children preference is not aligned', -7)
  }

  if (normalizeString(profile.openToRelocate) === normalizeString(customer.openToRelocate) || normalizeString(profile.openToRelocate) === 'yes') {
    pushReason(bucket, 'Relocation openness is practical', 5)
  } else {
    pushReason(bucket, 'Relocation openness is limited', -4)
  }

  if (normalizeString(profile.diet) === normalizeString(customer.diet)) {
    pushReason(bucket, 'Lifestyle and diet are aligned', 4)
  } else {
    pushReason(bucket, 'Lifestyle and diet differ', -2)
  }

  if (normalizeString(profile.smoking) === normalizeString(customer.smoking) && normalizeString(profile.drinking) === normalizeString(customer.drinking)) {
    pushReason(bucket, 'Lifestyle boundaries match neatly', 5)
  } else {
    pushReason(bucket, 'Lifestyle boundaries need review', -2)
  }

  scoreMaritalFit(customer, profile, bucket, 2, -2)
  scoreSharedSignals(customer, profile, bucket)
}

function deriveAiScore(customer, profile, normalScore, reasonsCount) {
  const sameCity = normalizeString(profile.city) === normalizeString(customer.city)
  const verified = profile.profileVerified ? 2 : 0
  const sharedInterest = hasSharedHobby(customer, profile) ? 2 : 0
  const cultureFit = normalizeString(profile.religion) === normalizeString(customer.religion) ? 2 : 0
  const communityFit = normalizeString(profile.community) === normalizeString(customer.community) ? 1 : 0
  const relocationFit = normalizeString(profile.openToRelocate) === 'yes' ? 1 : 0

  return clampScore(
    normalScore * 0.9 +
    Math.min(reasonsCount * 1.2, 8) +
    (sameCity ? 2 : 0) +
    verified +
    sharedInterest +
    cultureFit +
    communityFit +
    relocationFit,
  )
}

function rankMatches(customer, profiles) {
  const oppositeGender = normalizeString(customer.gender) === 'male' ? 'female' : 'male'
  const filtered = profiles.filter((profile) => normalizeString(profile.gender) === oppositeGender)

  return filtered
    .map((profile) => {
      const bucket = { score: 24, reasons: [] }

      if (normalizeString(customer.gender) === 'male') {
        scoreMalePreference(customer, profile, bucket)
      } else {
        scoreFemalePreference(customer, profile, bucket)
      }

      const normalScore = clampScore(bucket.score)
      const aiScore = deriveAiScore(customer, profile, normalScore, bucket.reasons.length)

      return {
        ...profile,
        age: toAge(profile.dateOfBirth),
        label: matchLabel(aiScore),
        score: aiScore,
        normalScore,
        aiScore,
        reasons: bucket.reasons,
        reasonSummary: buildReasonSummary(bucket.reasons),
        aiInsight: `${matchLabel(aiScore)} because ${buildReasonSummary(bucket.reasons).toLowerCase()}`,
      }
    })
    .sort((left, right) => right.aiScore - left.aiScore)
}

function buildIntroMessage(customer, profile, rankedMatch) {
  const leadReason = rankedMatch?.reasonSummary || 'there is a thoughtful compatibility signal'

  return {
    subject: `Intro suggestion: ${customer.firstName} + ${profile.firstName}`,
    body: [
      `Hi ${profile.firstName},`,
      '',
      `I’m reaching out with an AI-assisted introduction for ${customer.firstName} ${customer.lastName}.`,
      `The match ranks as ${rankedMatch?.label || 'a strong fit'} because ${leadReason}.`,
      `If you are open to exploring this profile, we can arrange the next step and share a warmer introduction note.`,
      '',
      `Best,`,
      `DateCrew Matchmaker Desk`,
    ].join('\n'),
  }
}

function buildCustomerSummary(customer) {
  return {
    id: customer._id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    age: toAge(customer.dateOfBirth),
    city: customer.city,
    maritalStatus: customer.maritalStatus,
    statusTag: customer.statusTag,
    journeyStage: customer.journeyStage,
    gender: customer.gender,
  }
}

function buildDashboardMetrics(customers, notes, sentMatches) {
  return {
    assignedCustomers: customers.length,
    activeJourney: customers.filter((customer) => /shortlist|meeting|intro/i.test(customer.journeyStage)).length,
    totalNotes: notes.length,
    matchesSent: sentMatches.length,
  }
}

module.exports = {
  rankMatches,
  buildIntroMessage,
  buildCustomerSummary,
  buildDashboardMetrics,
}