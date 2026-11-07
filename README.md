# Layla

**Layla** is a locally running AI assistant built with **Ollama, Qwen2.5, FastAPI, and React**.

The goal of the project is to build a personal AI assistant that runs entirely on the user's computer, with a custom web interface and a backend API connecting the interface to locally hosted language models.

---

## Features

### AI and Model Management
- Local AI inference using Ollama
- Qwen2.5 7B Instruct support
- Custom Ollama model named `layla`
- Retrieve installed Ollama models through the backend
- Select between installed models directly from Settings
- Persist the selected model using `localStorage`
- Configurable response styles: Concise, Balanced, and Detailed
- Custom system prompts to personalize assistant behavior

### Chat Management
- Multiple independent conversations
- Create new chats
- Switch between conversations
- Automatically generate chat titles
- Rename conversations
- Delete conversations
- Search conversations
- Persistent conversations using browser `localStorage`
- Persist the currently selected conversation

### Messaging
- Streaming responses from Ollama
- Typing indicator while Layla is generating
- Stop generation at any time
- Regenerate previous responses
- Edit and resend user messages
- Markdown rendering
- Code syntax highlighting
- Copy code blocks
- Message timestamps
- Automatic scrolling to the latest message

### Interface and Application
- React + Vite frontend
- FastAPI backend
- Dark-themed interface
- Settings page
- Custom rename and delete dialogs
- One-click Windows launcher
- Runs locally without depending on a hosted AI inference service

---

## Architecture

```text
┌─────────────────────────┐
│       React / Vite      │
│      Layla Web UI       │
│       Port 5173         │
└────────────┬────────────┘
             │
             │ HTTP Requests
             │ POST /chat
             │ POST /title
             │ GET  /models
             ▼
┌─────────────────────────┐
│        FastAPI          │
│      Layla Backend      │
│       Port 8000         │
└────────────┬────────────┘
             │
             │ Ollama API
             ▼
┌─────────────────────────┐
│         Ollama          │
│       Port 11434        │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│      Local Models       │
│       Qwen2.5 7B        │
│    Custom model: layla  │
└─────────────────────────┘
```

---

## Technologies

### Frontend
- React
- Vite
- JavaScript
- Tailwind CSS
- Browser `localStorage`

### Backend
- Python
- FastAPI
- Uvicorn
- Requests
- Pydantic

### AI
- Ollama
- Qwen2.5 7B Instruct
- Custom Ollama model: `layla`

---

## Project Structure

```text
Layla/
│
├── Start Layla.bat
│
├── layla-api/
│   ├── .venv/
│   └── main.py
│
└── layla-ui/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx
    │   │   ├── ChatList.jsx
    │   │   ├── ChatHeader.jsx
    │   │   ├── ChatMessages.jsx
    │   │   ├── Message.jsx
    │   │   ├── ChatInput.jsx
    │   │   ├── TypingIndicator.jsx
    │   │   ├── RenameChatModal.jsx
    │   │   ├── DeleteChatModal.jsx
    │   │   └── Settings.jsx
    │   │
    │   ├── App.jsx
    │   ├── App.css
    │   ├── index.css
    │   └── main.jsx
    │
    ├── package.json
    └── ...
```

---

## Requirements

Before running Layla, install:

- Windows
- Python
- Node.js
- npm
- Ollama
- At least one Ollama model

The project was developed and tested with a local NVIDIA GPU.

---

# Installation

## 1. Install Ollama

Install Ollama on your computer.

Verify that it is available:

```bash
ollama --version
```

---

## 2. Install or Create the Layla Model

Layla supports multiple installed Ollama models.

The original custom model is named:

```text
layla
```

It is based on Qwen2.5 7B Instruct.

Verify your installed models:

```bash
ollama list
```

You can test the custom model directly:

```bash
ollama run layla
```

You can also install other Ollama models and select them from Layla's Settings page.

---

# Backend Setup

Navigate to the backend:

```bash
cd layla-api
```

Create a Python virtual environment:

```bash
py -m venv .venv
```

Activate it:

```bash
.venv\Scripts\activate
```

Install the required packages:

```bash
pip install fastapi uvicorn requests pydantic
```

Start the API:

```bash
uvicorn main:app --reload
```

The API will run at:

```text
http://127.0.0.1:8000
```

FastAPI documentation is available at:

```text
http://127.0.0.1:8000/docs
```

---

# Frontend Setup

Open another terminal and navigate to:

```bash
cd layla-ui
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# Running Layla

The project includes:

```text
Start Layla.bat
```

The launcher starts the local application services:

1. Ollama
2. FastAPI
3. React/Vite
4. The Layla web interface

After starting the launcher, open:

```text
http://localhost:5173
```

The launcher is intended to make starting the entire local AI stack easier.

---

# API

Layla uses FastAPI to communicate between the React frontend and Ollama.

## Health Check

```http
GET /
```

Example response:

```json
{
  "message": "Layla API is running"
}
```

## Installed Models

```http
GET /models
```

Returns the models currently installed in Ollama.

Example response:

```json
{
  "models": [
    {
      "name": "layla",
      "size": 4680000000
    }
  ]
}
```

The frontend uses this endpoint to populate the model selector in Settings.

## Generate Chat Title

```http
POST /title
```

Receives the first user message and generates a short conversation title using Ollama.

Example request:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "How do I learn React?"
    }
  ]
}
```

## Chat

```http
POST /chat
```

