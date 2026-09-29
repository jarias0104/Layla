import requests

response = requests.post(
    "http://localhost:11434/api/generate",
    json={
        "model": "layla",
        "prompt": "Hello Layla, introduce yourself in one sentence.",
        "stream": False
    }
)

print(response.json())