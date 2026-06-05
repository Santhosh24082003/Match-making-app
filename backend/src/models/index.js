const mongoose = require('mongoose')

const { Schema, model, models } = mongoose

const sharedPersonFields = {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  gender: { type: String, required: true, enum: ['Male', 'Female'] },
  dateOfBirth: { type: Date, required: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  heightCm: { type: Number, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  undergraduateCollege: { type: String, required: true },
  degree: { type: String, required: true },
  income: { type: Number, required: true },
  currentCompany: { type: String, required: true },
  designation: { type: String, required: true },
  maritalStatus: { type: String, required: true },
  languagesKnown: [{ type: String }],
  siblings: { type: String, required: true },
  caste: { type: String, required: true },
  religion: { type: String, required: true },
  wantKids: { type: String, required: true },
  openToRelocate: { type: String, required: true },
  openToPets: { type: String, required: true },
  motherTongue: { type: String, required: true },
  community: { type: String, required: true },
  diet: { type: String, required: true },
  smoking: { type: String, required: true },
  drinking: { type: String, required: true },
  familyType: { type: String, required: true },
  manglikStatus: { type: String, required: true },
  profileVerified: { type: Boolean, default: true },
  bio: { type: String, required: true },
  hobbies: [{ type: String }],
  journeyStage: { type: String, required: true },
  statusTag: { type: String, required: true },
  assignedTo: { type: String, required: true },
  createdAtLabel: { type: String, required: true },
}

const customerSchema = new Schema(sharedPersonFields, {
  timestamps: true,
})

const profileSchema = new Schema(
  {
    ...sharedPersonFields,
    active: { type: Boolean, default: true },
    professionCategory: { type: String, required: true },
    hometown: { type: String, required: true },
    values: [{ type: String }],
    introLine: { type: String, required: true },
  },
  { timestamps: true },
)

const matchmakerUserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    displayName: { type: String, required: true },
    role: { type: String, default: 'matchmaker' },
  },
  { timestamps: true },
)

const matchNoteSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    customerName: { type: String, required: true },
    note: { type: String, required: true },
    matchmakerUsername: { type: String, required: true },
    authorName: { type: String, required: true },
  },
  { timestamps: true },
)

const matchSendSchema = new Schema(
  {
    customerId: { type: Schema.Types.ObjectId, required: true, index: true },
    customerName: { type: String, required: true },
    profileId: { type: Schema.Types.ObjectId, required: true, index: true },
    profileName: { type: String, required: true },
    score: { type: Number, required: true },
    normalScore: { type: Number, required: true },
    aiScore: { type: Number, required: true },
    label: { type: String, required: true },
    reasonSummary: { type: String, required: true },
    sentByUsername: { type: String, required: true },
    sentByName: { type: String, required: true },
    emailSubject: { type: String, required: true },
    emailBody: { type: String, required: true },
  },
  { timestamps: true, collection: 'match_sends' },
)

const Customer = models.Customer || model('Customer', customerSchema)
const Profile = models.Profile || model('Profile', profileSchema)
const MatchmakerUser = models.MatchmakerUser || model('MatchmakerUser', matchmakerUserSchema)
const MatchNote = models.MatchNote || model('MatchNote', matchNoteSchema)
const MatchSend = models.MatchSend || model('MatchSend', matchSendSchema)

module.exports = {
  Customer,
  Profile,
  MatchmakerUser,
  MatchNote,
  MatchSend,
}