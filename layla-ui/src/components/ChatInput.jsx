function ChatInput({
  message,
  setMessage,
  sendMessage,
  handleKeyDown,
  isThinking,
  stopGenerating
}) {
  return (
    <footer className="flex shrink-0 gap-3 border-t border-zinc-800 p-4">
      <input
        type="text"
        placeholder="Message Layla..."
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isThinking}
        className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500 disabled:opacity-50"
      />

      <button
        onClick={isThinking ? stopGenerating : sendMessage}
        className="rounded-xl bg-zinc-700 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isThinking ? "Stop" : "Send"}
      </button>
    </footer>
  );
}

export default ChatInput;