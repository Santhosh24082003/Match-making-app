# DateCrew Matchmaker MVP

This workspace contains a modular Express backend backed by MongoDB Atlas and a React + Tailwind frontend for the Matchmaker Dashboard MVP.

## What it does
- Matchmaker login with JWT auth
- Customer dashboard with journey tracking
- Detailed customer biodata view
- 100 seeded opposite-gender profiles for matching simulation
- Gender-specific ranking logic with readable AI-style explanations
- Mock "Send Match" action that creates a generated intro email payload
- Notes capture for meetings and calls

## Setup

### 1. Backend
Create `backend/.env` from `backend/.env.example` and provide your MongoDB Atlas connection string.

Required values:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_ORIGIN`

Install and run:
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend
Create `frontend/.env` from `frontend/.env.example` if you want to point the client at a deployed API. For local development the Vite proxy already forwards `/api` to `http://localhost:5000`.

Install and run:
```bash
cd frontend
npm install
npm run dev
```

## Sample login credentials
- Username: `sathosh@onlinematch.com`
- Password: `match123`

## Matching logic
- Male customer matches prioritize younger women, lower income, shorter height, and aligned views on children.
- Female customer matches prioritize professional stability, values alignment, relocation flexibility, lifestyle fit, and family compatibility.
- Every profile gets a score and a human-readable reason summary so the ranking feels explainable.

## AI usage
The MVP keeps the core score engine deterministic, but now uses Gemini for the short compatibility explanation and intro message when `GEMINI_API_KEY` is present. If the key is not configured, the backend falls back to the built-in explanation layer so the app still works locally.

## Additional Indian matchmaking fields
The profile model includes community, religion, mother tongue, family type, diet, smoking, drinking, and Manglik status because those fields are common decision factors in Indian matrimony workflows.
