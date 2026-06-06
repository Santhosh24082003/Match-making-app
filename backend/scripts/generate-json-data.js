/**
 * Generates backend/src/data/json/customers.json and profiles.json
 * with 100 unique profile names (50 female + 50 male).
 *
 * Run: node scripts/generate-json-data.js
 */

const fs = require('fs')
const path = require('path')

const OUTPUT_DIR = path.join(__dirname, '../src/data/json')

const sharedCities = ['Mumbai', 'Bengaluru', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Ahmedabad', 'Kolkata']
const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain']
const communities = ['Brahmin', 'Marwari', 'Punjabi', 'Tamil', 'Gujarati', 'Reddy', 'Khatri', 'Bengali']
const motherTongues = ['Hindi', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Punjabi', 'Bengali', 'Kannada']
const diets = ['Vegetarian', 'Eggetarian', 'Non-Vegetarian']
const smoking = ['No', 'Occasionally', 'Yes']
const drinking = ['No', 'Socially', 'Yes']
const familyTypes = ['Nuclear', 'Joint', 'Extended']
const manglik = ['Non-Manglik', 'Manglik', 'Partial Manglik']
const colleges = ['IIT Delhi', "St. Xavier's College", 'NMIMS', 'Loyola College', 'Christ University', 'Delhi University', 'BITS Pilani', 'Symbiosis']
const companies = ['Google', 'Amazon', 'TCS', 'Infosys', 'Zomato', 'Reliance', 'Wipro', 'Deloitte', 'Swiggy', 'Adobe', 'Accenture', 'Freshworks']
const professions = [
  'Software Engineer', 'Product Manager', 'Consultant', 'Doctor', 'Architect', 'Founder',
  'Investment Analyst', 'Designer', 'Lawyer', 'HR Lead', 'Teacher', 'Data Scientist',
]
const hobbies = ['Reading', 'Travel', 'Fitness', 'Cooking', 'Music', 'Movies', 'Photography', 'Dance', 'Yoga', 'Gardening']
const values = ['family-oriented', 'career-minded', 'spiritual', 'adventurous', 'pet-friendly', 'travel-loving', 'traditional', 'modern']
const matchmakerUsername = 'sathosh@onlinematch.com'

const femaleFirstNames = [
  'Aditi', 'Isha', 'Nandini', 'Meera', 'Sanya', 'Tanvi', 'Rhea', 'Kiara', 'Pallavi', 'Shruti',
  'Devika', 'Sonia', 'Kavya', 'Ananya', 'Priya', 'Divya', 'Sneha', 'Pooja', 'Lakshmi', 'Aisha',
  'Fatima', 'Zara', 'Neha', 'Simran', 'Ishita', 'Trisha', 'Yamini', 'Swati', 'Deepa', 'Revathi',
  'Kritika', 'Mansi', 'Nidhi', 'Payal', 'Radhika', 'Surbhi', 'Tanya', 'Urvashi', 'Vidya', 'Aarohi',
  'Bhavna', 'Charu', 'Disha', 'Esha', 'Gauri', 'Hema', 'Jhanvi', 'Komal', 'Lavanya', 'Myra',
]

const maleFirstNames = [
  'Arjun', 'Vivaan', 'Rahul', 'Nikhil', 'Aman', 'Varun', 'Siddharth', 'Karan', 'Aditya', 'Ritesh',
  'Vikram', 'Rohan', 'Dev', 'Kunal', 'Harsh', 'Yash', 'Akash', 'Pranav', 'Mohit', 'Sahil',
  'Tarun', 'Vivek', 'Gaurav', 'Manish', 'Rajat', 'Sanjay', 'Ankit', 'Rishabh', 'Naveen', 'Piyush',
  'Shivam', 'Abhishek', 'Dhruv', 'Ishaan', 'Jayant', 'Kartik', 'Lokesh', 'Mayank', 'Nitin', 'Omkar',
  'Parth', 'Raghav', 'Sameer', 'Tejas', 'Uday', 'Vinay', 'Wasim', 'Yuvraj', 'Zubin', 'Aarav',
]

const lastNames = [
  'Shah', 'Verma', 'Iyer', 'Khanna', 'Joshi', 'Patel', 'Reddy', 'Bose', 'Kapoor', 'Nair',
  'Mishra', 'Singh', 'Gupta', 'Agarwal', 'Chopra', 'Desai', 'Kulkarni', 'Menon', 'Saxena', 'Thakur',
  'Banerjee', 'Chatterjee', 'Dutta', 'Ghosh', 'Malhotra', 'Pandey', 'Rao', 'Shetty', 'Trivedi', 'Yadav',
  'Bhatia', 'Chauhan', 'Gowda', 'Hegde', 'Jain', 'Kaur', 'Luthra', 'Mehra', 'Nambiar', 'Oberoi',
  'Pillai', 'Qureshi', 'Rathore', 'Saini', 'Talwar', 'Uppal', 'Vohra', 'Wadhwa', 'Zaveri', 'Ahluwalia',
]

function objectIdHex(sequence) {
  return `674a0000000000000000${String(sequence).padStart(4, '0')}`
}

function isoDate(year, month, day) {
  return new Date(Date.UTC(year, month - 1, day)).toISOString()
}

function buildProfile(gender, index, sequenceId) {
  const firstName = gender === 'Female' ? femaleFirstNames[index] : maleFirstNames[index]
  const lastName = lastNames[index]
  const city = sharedCities[index % sharedCities.length]
  const college = colleges[index % colleges.length]
  const company = companies[index % companies.length]
  const profession = professions[index % professions.length]
  const baseYear = gender === 'Female' ? 1996 - (index % 5) : 1992 - (index % 7)
  const currentAge = 2026 - baseYear
  const income = gender === 'Female' ? 900000 + index * 82000 : 1500000 + index * 115000

  return {
    _id: objectIdHex(sequenceId),
    firstName,
    lastName,
    gender,
    dateOfBirth: isoDate(baseYear, (index % 12) + 1, (index % 26) + 1),
    country: 'India',
    city,
    heightCm: gender === 'Female' ? 154 + (index % 12) : 168 + (index % 14),
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@pool.com`,
    phoneNumber: `+91 90000 ${String(30000 + sequenceId).slice(-5)}`,
    undergraduateCollege: college,
    degree: gender === 'Female' ? 'MBA' : 'B.Tech',
    income,
    currentCompany: company,
    designation: profession,
    maritalStatus: index % 4 === 0 ? 'Divorced' : 'Never Married',
    languagesKnown: gender === 'Female'
      ? ['Hindi', 'English', motherTongues[index % motherTongues.length]]
      : ['Hindi', 'English', motherTongues[(index + 3) % motherTongues.length]],
    siblings: index % 3 === 0 ? '1 sibling' : index % 3 === 1 ? '2 siblings' : 'No siblings',
    caste: communities[index % communities.length],
    religion: religions[index % religions.length],
    wantKids: index % 5 === 0 ? 'Maybe' : 'Yes',
    openToRelocate: index % 4 === 0 ? 'Yes' : 'Maybe',
    openToPets: index % 3 === 0 ? 'Yes' : 'Maybe',
    motherTongue: motherTongues[index % motherTongues.length],
    community: communities[index % communities.length],
    diet: diets[index % diets.length],
    smoking: smoking[index % smoking.length],
    drinking: drinking[index % drinking.length],
    familyType: familyTypes[index % familyTypes.length],
    manglikStatus: manglik[index % manglik.length],
    profileVerified: index % 7 !== 0,
    bio: `${firstName} is a ${currentAge}-year-old ${profession.toLowerCase()} based in ${city}. Values a balanced life, family support, and a respectful long-term partnership.`,
    hobbies: [hobbies[index % hobbies.length], hobbies[(index + 2) % hobbies.length], hobbies[(index + 5) % hobbies.length]],
    journeyStage: 'Active in Pool',
    statusTag: index % 6 === 0 ? 'Priority' : 'Available',
    assignedTo: matchmakerUsername,
    createdAtLabel: `${index + 1} days in pool`,
    active: true,
    professionCategory: profession.includes('Engineer') || profession.includes('Data') || profession.includes('Product')
      ? 'Tech'
      : profession.includes('Doctor')
        ? 'Healthcare'
        : profession.includes('Lawyer')
          ? 'Legal'
          : profession.includes('Consultant')
            ? 'Advisory'
            : 'Business',
    hometown: sharedCities[(index + 2) % sharedCities.length],
    values: [values[index % values.length], values[(index + 2) % values.length]],
    introLine: `${firstName} is a ${profession.toLowerCase()} who brings a grounded and growth-oriented outlook.`,
  }
}

function buildCustomers() {
  return [
    {
      _id: objectIdHex(9001),
      firstName: 'Ananya',
      lastName: 'Sharma',
      gender: 'Female',
      dateOfBirth: isoDate(1995, 7, 14),
      country: 'India',
      city: 'Mumbai',
      heightCm: 163,
      email: 'ananya.sharma@client.com',
      phoneNumber: '+91 98765 10001',
      undergraduateCollege: "St. Xavier's College",
      degree: 'B.Com',
      income: 1800000,
      currentCompany: 'Kotak',
      designation: 'Strategy Manager',
      maritalStatus: 'Never Married',
      languagesKnown: ['Hindi', 'English', 'Marathi'],
      siblings: '1 younger brother',
      caste: 'Brahmin',
      religion: 'Hindu',
      wantKids: 'Yes',
      openToRelocate: 'Maybe',
      openToPets: 'Yes',
      motherTongue: 'Hindi',
      community: 'Sharma',
      diet: 'Vegetarian',
      smoking: 'No',
      drinking: 'Socially',
      familyType: 'Nuclear',
      manglikStatus: 'Non-Manglik',
      profileVerified: true,
      bio: 'Warm, ambitious, and family-oriented. Wants a partner who values emotional maturity and practical partnership.',
      hobbies: ['Reading', 'Travel', 'Yoga'],
      journeyStage: 'Shortlisting',
      statusTag: 'High Priority',
      assignedTo: matchmakerUsername,
      createdAtLabel: 'Added 3 days ago',
    },
    {
      _id: objectIdHex(9002),
      firstName: 'Rohan',
      lastName: 'Mehta',
      gender: 'Male',
      dateOfBirth: isoDate(1991, 2, 18),
      country: 'India',
      city: 'Bengaluru',
      heightCm: 178,
      email: 'rohan.mehta@client.com',
      phoneNumber: '+91 98765 10002',
      undergraduateCollege: 'BITS Pilani',
      degree: 'B.E. Computer Science',
      income: 3200000,
      currentCompany: 'Adobe',
      designation: 'Senior Product Lead',
      maritalStatus: 'Divorced',
      languagesKnown: ['Hindi', 'English', 'Gujarati'],
      siblings: '1 elder sister',
      caste: 'Marwari',
      religion: 'Hindu',
      wantKids: 'Yes',
      openToRelocate: 'Yes',
      openToPets: 'Maybe',
      motherTongue: 'Gujarati',
      community: 'Mehta',
      diet: 'Eggetarian',
      smoking: 'No',
      drinking: 'Socially',
      familyType: 'Joint',
      manglikStatus: 'Partial Manglik',
      profileVerified: true,
      bio: 'Values honesty, stability, and strong communication. Looking for a partner with similar long-term intent.',
      hobbies: ['Fitness', 'Travel', 'Music'],
      journeyStage: 'Meeting Scheduled',
      statusTag: 'Active',
      assignedTo: matchmakerUsername,
      createdAtLabel: 'Added 8 days ago',
    },
    {
      _id: objectIdHex(9003),
      firstName: 'Priya',
      lastName: 'Nair',
      gender: 'Female',
      dateOfBirth: isoDate(1997, 11, 9),
      country: 'India',
      city: 'Delhi',
      heightCm: 158,
      email: 'priya.nair@client.com',
      phoneNumber: '+91 98765 10003',
      undergraduateCollege: 'Delhi University',
      degree: 'M.A. Economics',
      income: 1500000,
      currentCompany: 'Deloitte',
      designation: 'Business Consultant',
      maritalStatus: 'Never Married',
      languagesKnown: ['English', 'Malayalam', 'Hindi'],
      siblings: '1 elder brother',
      caste: 'Nair',
      religion: 'Hindu',
      wantKids: 'Maybe',
      openToRelocate: 'Yes',
      openToPets: 'Yes',
      motherTongue: 'Malayalam',
      community: 'Nair',
      diet: 'Non-Vegetarian',
      smoking: 'No',
      drinking: 'No',
      familyType: 'Nuclear',
      manglikStatus: 'Non-Manglik',
      profileVerified: true,
      bio: 'Calm, thoughtful, and professionally ambitious. Wants a respectful, emotionally present partner.',
      hobbies: ['Reading', 'Cooking', 'Pilates'],
      journeyStage: 'Profile Review',
      statusTag: 'Needs Follow-up',
      assignedTo: matchmakerUsername,
      createdAtLabel: 'Added 1 week ago',
    },
    {
      _id: objectIdHex(9004),
      firstName: 'Kabir',
      lastName: 'Singh',
      gender: 'Male',
      dateOfBirth: isoDate(1989, 9, 25),
      country: 'India',
      city: 'Pune',
      heightCm: 182,
      email: 'kabir.singh@client.com',
      phoneNumber: '+91 98765 10004',
      undergraduateCollege: 'NMIMS',
      degree: 'MBA',
      income: 4800000,
      currentCompany: 'Zomato',
      designation: 'Growth Director',
      maritalStatus: 'Never Married',
      languagesKnown: ['Hindi', 'English', 'Punjabi'],
      siblings: 'No siblings',
      caste: 'Khatri',
      religion: 'Sikh',
      wantKids: 'Yes',
      openToRelocate: 'Maybe',
      openToPets: 'Yes',
      motherTongue: 'Punjabi',
      community: 'Singh',
      diet: 'Non-Vegetarian',
      smoking: 'Occasionally',
      drinking: 'Socially',
      familyType: 'Joint',
      manglikStatus: 'Non-Manglik',
      profileVerified: true,
      bio: 'Direct, grounded, and modern. Seeks someone who is curious, kind, and open to building a shared life.',
      hobbies: ['Travel', 'Music', 'Fitness'],
      journeyStage: 'Intro Calls',
      statusTag: 'Warm Lead',
      assignedTo: matchmakerUsername,
      createdAtLabel: 'Added 2 weeks ago',
    },
  ]
}

function buildProfiles() {
  const profiles = []
  let sequenceId = 1

  for (let index = 0; index < 50; index += 1) {
    profiles.push(buildProfile('Female', index, sequenceId))
    sequenceId += 1
  }

  for (let index = 0; index < 50; index += 1) {
    profiles.push(buildProfile('Male', index, sequenceId))
    sequenceId += 1
  }

  return profiles
}

function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const customers = buildCustomers()
  const profiles = buildProfiles()

  const customerNames = new Set(customers.map((item) => `${item.firstName} ${item.lastName}`))
  const profileNames = profiles.map((item) => `${item.firstName} ${item.lastName}`)
  const uniqueProfileNames = new Set(profileNames)

  if (profiles.length !== 100) {
    throw new Error(`Expected 100 profiles, got ${profiles.length}`)
  }

  if (uniqueProfileNames.size !== 100) {
    throw new Error(`Expected 100 unique profile names, got ${uniqueProfileNames.size}`)
  }

  profileNames.forEach((name) => {
    if (customerNames.has(name)) {
      throw new Error(`Profile name collides with customer name: ${name}`)
    }
  })

  fs.writeFileSync(path.join(OUTPUT_DIR, 'customers.json'), `${JSON.stringify(customers, null, 2)}\n`)
  fs.writeFileSync(path.join(OUTPUT_DIR, 'profiles.json'), `${JSON.stringify(profiles, null, 2)}\n`)

  console.log(`Wrote ${customers.length} customers to src/data/json/customers.json`)
  console.log(`Wrote ${profiles.length} unique profiles to src/data/json/profiles.json`)
}

main()
