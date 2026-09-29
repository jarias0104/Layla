# Layla

**Layla** is a locally running AI assistant built with **Ollama, Qwen2.5, FastAPI, and React**.

The goal of the project is to build a personal AI assistant that runs entirely on the user's computer, with a custom web interface and a backend API connecting the interface to a local language model.

---

## Features

* Local AI inference using Ollama
* Qwen2.5 7B Instruct model
* Custom Ollama model named `layla`
* React + Vite frontend
* FastAPI backend
* Multiple chat conversations
* Create new chats
* Switch between conversations
* Automatically generate chat titles
* Rename chats
* Delete chats
* Persistent conversations using `localStorage`
* Typing indicator while Layla is thinking
* Automatic scrolling to the latest message
* Dark-themed interface
* One-click launcher
* Runs completely locally

---

## Architecture

```text
┌─────────────────────────┐
│       React / Vite      │
│      Layla Web UI       │
│       Port 5173         │
└────────────┬────────────┘
             │
             │ HTTP POST /chat
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
│       Qwen2.5 7B        │
│     Custom model:       │
│         layla            │
└─────────────────────────┘
```

---

## Technologies

### Frontend

* React
* Vite
* JavaScript
* CSS
* Browser `localStorage`

### Backend

* Python
* FastAPI
* Uvicorn
* Requests
* Pydantic

### AI

* Ollama
* Qwen2.5 7B Instruct
* Custom Ollama model: `layla`

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
    │   ├── App.jsx
    │   ├── App.css
    │   └── ...
    │
    ├── package.json
    └── ...
```

---

## Requirements

Before running Layla, install:

* Windows
* Python
* Node.js
* npm
* Ollama
* Qwen2.5 or the custom `layla` model

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

## 2. Create the Layla model

Layla uses a custom Ollama model named:

```text
layla
```

The model is based on Qwen2.5 7B Instruct.

Verify that the model exists:

```bash
ollama list
```

You should see:

```text
layla
```

You can also test it directly:

```bash
ollama run layla
```

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

The launcher starts:

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

---

## Chat

```http
POST /chat
```

Request:

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello Layla"
    }
  ]
}
```

Response:

```json
{
  "response": "Hello! How can I help you?"
}
```

The backend forwards the conversation to Ollama using the `layla` model.

---

# Chat Persistence

Layla stores conversations in the browser's `localStorage`.

The storage key is:

```text
layla-chats
```

Each chat contains:

```javascript
{
  id: 123456789,
  title: "My Chat",
  messages: [
    {
      role: "user",
      content: "Hello Layla"
    },
    {
      role: "assistant",
      content: "Hello! How can I help?"
    }
  ]
}
```

This allows conversations to remain available after refreshing the browser.

---

# Current Features

### Multiple Conversations

Users can create multiple independent conversations.

```text
+ New Chat

Hello Layla
Learning Python
Music Ideas
SQL Practice
```

### Automatic Titles

The first message in a new conversation becomes its title.

For example:

```text
User:
How do I learn React?
```

The chat can automatically become:

```text
How do I learn React?
```

### Rename

Existing conversations can be renamed.

### Delete

Conversations can be deleted.

Layla prevents the user from deleting the final remaining conversation.

### Persistence

Refreshing the browser does not delete conversations because they are stored in `localStorage`.

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

## Layla doesn't respond

Check that Ollama is running:

```bash
ollama list
```

Then test the model:

```bash
ollama run layla
```

Check that FastAPI is running:

```text
http://127.0.0.1:8000/docs
```

Finally check that Vite is running:

```text
http://localhost:5173
```

---

## FastAPI returns CORS errors

The backend allows the Vite development origins:

```text
http://localhost:5173
http://127.0.0.1:5173
```

If the frontend is moved to another port or domain, the CORS configuration may need to be updated.

---

## Chats disappear after refreshing

Layla uses browser `localStorage`.

Check the browser's stored data for:

```text
layla-chats
```

The active chat is initialized from the saved conversations so that the application does not assume that chat ID `1` still exists.

---

# Roadmap

Possible future improvements:

* [ ] Streaming responses from Ollama
* [ ] Markdown rendering
* [ ] Code syntax highlighting
* [ ] Message timestamps
* [ ] Better chat rename/delete interface
* [ ] Persist the currently selected chat
* [ ] Search conversations
* [ ] Conversation database
* [ ] User settings
* [ ] Custom system prompts
* [ ] Voice input
* [ ] Text-to-speech
* [ ] Tool/function calling
* [ ] File uploads
* [ ] Long-term memory
* [ ] Personal assistant actions
* [ ] Improved launcher
* [ ] Mobile-responsive UI

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

The project is being developed incrementally, starting with a simple local chat system and gradually adding more advanced assistant capabilities.

---

## Author

**Jeshua Arias**

Layla is a personal software project focused on learning and experimenting with:

* Artificial Intelligence
* Local LLMs
* React
* Python
* FastAPI
* APIs
* Software architecture
* Human-computer interaction
