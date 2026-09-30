import ReactMarkdown from "react-markdown";

function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
        isUser
          ? "self-end bg-zinc-700 text-white"
          : "self-start bg-zinc-800 text-zinc-100"
      }`}
    >
      <ReactMarkdown>
        {message.content}
      </ReactMarkdown>
    </div>
  );
}

export default Message;