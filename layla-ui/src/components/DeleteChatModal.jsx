const DeleteChatModal = ({ chatTitle, onCancel, onConfirm }) => {
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">

        <h3 className="mb-2 text-base font-semibold text-white">
          Delete chat
        </h3>

        <p className="mb-5 text-sm text-zinc-400">
          Are you sure you want to delete "{chatTitle}"?
        </p>

        <div className="flex justify-end gap-2">

          <button
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-500"
          >
            Delete
          </button>

        </div>
      </div>
    </div>
  );
}

export default DeleteChatModal;