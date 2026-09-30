import ReactMarkdown from "react-markdown";
<<<<<<< HEAD
import { useState } from "react";
function Message({ message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
async function copyCode(code) {
    await navigator.clipboard.writeText(code);
    setCopied(true);

    setTimeout(() => {
        setCopied(false);
    }, 2000);
}
  return (
    <div
      className={`max-w-[75%] min-w-0 rounded-2xl px-4 py-3 text-sm ${
=======

function Message({ message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
>>>>>>> 0d05cbc2d048818c8dc8df056791dfc31d76c6f0
        isUser
          ? "self-end bg-zinc-700 text-white"
          : "self-start bg-zinc-800 text-zinc-100"
      }`}
    >
<<<<<<< HEAD
      <ReactMarkdown
        components={{
          code({ children, className }) {
            const isBlock = className?.includes("language-");

            if (isBlock) {
                const code = String(children).replace(/\n$/, "");

                return (
                    <div className="relative max-w-full overflow-hidden rounded-lg bg-zinc-950">
                    <button
                        onClick={() => copyCode(code)}
                        className="absolute right-2 top-2 rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                    >
                        {copied ? "Copied!" : "Copy"}
                    </button>

                    <code className="block max-w-full overflow-x-auto whitespace-pre p-4 pr-16 text-sm text-zinc-200">
                        {code}
                    </code>
                    </div>
                );
            }

            return (
              <code className="rounded bg-zinc-950 px-1.5 py-0.5 text-zinc-200">
                {children}
              </code>
            );
          }
        }}
      >
=======
      <ReactMarkdown>
>>>>>>> 0d05cbc2d048818c8dc8df056791dfc31d76c6f0
        {message.content}
      </ReactMarkdown>
    </div>
  );
}

export default Message;