Receives the conversation history and assistant configuration, then forwards the request to the selected Ollama model.

Example request:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello Layla"
    }
  ],
  "response_style": "balanced",
  "system_prompt": "",
  "model": "layla"
}
```

The response is streamed using newline-delimited JSON (NDJSON), allowing Layla to display generated text progressively rather than waiting for the entire response.

---

# Chat Persistence

Layla stores conversations in the browser's `localStorage`.

Storage keys:

| Key | Purpose |
|---|---|
| `layla-chats` | Stores conversations and messages |
| `layla-active-chat` | Stores the currently selected conversation |
| `layla-model` | Stores the selected Ollama model |
| `layla-response-style` | Stores the response style |
| `layla-system-prompt` | Stores custom assistant instructions |

Each conversation contains information similar to:

```javascript
{
  id: 123456789,
  title: "My Chat",
  messages: [
    {
      id: "message-uuid",
      role: "user",
      content: "Hello Layla",
      timestamp: "2026-01-01T12:00:00.000Z"
    },
    {
      id: "message-uuid",
      role: "assistant",
      content: "Hello! How can I help?",
      timestamp: "2026-01-01T12:00:05.000Z"
    }
  ]
}
```

This allows conversations and their messages to remain available after refreshing the browser.

---

# Settings

Layla includes a Settings page for configuring the assistant.

## Model Configuration

Users can view the installed Ollama models and select which one Layla uses for chat generation.

The selected model is saved in `localStorage`, so the preference remains after refreshing the application.

## Response Style

Three response styles are available:

- **Concise:** Prioritizes key information and avoids unnecessary detail.
- **Balanced:** Provides clear explanations with an appropriate level of detail.
- **Detailed:** Provides thorough explanations, examples, and additional context when useful.

## Custom System Prompt

Users can provide additional instructions that guide Layla's behavior.

For example:

```text
When explaining code, use simple examples and explain each step.
```

These instructions are combined with the selected response style and sent to the backend with chat requests.

## Reset Settings

The Reset to Defaults button restores the Balanced response style and clears the custom system prompt.

---

# Chat Management

## Multiple Conversations

Users can create multiple independent conversations and switch between them.

Example:

```text
+ New Chat

Hello Layla
Learning Python
Music Ideas
SQL Practice
```

## Automatic Titles

When a new conversation receives its first message, Layla generates a short title using the local Ollama model.

## Rename and Delete

Existing conversations can be renamed or deleted.

Layla prevents the user from deleting the final remaining conversation.

## Search Conversations

Users can search their existing conversations to find previous discussions.

---

# Message Features

## Streaming

Layla displays responses as Ollama generates them, rather than waiting for the complete response.

## Stop Generation

Users can stop an ongoing response using the stop-generation control.

## Regenerate Response

Users can request another response to a previous message without manually sending the same question again.

## Edit and Resend

Users can edit a previously sent message and submit the revised version.

## Markdown and Code

Layla supports Markdown formatting and code presentation, including code syntax highlighting and code-copy functionality.

## Timestamps

Messages include timestamps to indicate when they were sent or generated.

---

# Development

Frontend:

```bash
cd layla-ui
npm run dev
```

Backend:

```bash
cd layla-api
.venv\Scripts\activate
uvicorn main:app --reload
```

Ollama:

```bash
ollama serve
```

---

# Troubleshooting

## Layla Doesn't Respond

Check that Ollama is running:

```bash
ollama list
```

Test the selected model directly:

```bash
ollama run layla
```

Check that FastAPI is running:

```text
http://127.0.0.1:8000/docs
```

Check that the installed models endpoint works:

```text
http://127.0.0.1:8000/models
```

Finally, check that Vite is running:

```text
http://localhost:5173
```

## FastAPI Returns CORS Errors

The backend allows the Vite development origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

If the frontend is moved to another port or domain, the CORS configuration may need to be updated.

## Models Don't Appear in Settings

Make sure Ollama is running and that at least one model is installed.

Run:

```bash
ollama list
```

Then open:

```text
http://127.0.0.1:8000/models
```

If the endpoint does not return the installed models, check that Ollama is available at port `11434`.

## Chats Disappear After Refreshing

Layla uses browser `localStorage`.

Check the browser's stored data for:

```text
layla-chats
```

The active conversation is stored separately under:

```text
layla-active-chat
```

Clearing browser storage can remove saved conversations and preferences.

---

# Roadmap

Possible future improvements:

- [ ] Conversation database instead of browser-only storage
- [ ] Voice input
- [ ] Text-to-speech
- [ ] Tool and function calling
- [ ] File uploads
- [ ] Long-term memory
- [ ] Personal assistant actions
- [ ] Improved launcher
- [ ] Mobile-responsive UI
- [ ] User-configurable model parameters
- [ ] Improved conversation management

---

# Project Goal

Layla is being developed as a personal local AI assistant rather than simply a chatbot interface.

The long-term goal is to give Layla the ability to:

```text
Understand
    ↓
Reason
    ↓
Remember
    ↓
Use tools
    ↓
Perform actions
    ↓
Interact naturally
```

The project is being developed incrementally, starting with a local chat system and gradually adding more advanced assistant capabilities.

---

## Author

**Jeshua Arias**

Layla is a personal software project focused on learning and experimenting with:

- Artificial Intelligence
- Local LLMs
- React
- Python
- FastAPI
- APIs
- Software architecture
- Human-computer interaction
