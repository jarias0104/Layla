import { useState, useEffect, useRef } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";

function App() {
  const [message, setMessage] = useState("");
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

  if (savedChats) {
    const parsedChats = JSON.parse(savedChats);
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
  async function sendMessage() {
  if (message.trim() === "") {
    return;
  }

  const newMessage = {
    role: "user",
    content: message
  };

  const updatedMessages = [...messages, newMessage];

 setChats(prevChats =>
  prevChats.map(chat =>
    chat.id === activeChatId
      ? {
          ...chat,
          title:
            chat.messages.length === 0
              ? message.slice(0, 30)
              : chat.title,
          messages: updatedMessages
        }
      : chat
  )
);

  setMessage("");
  setIsThinking(true);

  try {
  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: updatedMessages
    })
  });

  const data = await response.json();

  const laylaResponse = {
    role: "assistant",
    content: data.response
  };

  setChats(prevChats =>
    prevChats.map(chat =>
      chat.id === activeChatId
        ? {
            ...chat,
            messages: [...chat.messages, laylaResponse]
          }
        : chat
    )
  );
} catch (error) {
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
  }
}

function handleKeyDown(event) {
  if (event.key === "Enter") {
    sendMessage();
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
            /> 
           <ChatInput 
            message={message}
            setMessage={setMessage}
            sendMessage={sendMessage}
            handleKeyDown={handleKeyDown}
            isThinking={isThinking}
           />    
          </section> 
        </div> 
  );
}

export default App;

