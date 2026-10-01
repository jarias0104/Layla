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


@app.get("/")
def home():
    return {"message": "Layla API is running"}


@app.post("/chat")
def chat(request: ChatRequest):
    response = requests.post(
        "http://localhost:11434/api/chat",
        json={
            "model": "layla",
            "messages": request.messages,
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