import { useEffect, useRef, useState } from "react";

import RenameChatModal from "./RenameChatModal";
import DeleteChatModal from "./DeleteChatModal";

function ChatList({
  chats,
  activeChatId,
  setActiveChatId,
  setChats
}) {
  const [openMenuId, setOpenMenuId] = useState(null);

  const [deleteChatId, setDeleteChatId] = useState(null);

  const [renameChatId, setRenameChatId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const chatListRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event){
      if(
        chatListRef.current &&
        !chatListRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [])

  return (
    <div ref={chatListRef} className="flex-1 overflow-y-auto px-3">
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`relative mb-1 flex items-center rounded-lg transition ${
            chat.id === activeChatId
              ? "bg-zinc-800"
              : "hover:bg-zinc-900"
          }`}
        >
          {/* Chat title */}
          <button
            className="min-w-0 flex-1 truncate px-3 py-2 text-left text-sm text-zinc-200"
            onClick={() => setActiveChatId(chat.id)}
          >
            {chat.title}
          </button>

          {/* Three-dot button */}
          <button
            className="px-3 py-2 text-zinc-500 transition hover:text-white"
            onClick={() =>
              setOpenMenuId(
                openMenuId === chat.id ? null : chat.id
              )
            }
          >
            ⋮
          </button>

          {/* Context menu */}
          {openMenuId === chat.id && (
            <div className="absolute right-2 top-10 z-10 w-32 rounded-lg border border-zinc-700 bg-zinc-900 py-1 shadow-lg">

              {/* Rename */}
              <button
                className="block w-full px-3 py-2 text-left text-sm text-zinc-200 hover:bg-zinc-800"
                onClick={() => {
                  setRenameChatId(chat.id);
                  setRenameValue(chat.title);
                  setOpenMenuId(null);
                }}
              >
                Rename
              </button>

              {/* Delete */}
              <button
                className="block w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-zinc-800"
                onClick={() => {
                  setDeleteChatId(chat.id);
                  setOpenMenuId(null);
                }}
              >
                Delete
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Rename modal */}
      {renameChatId !== null && (
        <RenameChatModal
          renameValue={renameValue}
          setRenameValue={setRenameValue}
          onCancel={() => {
            setRenameChatId(null);
            setRenameValue("");
          }}
          onSave={() => {
            if (renameValue.trim() === "") {
              return;
            }

            setChats(prevChats =>
              prevChats.map(chat =>
                chat.id === renameChatId
                  ? {
                      ...chat,
                      title: renameValue.trim()
                    }
                  : chat
              )
            );

            setRenameChatId(null);
            setRenameValue("");
          }}
        />
      )}

      {/* Delete modal */}
      {deleteChatId !== null && (
        <DeleteChatModal
          chatTitle={
            chats.find(chat => chat.id === deleteChatId)?.title
          }
          onCancel={() => {
            setDeleteChatId(null);
          }}
          onConfirm={() => {
            const chatToDelete = chats.find(
              chat => chat.id === deleteChatId
            );

            if (!chatToDelete) {
              setDeleteChatId(null);
              return;
            }

            if (chats.length === 1) {
              setDeleteChatId(null);
              return;
            }

            setChats(prevChats =>
              prevChats.filter(
                chat => chat.id !== deleteChatId
              )
            );

            if (deleteChatId === activeChatId) {
              const remainingChats = chats.filter(
                chat => chat.id !== deleteChatId
              );

              setActiveChatId(remainingChats[0].id);
            }

            setDeleteChatId(null);
          }}
        />
      )}
    </div>
  );
}

export default ChatList;