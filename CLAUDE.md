# AI-Assisted Journaling Webapp

Research-focused journaling app studying how different AI personality types affect reflection depth. Users log in with a 4-digit PIN, write journal entries, and engage in a 3-turn LLM conversation.

## Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, SQLite3 (better-sqlite3)
- **LLM**: Google Gemini 2.5 Pro
- **Speech**: Web Speech API (browser-native)

## Project Structure
```
paij/
├── client/src/          # React frontend
│   ├── components/      # UI components (Auth, Write, History, Chat, Common)
│   ├── hooks/           # useAuth, useSpeechToText, useChat
│   ├── context/         # AuthContext
│   └── services/api.js  # API calls
├── server/              # Express backend
│   ├── routes/          # auth, entries, conversations, chat, admin
│   ├── controllers/     # Route handlers
│   ├── config/          # database.js, gemini.js
│   └── database/        # schema.sql, journal.db
```

## Commands
- `npm run dev` - Start dev servers (client + server)
- `npm run client` - Start frontend only
- `npm run server` - Start backend only
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

## Database
SQLite with 3 tables: `users` (PIN, system_prompt), `entries` (journal content), `conversations` (JSON message history)

## Coding Standards
- Use functional React components with hooks
- Tailwind for all styling (no separate CSS files)
- Named exports for components
- Controllers handle business logic, routes handle HTTP
- Store Gemini API key in environment variables only

## File Boundaries
- Safe to edit: `/client/src/`, `/server/routes/`, `/server/controllers/`
- Config files: `/server/config/` (be careful with API keys)
- Never commit: `journal.db`, `.env`, `node_modules/`

## Key Implementation Details
- PIN is 4 digits, must be unique
- Chat popup auto-closes after 3 LLM responses
- Each user can have a different system prompt (for research conditions)
- Admin panel at hidden route for bulk prompt management
- Mobile-first responsive design

## Workflow
- Reference PLAN.md for implementation phases and component details
- Present a plan before implementing new features
- Test authentication flow after any auth changes
- Run lint before committing
