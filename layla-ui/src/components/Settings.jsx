import { useState } from "react";

function Settings({ onClose }) {
  const [responseStyle, setResponseStyle] = useState(() => {
    return localStorage.getItem("layla-response-style") || "balanced";
  });
  const [systemPrompt, setSystemPrompt] = useState(() => {
    return localStorage.getItem("layla-system-prompt") || "";
  });
  return (
    <section className="flex-1 overflow-y-auto bg-zinc-900 text-white">
      <header className="flex h-16 items-center justify-between border-b border-zinc-800 px-6">
        <h2 className="text-lg font-semibold">Settings</h2>

        <button
          onClick={onClose}
          className="rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
        >
          Back to Chat
        </button>
      </header>

      <div className="mx-auto max-w-3xl space-y-8 p-6">
        <div>
          <h3 className="text-base font-semibold">General</h3>
          <p className="mt-1 text-sm text-zinc-400">
            Manage Layla's basic preferences.
          </p>
        </div>

        <div className="border-t border-zinc-800 pt-6">
          <h3 className="text-base font-semibold">Model</h3>
          <p className="mt-1 text-sm text-zinc-400">
            The language model currently generating Layla's responses.
          </p>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950 p-4">
            <p className="text-xs text-zinc-500">Active model</p>
            <p className="mt-1 text-sm font-medium text-white">layla</p>
            <p className="mt-1 text-xs text-zinc-500">
              Running locally through Ollama
            </p>
          </div>
        </div>

        <div className="border-t border-zinc-800 pt-6">
        <h3 className="text-base font-semibold">Assistant Behavior</h3>
        <p className="mt-1 text-sm text-zinc-400">
          Customize how Layla responds to your messages.
        </p>

        <div className="mt-4">
          <label
            htmlFor="response-style"
            className="block text-sm font-medium text-zinc-300"
          >
            Response style
          </label>

          <select
            id="response-style"
            className="mt-2 w-full max-w-sm rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-white outline-none focus:border-zinc-500"
            value={responseStyle}
            onChange={(event) => {
              const style = event.target.value;
              setResponseStyle(style);
              localStorage.setItem("layla-response-style", style);
            }}
          >
            <option value="concise">Concise</option>
            <option value="balanced">Balanced</option>
            <option value="detailed">Detailed</option>
          </select>

          <p className="mt-2 text-xs text-zinc-500">
            Choose how much detail Layla should provide.
          </p>

          <div className="mt-6">
            <label
              htmlFor="system-prompt"
              className="block text-sm font-medium text-zinc-300"
            >
              Custom system prompt
            </label>

            <p className="mt-1 text-sm text-zinc-500">
              Add instructions that guide how Layla behaves.
            </p>

            <textarea
              id="system-prompt"
              rows={5}
              value={systemPrompt}
              onChange={(event) => {
                const prompt = event.target.value;
                setSystemPrompt(prompt);
                localStorage.setItem("layla-system-prompt", prompt);
              }}
              placeholder="Example: When explaining code, use simple examples and explain each step."
              className="mt-3 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-3 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}

export default Settings;
