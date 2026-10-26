from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    messages: list
    response_style: str = "balanced"
    system_prompt: str = ""
    model: str = "layla"


@app.get("/")
def home():
    return {"message": "Layla API is running"}

@app.get("/models")
def get_models():
    response = requests.get(
        "http://localhost:11434/api/tags",
        timeout=10
    )
    response.raise_for_status()

    data = response.json()

    return {
        "models": [
            {
                "name": model["name"],
                "size": model.get("size", 0)
            }
            for model in data.get("models", [])
        ]
    }

@app.post("/title")
def generate_title(request: ChatRequest):
    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "layla",
            "messages": [
    {
        "role": "system",
        "content": """
You generate conversation titles for a chat application.

Your task is NOT to answer the user.
Your task is NOT to have a conversation.

Read the user's message and summarize its topic in 2 to 6 words.

Return ONLY the title.
No quotes.
No punctuation.
No greetings.
Never mention the user.
Never mention yourself.
Never describe the title-generation task.
"""
    },
    {
        "role": "user",
        "content": request.messages[-1]["content"]
    }
],
            "stream": False
        }
    )

    data = response.json()

    return {
        "title": data["message"]["content"].strip()
    }

@app.post("/chat")
def chat(request: ChatRequest):
    style_instructions = {
        "concise": "Answer concisely. Prioritize the key information and avoid unnecessary detail.",
        "balanced": "Give clear, useful answers with enough explanation, without unnecessary filler.",
        "detailed": "Give thorough explanations with examples and relevant context when useful."
    }

    style = request.response_style.lower()
    style_instruction = style_instructions.get(
        style,
        style_instructions["balanced"]
    )

    system_instruction = style_instruction

    if request.system_prompt.strip():
        system_instruction += (
            "\n\nAdditional instructions from the user:\n"
            + request.system_prompt.strip()
        )

    messages = [
        {
            "role": "system",
            "content": system_instruction
        },
        *request.messages
    ]

    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": request.model,
            "messages": messages,
            "stream": True
        },
        stream=True
    )

    def generate():
        for line in response.iter_lines():
            if line:
                yield line + b"\n"

    return StreamingResponse(
        generate(),
        media_type="application/x-ndjson"
    )