# AI-Assisted Journaling Webapp - Implementation Plan

## Project Overview

A research-focused journaling application designed to study how different AI personality types (extraverted, introverted, baseline) affect the depth of personal reflection in users' journal entries.

---

## Tech Stack Recommendations

### Frontend
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **React 18** | UI Framework | Component-based architecture, excellent state management, large ecosystem |
| **Vite** | Build Tool | Fast development server, optimized production builds |
| **Tailwind CSS** | Styling | Utility-first CSS, responsive design out-of-the-box, mobile-first approach |
| **React Router** | Navigation | Tab-based routing between Write and History views |

### Backend
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Node.js + Express** | Server | JavaScript consistency across stack, robust middleware ecosystem |
| **SQLite3 (better-sqlite3)** | Database | Lightweight, file-based, perfect for research studies, easy data export |
| **CORS** | Security | Cross-origin resource sharing for API calls |

### APIs & Services
| Technology | Purpose | Rationale |
|------------|---------|-----------|
| **Google Gemini 2.5 Pro** | LLM Integration | Specified in requirements |
| **Web Speech API** | Speech-to-Text | Native browser API, no external dependencies |

### Development Tools
| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **nodemon** | Development server auto-restart |

---

## File/Folder Structure

```
paij/
├── PLAN.md
├── README.md
├── package.json
│
├── client/                          # Frontend React Application
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── public/
│   │   └── favicon.ico
│   └── src/
│       ├── main.jsx                 # React entry point
│       ├── App.jsx                  # Main app component with routing
│       ├── App.css                  # Global styles
│       ├── index.css                # Tailwind imports
│       │
│       ├── components/
│       │   ├── Layout/
│       │   │   ├── Header.jsx       # Banner with tabs and sign out
│       │   │   └── TabNavigation.jsx
│       │   │
│       │   ├── Auth/
│       │   │   ├── LoginScreen.jsx  # PIN entry screen
│       │   │   └── PinInput.jsx     # 4-digit PIN component
│       │   │
│       │   ├── Write/
│       │   │   ├── WriteTab.jsx     # Main write view
│       │   │   ├── JournalEntry.jsx # Text entry with mic button
│       │   │   └── MicButton.jsx    # Speech-to-text button
│       │   │
│       │   ├── History/
│       │   │   ├── HistoryTab.jsx   # Main history view
│       │   │   ├── DateFilter.jsx   # Date selection filter
│       │   │   └── EntryCard.jsx    # Individual entry display
│       │   │
│       │   ├── Chat/
│       │   │   ├── ChatPopup.jsx    # LLM chat modal
│       │   │   ├── ChatMessage.jsx  # Individual message component
│       │   │   └── ChatInput.jsx    # User input for chat
│       │   │
│       │   └── Common/
│       │       ├── Button.jsx       # Reusable button component
│       │       ├── Modal.jsx        # Reusable modal wrapper
│       │       └── Loading.jsx      # Loading spinner
│       │
│       ├── hooks/
│       │   ├── useAuth.js           # Authentication state
│       │   ├── useSpeechToText.js   # Web Speech API hook
│       │   └── useChat.js           # LLM conversation management
│       │
│       ├── context/
│       │   └── AuthContext.jsx      # Global auth state
│       │
│       ├── services/
│       │   └── api.js               # API call functions
│       │
│       └── utils/
│           ├── dateUtils.js         # Date formatting helpers
│           └── constants.js         # App constants
│
├── server/                          # Backend Express Application
│   ├── package.json
│   ├── index.js                     # Server entry point
│   │
│   ├── config/
│   │   ├── database.js              # SQLite connection setup
│   │   └── gemini.js                # Gemini API configuration
│   │
│   ├── routes/
│   │   ├── auth.js                  # PIN login/generation routes
│   │   ├── entries.js               # Journal entry CRUD routes
│   │   ├── conversations.js         # Chat conversation routes
│   │   ├── chat.js                  # Gemini API interaction routes
│   │   └── admin.js                 # Admin routes for system prompts
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── entriesController.js
│   │   ├── conversationsController.js
│   │   ├── chatController.js
│   │   └── adminController.js
│   │
│   ├── middleware/
│   │   └── authMiddleware.js        # PIN verification middleware
│   │
│   └── database/
│       ├── schema.sql               # Database schema
│       └── journal.db               # SQLite database file (generated)
│
└── docs/
    └── API.md                       # API documentation
```

---

## Database Schema

