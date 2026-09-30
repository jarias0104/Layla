function ChatList({
  chats,
  activeChatId,
  setActiveChatId,
  setChats
}) {
  return (
    <div className="flex-1 overflow-y-auto px-3">
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`mb-1 flex items-center rounded-lg transition ${
            chat.id === activeChatId
              ? "bg-zinc-800"
              : "hover:bg-zinc-900"
          }`}
        >
          <button
            className="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm text-zinc-200"
            onClick={() => setActiveChatId(chat.id)}
          >
            {chat.title}
          </button>

          <button
            className="px-3 py-2 text-zinc-500 hover:text-white transition"
            onClick={() => {
              const action = prompt(
                "Type 'r' to rename or 'd' to delete:"
              );

              if (action === "r") {
                const newTitle = prompt(
                  "Enter a new name:",
                  chat.title
                );

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
  );
}

export default ChatList;