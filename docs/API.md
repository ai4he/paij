# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

### Login

Authenticate with an existing PIN.

```
POST /auth/login
```

**Request Body:**
```json
{
  "pin": "1234"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "pin": "1234"
}
```

**Error Response (401):**
```json
{
  "message": "Invalid PIN"
}
```

---

### Register

Generate a new unique 4-digit PIN.

```
POST /auth/register
```

**Request Body:** None

**Success Response (201):**
```json
{
  "id": 2,
  "pin": "5678"
}
```

---

## Journal Entries

### Get Entries

Retrieve all entries for a user, optionally filtered by date.

```
GET /entries?userId={userId}&date={date}
```

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| userId | integer | Yes | User ID |
| date | string | No | Filter by date (YYYY-MM-DD) |

**Success Response (200):**
```json
[
  {
    "id": 1,
    "user_id": 1,
    "content": "Today was a good day...",
    "entry_date": "2024-01-15",
    "entry_timestamp": "2024-01-15 14:30:00"
  }
]
```

---

### Create Entry

Save a new journal entry.

```
POST /entries
```

**Request Body:**
```json
{
  "userId": 1,
  "content": "Today I learned about..."
}
```

**Success Response (201):**
```json
{
  "id": 5,
  "user_id": 1,
  "content": "Today I learned about...",
  "entry_date": "2024-01-15",
  "entry_timestamp": "2024-01-15 14:30:00"
}
```

---

### Get Entry

Retrieve a specific entry by ID.

```
GET /entries/:id
```

**Success Response (200):**
```json
{
  "id": 1,
  "user_id": 1,
  "content": "Today was a good day...",
  "entry_date": "2024-01-15",
  "entry_timestamp": "2024-01-15 14:30:00"
}
```

**Error Response (404):**
```json
{
  "message": "Entry not found"
}
```

---

## Conversations

### Get Conversation

Retrieve the conversation associated with a journal entry.

```
GET /conversations/:entryId
```

**Success Response (200):**
```json
{
  "id": 1,
  "entry_id": 5,
  "user_id": 1,
  "messages": [
    { "role": "user", "content": "Today I learned about..." },
    { "role": "assistant", "content": "That sounds interesting! What specifically..." },
    { "role": "user", "content": "Well, I found that..." },
    { "role": "assistant", "content": "How did that make you feel?" }
  ],
  "created_at": "2024-01-15 14:35:00"
}
```

**Error Response (404):**
```json
{
  "message": "Conversation not found"
}
```

---

### Save Conversation

Store a completed conversation.

```
POST /conversations
```

**Request Body:**
```json
{
  "entryId": 5,
  "userId": 1,
  "messages": [
    { "role": "user", "content": "Today I learned about..." },
    { "role": "assistant", "content": "That sounds interesting!..." }
  ]
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "entry_id": 5,
  "user_id": 1,
  "messages": [...],
  "created_at": "2024-01-15 14:35:00"
}
```

---

## Chat

### Send Message

Send a message to the Gemini LLM and receive a response.

```
POST /chat/message
```

**Request Body:**
```json
{
  "userId": 1,
  "messages": [
    { "role": "user", "content": "Today I had a stressful day..." },
    { "role": "assistant", "content": "I'm sorry to hear that..." },
    { "role": "user", "content": "Thanks, I appreciate that." }
  ]
}
```

The `messages` array should contain the full conversation history. The last message should be the user's new input.

**Success Response (200):**
```json
{
  "role": "assistant",
  "content": "It sounds like you handled that situation well..."
}
```

**Error Response (503):**
```json
{
  "message": "Chat service not configured. Please add Gemini API key."
}
```

---

## Admin

All admin endpoints require the `X-Admin-Key` header.

### Get Users

List all users with their system prompts.

```
GET /admin/users
```

**Headers:**
```
X-Admin-Key: your-admin-key
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "pin": "1234",
    "system_prompt": "You are a reflective chatbot...",
    "created_at": "2024-01-15 10:00:00"
  },
  {
    "id": 2,
    "pin": "5678",
    "system_prompt": "You are an enthusiastic coach...",
    "created_at": "2024-01-15 11:00:00"
  }
]
```

**Error Response (403):**
```json
{
  "message": "Admin access required"
}
```

---

### Update Prompts

Bulk update system prompts for multiple users.

```
PUT /admin/prompts
```

**Headers:**
```
X-Admin-Key: your-admin-key
```

**Request Body:**
```json
{
  "userIds": [1, 2, 3],
  "systemPrompt": "You are a thoughtful listener who asks gentle questions..."
}
```

**Success Response (200):**
```json
{
  "message": "Updated 3 user(s)"
}
```

---

## Error Handling

All endpoints may return these error responses:

| Status | Description |
|--------|-------------|
| 400 | Bad Request - Missing or invalid parameters |
| 401 | Unauthorized - Invalid PIN or user |
| 403 | Forbidden - Admin access required |
| 404 | Not Found - Resource doesn't exist |
| 500 | Internal Server Error |
| 503 | Service Unavailable - Gemini API not configured |

Error response format:
```json
{
  "message": "Description of the error"
}
```