```sql
-- Users table (PIN-based authentication)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pin TEXT UNIQUE NOT NULL,
    system_prompt TEXT DEFAULT 'You are a reflective chatbot. The user will provide you with their journal entries, and your goal is to improve the depth of their reflection. On your third output, the conversation will end.',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Journal entries table
CREATE TABLE entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    entry_date DATE NOT NULL,
    entry_timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Conversations table (LLM chat history)
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    entry_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    messages TEXT NOT NULL,  -- JSON array of messages
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (entry_id) REFERENCES entries(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## Key Components

### 1. Authentication System
- **LoginScreen**: Main login interface with PIN input
- **PinInput**: 4-digit PIN entry with validation
- **AuthContext**: Global state for current user session
- Features:
  - Login with existing 4-digit PIN
  - Generate new unique PIN
  - Sign out functionality
  - Session persistence (localStorage)

### 2. Write Tab
- **WriteTab**: Container for journal writing interface
- **JournalEntry**: Text area with character guidance
- **MicButton**: Speech-to-text toggle using Web Speech API
- Features:
  - Current date display
  - Writing prompt text
  - Auto-expanding text area
  - Real-time speech transcription
  - Save Entry button triggering chat popup

### 3. Chat Popup (LLM Integration)
- **ChatPopup**: Modal overlay for LLM conversation
- **ChatMessage**: Styled message bubbles (user vs AI)
- Features:
  - Auto-starts with journal entry as first message
  - Tracks LLM response count (max 3)
  - After 3rd LLM response, input is disabled but chat remains open
  - User can review conversation and manually close when ready
  - Conversation saved when user closes the popup
  - Loading states during API calls
  - Configurable system prompt per user

### 4. History Tab
- **HistoryTab**: Container for entry history
- **DateFilter**: Date picker for filtering entries
- **EntryCard**: Individual entry display with metadata
- Features:
  - Date-based filtering
  - Default: all entries, sorted by most recent
  - View Conversation button per entry
  - Conversation replay in modal

### 5. Admin Panel (Hidden)
- **AdminPanel**: Accessible via secret route/key combo
- Features:
  - List all PINs/users
  - Multi-select users
  - Bulk edit system prompts
  - Preview current prompts

---

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Verify PIN and return user data |
| POST | `/api/auth/register` | Generate new unique PIN |
| POST | `/api/auth/logout` | Clear session |

### Journal Entries
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/entries` | Get all entries for user (with optional date filter) |
| POST | `/api/entries` | Create new journal entry |
| GET | `/api/entries/:id` | Get specific entry |

### Conversations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/conversations/:entryId` | Get conversation for entry |
| POST | `/api/conversations` | Save completed conversation |

### Chat (LLM)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat/message` | Send message to Gemini, get response |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List all users with prompts |
| PUT | `/api/admin/prompts` | Bulk update system prompts |

---

## Implementation Order

### Phase 1: Project Setup
1. Initialize root package.json with workspaces
2. Set up client with Vite + React + Tailwind
3. Set up server with Express + SQLite
4. Create database schema and initialization script
5. Configure CORS and basic middleware

### Phase 2: Authentication
1. Create database functions for PIN operations
2. Build auth API routes and controllers
3. Create LoginScreen component
4. Create PinInput component
5. Implement AuthContext for global state
6. Add sign out functionality to Header
7. Test PIN generation and login flow

### Phase 3: Layout & Navigation
1. Create Header component with app title
2. Create TabNavigation component
3. Set up React Router for Write/History tabs
4. Implement responsive design (mobile/desktop)
5. Style banner and navigation

### Phase 4: Write Tab
1. Create WriteTab container component
2. Display current date with formatting
3. Add prompt text
4. Create JournalEntry text area component
5. Implement MicButton with Web Speech API
6. Create useSpeechToText custom hook
7. Add Save Entry button
8. Connect to entries API

### Phase 5: Chat Popup (LLM Integration)
1. Configure Gemini API in server
2. Create chat API route with streaming support
3. Build Modal component
4. Create ChatPopup component
5. Create ChatMessage component
6. Implement useChat hook for conversation state
7. Add response counter logic (max 3)
8. Disable input after 3rd response, allow user to review chat
9. Add manual close button to save and exit
10. Store conversations in database

### Phase 6: History Tab
1. Create HistoryTab container component
2. Build DateFilter component with date picker
3. Create EntryCard component
4. Implement entries fetching with filters
5. Add View Conversation button
6. Create conversation view modal
7. Style entry list for mobile/desktop

### Phase 7: Admin Panel
1. Create hidden admin route (e.g., /admin with secret key)
2. Build admin authentication
3. Create user list view
4. Implement multi-select functionality
5. Build bulk system prompt editor
6. Test prompt updates

### Phase 8: Polish & Testing
1. Add loading states throughout
2. Implement error handling and user feedback
3. Test speech-to-text across browsers
4. Test responsive design on various devices
5. Add input validation
6. Security review (PIN hashing consideration)
7. Performance optimization

### Phase 9: Documentation & Deployment
1. Write README with setup instructions
2. Document API endpoints
3. Create environment variable template
4. Add Gemini API key configuration guide
5. Prepare for deployment

---

## Configuration Points

### Gemini API Key
Location: `server/config/gemini.js`
```javascript
// TODO: Add your Gemini API key here
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';
```

### Default System Prompt
Location: `server/config/gemini.js`
```javascript
// TODO: Customize the default system prompt
const DEFAULT_SYSTEM_PROMPT = `You are a reflective chatbot. The user will provide you with their journal entries, and your goal is to improve the depth of their reflection. On your third output, the conversation will end.`;
```

---

## Responsive Design Approach

- **Mobile-first**: Base styles for mobile, scale up for desktop
- **Breakpoints**:
  - `sm`: 640px (large phones)
  - `md`: 768px (tablets)
  - `lg`: 1024px (desktops)
- **Key responsive elements**:
  - Header: Stack on mobile, inline on desktop
  - Text area: Full width on all devices
  - Entry cards: Single column on mobile, grid on desktop
  - Chat popup: Full screen on mobile, centered modal on desktop

---

## Security Considerations

1. **PIN Storage**: Consider hashing PINs for production (bcrypt)
2. **API Key Protection**: Store Gemini API key server-side only
3. **Session Management**: Use httpOnly cookies or secure localStorage
4. **Input Sanitization**: Sanitize all user inputs before database storage
5. **Rate Limiting**: Consider adding rate limiting for API endpoints
6. **Admin Access**: Secure admin panel with additional authentication

---

## Notes for Research Study

- Each PIN can have a unique system prompt, allowing for:
  - **Extraverted personality prompts**
  - **Introverted personality prompts**
  - **Baseline/control prompts**
- All conversations are stored for later analysis
- Timestamps allow for temporal analysis of entries
- Admin panel enables efficient management of experimental conditions
