import { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import Settings from "./components/Settings";

function App() {
  const [message, setMessage] = useState("");
  const [showSettings, setShowSettings] = useState(false);
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
<<<<<<< Updated upstream
  const messageIndex = messages.indexOf(message);

  if(messageIndex <= 0 || message.role !== "assistant"){
    return;
  }

  const userMessage = messages[messageIndex -1];
  
  if (userMessage.role !== "user"){
    return;
  }
  
=======
  const messageIndex = messages.findIndex(
    msg => msg.id === message.id
  );

  if (messageIndex <= 0 || message.role !== "assistant") {
    return;
  }

  const userMessage = messages[messageIndex - 1];

  if (userMessage.role !== "user") {
    return;
  }

>>>>>>> Stashed changes
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

  const isFirstMessage = messages.length === 0;

  let newTitle = null;

  if (isFirstMessage){
    const titleResponse = await fetch("http://127.0.0.1:8000/title", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [newMessage]
      })
    });

    const titleData = await titleResponse.json();
    
    newTitle = titleData.title;
    // console.log("generated title:", titleData.title);
  }

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
  id: crypto.randomUUID(),
  role: "assistant",
  content: "",
  timestamp: new Date().toISOString()
};

setChats(prevChats =>
  prevChats.map(chat =>
    chat.id === activeChatId
      ? {
          ...chat,
          title:
            chat.title === "New Chat"
              ? newTitle ?? chat.title
              : chat.title,
          messages:
            regenerateIndex !== null
              ? [
                  ...chat.messages.slice(0, regenerateIndex),
                  streamingMessage,
                  ...chat.messages.slice(regenerateIndex + 1)
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
    messages: updatedMessages,
    response_style: localStorage.getItem("layla-response-style") || "balanced",
    system_prompt: localStorage.getItem("layla-system-prompt") || ""
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
                messages: chat.messages.map(msg =>
                  msg.id === streamingMessage.id
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
    setChats(prevChats =>
      prevChats.map(chat =>
        chat.id === activeChatId
          ? {
              ...chat,
              messages: chat.messages.filter(
                msg => msg.id !== streamingMessage.id || msg.content !== ""
              )
            }
          : chat
      )
    );

    return;
  }

  console.error("Error:", error);

  const errorMessage = {
      id: streamingMessage.id,
      role: "assistant",
      content: "Sorry, I couldn't connect to Layla.",
      timestamp: new Date().toISOString()
    };

    setChats(prevChats =>
  prevChats.map(chat =>
    chat.id === activeChatId
      ? {
          ...chat,
          messages: chat.messages.map(msg => 
            msg.id === streamingMessage.id
            ? errorMessage
            : msg
          )
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
            onSettings={() => setShowSettings(true)} 
          />

        
          <section className="main">
            {showSettings ? (
              <Settings onClose={() => setShowSettings(false)} />
            ) : (
              <>
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
              </>
            )}
          </section>

        </div> 
  );
}

export default App;