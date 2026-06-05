export type AuthUser = {
  id: string
  username: string
  displayName: string
  role: string
}

export type LoginCredentials = {
  username: string
  password: string
}

export type DashboardMetrics = {
  assignedCustomers: number
  activeJourney: number
  totalNotes: number
  matchesSent: number
}

export type DashboardData = {
  metrics: DashboardMetrics
  recentNotes: MatchNote[]
  recentSentMatches: SentMatch[]
}

export type CustomerSummary = {
  id: string
  firstName: string
  lastName: string
  age: number
  city: string
  maritalStatus: string
  statusTag: string
  journeyStage: string
  gender: string
  matchCount?: number
}

export type MatchNote = {
  _id: string
  customerId: string
  customerName: string
  note: string
  authorName: string
  createdAt: string
}

export type SentMatch = {
  _id: string
  customerId: string
  customerName: string
  profileId: string
  profileName: string
  score: number
  normalScore?: number
  aiScore?: number
  label: string
  reasonSummary: string
  emailSubject: string
  emailBody: string
  createdAt: string
}

export type CustomerDetail = {
  _id: string
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: string
  country: string
  city: string
  heightCm: number
  email: string
  phoneNumber: string
  undergraduateCollege: string
  degree: string
  income: number
  currentCompany: string
  designation: string
  maritalStatus: string
  languagesKnown: string[]
  siblings: string
  caste: string
  religion: string
  wantKids: string
  openToRelocate: string
  openToPets: string
  motherTongue: string
  community: string
  diet: string
  smoking: string
  drinking: string
  familyType: string
  manglikStatus: string
  profileVerified: boolean
  bio: string
  hobbies: string[]
  journeyStage: string
  statusTag: string
  notes: MatchNote[]
  sentMatches: SentMatch[]
}

export type MatchProfile = {
  _id: string
  firstName: string
  lastName: string
  gender: string
  age: number
  city: string
  heightCm: number
  income: number
  currentCompany: string
  designation: string
  religion: string
  community: string
  motherTongue: string
  wantKids: string
  openToRelocate: string
  openToPets: string
  profileVerified: boolean
  values: string[]
  introLine: string
  label: string
  score: number
  normalScore: number
  aiScore: number
  reasonSummary: string
  aiInsight: string
  reasons: string[]
}

export type SendMatchResult = {
  message: string
  intro: {
    subject: string
    body: string
  }
  match: MatchProfile
  sentMatch: SentMatch
}