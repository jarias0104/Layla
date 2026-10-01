import { useState } from "react";
import ChatList from "./ChatList";

function Sidebar({
  onNewChat,
  chats,
  activeChatId,
  setActiveChatId,
  setChats
}) {
  const [search, setSearch] = useState("");
  const filteredChats = chats.filter(chat => 
        chat.title.toLowerCase().includes(search.toLowerCase())
        );
  return (
    <aside className="w-64 shrink-0 bg-zinc-950 text-white flex flex-col border-r border-zinc-800">
      <div className="px-5 py-6">
        <h2 className="text-xl font-semibold">
          Layla
        </h2>

        <span className="text-sm text-zinc-400">
          Local AI
        </span>
      </div>
      <div className="px-4 pb-4">
        <input
          type="text"
          placeholder="Search chats..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-lg border border-zinc 800 bg-zinc-900 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-700"
        />
      </div>

      <button
        className="mx-4 mb-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-700 transition"
        onClick={onNewChat}
      >
        + New Chat
      </button>
      
      <ChatList
        chats={filteredChats}
        activeChatId={activeChatId}
        setActiveChatId={setActiveChatId}
        setChats={setChats}
      />

      <div className="mt-auto border-t border-zinc-800 px-5 py-4">
        <p className="text-xs text-zinc-500">
          Model
        </p>

        <strong className="block text-sm font-medium">
          layla
        </strong>

        <small className="text-xs text-zinc-500">
          Running locally
        </small>
      </div>
    </aside>
  );
}

export default Sidebar;