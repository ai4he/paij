# AI-Assisted Journaling Webapp

A research-focused journaling application designed to study how different [coming soon] types affect users' journal entries.

## Features

- **PIN-based Authentication**: Simple 4-digit PIN login for research participants
- **Journal Writing**: Text entry with speech-to-text support (Web Speech API)
- **AI Reflection Chat**: 3-turn conversation with Gemini 2.5 Pro after each entry
- **History View**: Browse past entries and conversations with date filtering
- **Admin Panel**: Bulk manage system prompts for different research conditions
- **Responsive Design**: Mobile-first, works on all devices

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router
- **Backend**: Node.js, Express, SQLite3 (better-sqlite3)
- **LLM**: Google Gemini 2.5 Pro
- **Speech**: Web Speech API (Chrome, Edge, Safari)

## Prerequisites

- Node.js 18+
- npm 9+
- Google AI Studio API key ([Get one here](https://aistudio.google.com/apikey))

## Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd paij
npm install
```

### 2. Configure Environment

Create the server environment file:

```bash
cp server/.env.example server/.env
```

Edit `server/.env` with your credentials:

```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
ADMIN_KEY=your_secret_admin_key_here
```

### 3. Start Development Servers

```bash
npm run dev
```

This starts both:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

## Usage

### For Participants

1. Open http://localhost:5173
2. Click "Generate New PIN" to get a 4-digit PIN
3. Save your PIN and use it to log in
4. Write journal entries in the "Write" tab
5. After saving, chat with the AI assistant (3 exchanges)
6. View past entries in the "History" tab

### For Researchers (Admin Panel)

1. Navigate to http://localhost:5173/admin
2. Enter your `ADMIN_KEY`
3. Select participants to modify
4. Enter new system prompt and click "Update"

## Project Structure

```
paij/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   │   ├── Admin/      # Admin panel
│   │   │   ├── Auth/       # Login, PIN input
│   │   │   ├── Chat/       # LLM chat popup
│   │   │   ├── Common/     # Modal, shared components
│   │   │   ├── History/    # Entry history view
│   │   │   ├── Layout/     # Header, navigation
│   │   │   └── Write/      # Journal writing
│   │   ├── hooks/          # Custom React hooks
│   │   ├── context/        # Auth context
│   │   └── services/       # API client
│   └── package.json
├── server/                 # Express backend
│   ├── config/             # Database, Gemini config
│   ├── controllers/        # Route handlers
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── database/           # SQLite schema
│   └── package.json
└── package.json            # Root workspace config
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with PIN |
| POST | `/api/auth/register` | Generate new PIN |

### Journal Entries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries?userId=X` | Get user's entries |
| POST | `/api/entries` | Create new entry |
| GET | `/api/entries/:id` | Get specific entry |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations/:entryId` | Get conversation for entry |
| POST | `/api/conversations` | Save conversation |

### Chat
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send message to Gemini |

### Admin (requires X-Admin-Key header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/prompts` | Bulk update prompts |

## Database Schema

```sql
-- Users (PIN-based auth, per-user system prompts)
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    pin TEXT UNIQUE NOT NULL,
    system_prompt TEXT,
    created_at DATETIME
);

-- Journal entries
CREATE TABLE entries (
    id INTEGER PRIMARY KEY,
    user_id INTEGER,
    content TEXT,
    entry_date DATE,
    entry_timestamp DATETIME
);

-- LLM conversations (JSON messages)
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY,
    entry_id INTEGER,
    user_id INTEGER,
    messages TEXT,
    created_at DATETIME
);
```

## Customizing System Prompts

Each user can have a unique system prompt for research conditions:

**Baseline (default):**
```
[Coming soon]
```

## Browser Compatibility

| Feature | Chrome | Edge | Safari | Firefox |
|---------|--------|------|--------|---------|
| Core App | Yes | Yes | Yes | Yes |
| Speech-to-Text | Yes | Yes | Yes | No* |

*Firefox does not support the Web Speech API. Users on Firefox can still type entries manually.

## Scripts

```bash
npm run dev      # Start both servers
npm run client   # Start frontend only
npm run server   # Start backend only
npm run lint     # Run ESLint
npm run format   # Run Prettier
```

## Troubleshooting

### "Chat service not configured"
- Ensure `GEMINI_API_KEY` is set in `server/.env`
- Restart the server after adding the key

### Speech-to-text not working
- Use Chrome, Edge, or Safari
- Allow microphone permissions when prompted
- Check that you're on HTTPS or localhost

### Timestamps showing wrong time
- Timestamps are stored in UTC and converted to local time on display
- If still incorrect, check your system timezone settings

## License

MIT
