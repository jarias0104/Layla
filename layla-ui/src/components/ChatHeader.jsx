function ChatHeader({ activeChat }) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-center border-b border-zinc-800 px-6">
      <div>
        <h2 className="text-base font-semibold text-white">
          {activeChat.title}
        </h2>

        <span className="text-xs text-zinc-500">
          Layla
        </span>
      </div>
    </header>
  );
}

export default ChatHeader;