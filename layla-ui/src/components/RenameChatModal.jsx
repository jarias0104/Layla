function RenameChatModal ({
    renameValue,
    setRenameValue,
    onCancel,
    onSave
}) {
    return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-80 rounded-xl border border-zinc-700 bg-zinc-900 p-5 shadow-xl">
        <h3 className="mb-4 text-base font-semibold text-white">
          Rename chat
        </h3>

        <input
          type="text"
          value={renameValue}
          onChange={(event) => setRenameValue(event.target.value)}
          autoFocus
          className="mb-4 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-zinc-500"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="rounded-lg px-3 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={onSave}
            className="rounded-lg bg-zinc-700 px-3 py-2 text-sm text-white hover:bg-zinc-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default RenameChatModal;