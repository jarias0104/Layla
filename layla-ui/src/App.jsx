import { useState, useEffect, useRef } from "react";
import "./App.css";

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
  return ( 
      <div className="app"> 
        <aside className="sidebar"> 
          <div className="logo"> 
            <h2>Layla</h2> 
            <span>Local AI</span>
          </div>

          <button
            className="new-chat"
            onClick={() => {
              const newChat = {
              id: Date.now(),
              title: "New Chat",
              messages: []
            };

            setChats(prevChats => [...prevChats, newChat]);
            setActiveChatId(newChat.id);
            }}
          >
            + New Chat
          </button>
          <div className="chat-list">
            {chats.map(chat => (
              <div
                key={chat.id}
                className={`chat-item ${
                  chat.id === activeChatId ? "active" : ""
                }`}
              >
                <button
                  className="chat-title"
                  onClick={() => setActiveChatId(chat.id)}
                >
                  {chat.title}
                </button>

                <button
                  className="chat-options"
                  onClick={() => {
                    const action = prompt(
                      "Type 'r' to rename or 'd' to delete:"
                    );

                    if (action === "r") {
                      const newTitle = prompt("Enter a new name:", chat.title);

                      if (newTitle && newTitle.trim() !== "") {
                        setChats(prevChats =>
                          prevChats.map(item =>
                            item.id === chat.id
                              ? {
                                  ...item,
                                  title: newTitle.trim()
                                }
                              : item
                          )
                        );
                      }
                    }

                    if (action === "d") {
                      const confirmed = confirm(
                        `Delete "${chat.title}"?`
                      );

                      if (confirmed) {
                        if (chats.length === 1) {
                          alert("You must keep at least one chat.");
                          return;
                        }

                        setChats(prevChats => {
                          const remainingChats = prevChats.filter(
                            item => item.id !== chat.id
                          );

                          return remainingChats;
                        });

                        if (chat.id === activeChatId) {
                          const remainingChats = chats.filter(
                            item => item.id !== chat.id
                          );

                          setActiveChatId(remainingChats[0].id);
                        }
                      }
                    }
                  }}
                >
                  ⋮
                </button>
              </div>
            ))}
          </div>
          <div className="sidebar-bottom"> 
            <p>Model</p> 
            <strong>layla</strong> 
            <small>Running locally</small> 
          </div> 

          </aside> 

          <section className="main"> 

            <header className="header"> 

              <div> 
                <h1>Layla</h1> 
                <span>● Online</span> 
              </div> 
            </header> 
            <main className="chat"> 

              <div className="message layla-message">
                 Hey Jeshua! How can I help you? 
              </div>

              {messages.map((msg, index) => ( 
                <div 
                  key={index} 
                  className={`message ${
                    msg.role === "user"
                    ? "user-message"
                    : "layla-message"
                  }`}
                >
                  {msg.content}
                </div> 
              ))}

              {isThinking && (
                <div className="message layla-message typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              )} 
                <div ref={messagesEndRef} />
              </main> 

              <footer className="input-area">
                <input 
                  type="text" 
                  placeholder="Message Layla..."
                  value={message} 
                  onChange={(event) => setMessage(event.target.value)} 
                  onKeyDown={handleKeyDown} 
                  disabled={isThinking}
                /> 

                <button 
                  onClick={sendMessage} disabled={isThinking}> Send 
                </button> 
                    
              </footer> 

            </section> 
          </div> 
  );
}

export default App;

