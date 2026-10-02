import { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

function App() {
  const [message, setMessage] = useState("");
  const abortControllerRef = useRef(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [chats, setChats] = useState(() => {
  const savedChats = localStorage.getItem("layla-chats");
  

  return savedChats
    ? JSON.parse(savedChats)
    : [
        {
          id: 1,
          title: "New Chat",
          messages: []
        }
      ];
});

const [activeChatId, setActiveChatId] = useState(() => {
  const savedChats = localStorage.getItem("layla-chats");
  const savedActiveChat = localStorage.getItem("layla-active-chat");

  if (savedChats) {
    const parsedChats = JSON.parse(savedChats);

    if (
      savedActiveChat &&
      parsedChats.some(chat => chat.id === Number(savedActiveChat))
    ) {
      return Number(savedActiveChat);
    }

    return parsedChats[0]?.id ?? 1;
  }

  return 1;
});

const activeChat = chats.find(chat => chat.id === activeChatId);
const messages = activeChat ? activeChat.messages : [];
const [isThinking, setIsThinking] = useState(false);
const messagesEndRef = useRef(null);

  useEffect(() => {
  messagesEndRef.current?.scrollIntoView({
    behavior: "smooth"
  });
}, [messages, isThinking]);

useEffect(() => {
  localStorage.setItem("layla-chats", JSON.stringify(chats));
}, [chats]);

useEffect(() => {
  localStorage.setItem("layla-active-chat", activeChatId);
}, [activeChatId]);

// stop layla while generating a msg
function stopGenerating () {
  abortControllerRef.current?.abort();
}

// regenerates a msg
function regenerateResponse(message) {
  const messageIndex = messages.indexOf(message);
  const userMessage = messages[messageIndex -1];
  
  sendMessage(userMessage.content, messageIndex);
}

// edit a sent msg
function editMessage(message) {
  const messageIndex = messages.indexOf(message);

  setEditingMessage({
    ...message,
    index: messageIndex
  });

  setMessage(message.content);
}

async function sendMessage(messageToSend = message, regenerateIndex = null, editIndex = null) {
  if (messageToSend.trim() === "") {
    return;
  }

  const newMessage = {
    role: "user",
    content: messageToSend,
    timestamp: new Date().toISOString()
  };

const updatedMessages = 
  regenerateIndex !== null
  ? messages.slice(0, regenerateIndex)
  : editIndex !== null
    ? [
        ...messages.slice(0, editIndex),
        newMessage
    ]
    : [...messages, newMessage];

const streamingMessage = {
  role: "assistant",
  content: "",
  timestamp: new Date().toISOString()
};

setChats(prevChats =>
  prevChats.map(chat =>
    chat.id === activeChatId
      ? {
          ...chat,
          messages:
            regenerateIndex !== null
              ? [
                  ...chat.messages.slice(0, regenerateIndex),
                  streamingMessage
                ]
              : editIndex !== null
                ? [
                    ...chat.messages.slice(0, editIndex),
                    newMessage,
                    streamingMessage
                  ]
                : [...chat.messages, newMessage, streamingMessage]  
        }
      : chat
  )
);

  setMessage("");
  setEditingMessage(null);
  setIsThinking(true);

  try {
  const controller = new AbortController();
  abortControllerRef.current = controller;

  const response = await fetch("http://127.0.0.1:8000/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    messages: updatedMessages
  }),
  signal: controller.signal
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

let buffer = "";
let assistantMessage = "";

while (true) {
  const { value, done } = await reader.read();

  if (done) {
    break;
  }

  buffer += decoder.decode(value);

  const lines = buffer.split("\n");

  buffer = lines.pop() || "";

  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }

    //console.log("LINE:", line);

    const data = JSON.parse(line);

    if (data.message?.content) {
      assistantMessage += data.message.content;

      setChats(prevChats =>
        prevChats.map(chat =>
          chat.id === activeChatId
            ? {
                ...chat,
                messages: chat.messages.map((msg, index) =>
                    index ===
                      (regenerateIndex !== null
                        ? regenerateIndex
                        : editIndex !== null
                          ? editIndex + 1
                          : chat.messages.length - 1)
                    ? {
                        ...msg,
                        content: assistantMessage
                      }
                    : msg
                )
              }
            : chat
        )
      );
    }
  }
}

} catch (error) {
  if (error.name === "AbortError") {
    return;
  }

  console.error("Error:", error);

  const errorMessage = {
      role: "assistant",
      content: "Sorry, I couldn't connect to Layla."
    };

    setChats(prevChats =>
  prevChats.map(chat =>
    chat.id === activeChatId
      ? {
          ...chat,
          messages: [...chat.messages, errorMessage]
        }
      : chat
  )
);
  } finally {
    setIsThinking(false);
    abortControllerRef.current = null;
  }
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    sendMessage(
      message,
      null,
      editingMessage?.index ?? null
    );
  }
}

function createNewChat() {
  const newChat = {
    id: Date.now(),
    title: "New Chat",
    messages: []
  };

  setChats(prevChats => [...prevChats, newChat]);
  setActiveChatId(newChat.id);
}

  return ( 
      <div className="app"> 
          <Sidebar 
            onNewChat={createNewChat}
            chats={chats}
            activeChatId={activeChatId}
            setActiveChatId={setActiveChatId}
            setChats={setChats} 
          />

          <section className="main"> 
           <ChatHeader activeChat={activeChat} /> 
           <ChatMessages
            messages={messages}
            isThinking={isThinking}
            messagesEndRef={messagesEndRef}
            onRegenerate={regenerateResponse}
            onEdit={editMessage}
            /> 
           <ChatInput 
            message={message}
            setMessage={setMessage}
            sendMessage={() => 
              sendMessage(
                message,
                null,
                editingMessage?.index ?? null
              )
            }
            handleKeyDown={handleKeyDown}
            isThinking={isThinking}
            stopGenerating={stopGenerating}
           />    
          </section> 
        </div> 
  );
}

export default App;