import Message from "./Message";
import TypingIndicator from "./TypingIndicator";

function ChatMessages({
  messages,
  isThinking,
  messagesEndRef
}) {
  return (
    <main className="chat">
      {messages.map((msg, index) => (
        <Message
          key={index}
          message={msg}
        />
      ))}

      {isThinking && <TypingIndicator />}

      <div ref={messagesEndRef} />
    </main>
  );
}

export default ChatMessages;