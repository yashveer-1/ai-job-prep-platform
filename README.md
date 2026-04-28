# Interview Master

Interview Master is a full-stack AI interview preparation app. Users can register, log in, upload or paste a resume, paste a job description, and generate a structured interview report with a match score, technical questions, behavioral questions, skill gaps, and preparation tips.

## Features

- Cookie-based authentication with protected React routes
- Resume input via PDF upload or pasted text
- Gemini-powered interview report generation
- Zod validation for AI response shape
- Saved interview reports per user
- Recent report history in the dashboard
- Bright and dark dashboard themes
- Custom Interview Master branding and favicon

## Tech Stack

- Frontend: React, Vite, Sass, Axios, React Router
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT stored in httpOnly cookies
- Uploads: Multer memory storage
- PDF parsing: pdf-parse
- AI: Google GenAI / Gemini
- Validation: Zod

## Architecture

```text
React/Vite frontend
  -> Express REST API
  -> MongoDB via Mongoose
  -> Gemini report generation service
```

## Project Structure

```text
backend/
  server.js
  src/app.js
  src/controllers/
  src/middlewares/
  src/models/
  src/routes/
  src/services/

frontend/
  public/
  src/features/auth/
  src/features/interview/
  src/services/
```

## Setup

1. Install backend dependencies:

```bash
cd backend
npm install
```

2. Create backend environment file:

```bash
cp .env.example .env
```

Then fill in `MONGO_URI`, `JWT_SECRET`, and `GOOGLE_GENAI_API_KEY`.

3. Install frontend dependencies:

```bash
cd ../frontend
npm install
```

4. Optional frontend environment file:

```bash
cp .env.example .env
```

The default frontend API fallback is `http://localhost:5000/api`.

5. Run the backend:

```bash
cd backend
npm run dev
```

6. Run the frontend:

```bash
cd frontend
npm run dev
```

## API Overview

- `POST /api/auth/register` creates a user and sets an auth cookie
- `POST /api/auth/login` logs in and sets an auth cookie
- `POST /api/auth/logout` clears the auth cookie and blacklists the token
- `GET /api/auth/get-me` returns the current user
- `POST /api/interview` generates and saves an interview report
- `GET /api/interview` lists recent saved reports for the current user
- `GET /api/interview/:id` returns one saved report owned by the current user

## Interview Talking Points

- The app separates routes, controllers, services, middleware, and models.
- Auth uses httpOnly cookies rather than localStorage tokens.
- File uploads are parsed in memory and never written to disk.
- AI output is validated before it is returned or persisted.
- Reports are user-owned and can be revisited from history.

## Production Notes

- Do not commit `.env` files or real API keys.
- Rotate any exposed MongoDB or GenAI credentials.
- Add rate limiting before exposing AI generation publicly.
- Add automated tests around auth, report validation, and report ownership.
