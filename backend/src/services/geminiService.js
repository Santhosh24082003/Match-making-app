const { GoogleGenerativeAI } = require('@google/generative-ai')

const apiKey = process.env.GEMINI_API_KEY
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'

const client = apiKey ? new GoogleGenerativeAI(apiKey) : null

function buildFallbackExplanation(customer, profile, match) {
  return `${match.label} because the profile aligns on the key preferences for ${customer.gender.toLowerCase()} matching, including ${match.reasonSummary.toLowerCase()}.`
}

async function generateMatchExplanations(customer, matches) {
  if (!client || !matches.length) {
    return matches.reduce((accumulator, match) => {
      accumulator[match._id.toString()] = buildFallbackExplanation(customer, match, match)
      return accumulator
    }, {})
  }

  const payload = {
    customer: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      gender: customer.gender,
      age: customer.age,
      city: customer.city,
      income: customer.income,
      heightCm: customer.heightCm,
      wantKids: customer.wantKids,
      openToRelocate: customer.openToRelocate,
      religion: customer.religion,
      community: customer.community,
      motherTongue: customer.motherTongue,
      hobbies: customer.hobbies || [],
    },
    matches: matches.map((match) => ({
      id: match._id.toString(),
      firstName: match.firstName,
      lastName: match.lastName,
      age: match.age,
      city: match.city,
      income: match.income,
      heightCm: match.heightCm,
      wantKids: match.wantKids,
      openToRelocate: match.openToRelocate,
      religion: match.religion,
      community: match.community,
      motherTongue: match.motherTongue,
      designation: match.designation,
      label: match.label,
      score: match.score,
      reasonSummary: match.reasonSummary,
    })),
  }

  const model = client.getGenerativeModel({ model: modelName })
  const response = await model.generateContent([
    {
      text: [
        'You are a matchmaking assistant for an Indian matrimony dashboard.',
        'Return only valid JSON.',
        'Keep each explanation short, specific, and professional.',
        'Do not mention that you are an AI model.',
        'Generate one short explanation for each suggested match.',
        'Return JSON with shape: {"results":[{"id":"string","explanation":"string"}]}',
        'Use the scoring logic and compatibility facts supplied in the payload.',
        'Each explanation must be 1 to 2 sentences max.',
        JSON.stringify(payload),
      ].join('\n\n'),
    },
  ])

  const text = response.response.text() || ''

  try {
    const parsed = JSON.parse(text)
    const results = Array.isArray(parsed.results) ? parsed.results : []

    return results.reduce((accumulator, item) => {
      if (item && item.id && item.explanation) {
        accumulator[item.id] = item.explanation
      }
      return accumulator
    }, {})
  } catch (error) {
    return matches.reduce((accumulator, match) => {
      accumulator[match._id.toString()] = buildFallbackExplanation(customer, match, match)
      return accumulator
    }, {})
  }
}

async function generateIntroMessage(customer, profile, rankedMatch) {
  const fallback = {
    subject: `Intro suggestion: ${customer.firstName} + ${profile.firstName}`,
    body: [
      `Hi ${profile.firstName},`,
      '',
      `I’m reaching out with a thoughtful introduction for ${customer.firstName} ${customer.lastName}.`,
      `This match looks like a ${rankedMatch?.label || 'strong fit'} because ${rankedMatch?.reasonSummary || 'the key preferences align well'}.`,
      `If you are open to exploring this profile, we can arrange the next step and share a warmer introduction note.`,
      '',
      `Best,`,
      `DateCrew Matchmaker Desk`,
    ].join('\n'),
  }

  if (!client) {
    return fallback
  }

  const payload = {
    customer: {
      firstName: customer.firstName,
      lastName: customer.lastName,
      city: customer.city,
      religion: customer.religion,
      wantKids: customer.wantKids,
      openToRelocate: customer.openToRelocate,
      hobbies: customer.hobbies || [],
    },
    profile: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      city: profile.city,
      religion: profile.religion,
      wantKids: profile.wantKids,
      openToRelocate: profile.openToRelocate,
      designation: profile.designation,
    },
    rank: {
      label: rankedMatch?.label,
      score: rankedMatch?.score,
      reasonSummary: rankedMatch?.reasonSummary,
    },
  }

  const model = client.getGenerativeModel({ model: modelName })
  const response = await model.generateContent([
    {
      text: [
        'You write concise matchmaking intro emails for an internal matrimony team.',
        'Return only valid JSON.',
        'Keep it warm, professional, and brief.',
        'Generate a short intro email subject and body for this suggested match.',
        'Return JSON with shape: {"subject":"string","body":"string"}',
        'The body should be 4 to 6 short paragraphs or line breaks, and should not mention any private data beyond what is provided.',
        JSON.stringify(payload),
      ].join('\n\n'),
    },
  ])

  const text = response.response.text() || ''

  try {
    const parsed = JSON.parse(text)

    if (parsed.subject && parsed.body) {
      return parsed
    }
  } catch (error) {
    return fallback
  }

  return fallback
}

module.exports = {
  generateMatchExplanations,
  generateIntroMessage,
}