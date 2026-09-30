function TypingIndicator() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl bg-zinc-800 px-4 py-3">
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400"></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400"></span>
      <span className="h-2 w-2 animate-pulse rounded-full bg-zinc-400"></span>
    </div>
  );
}

export default TypingIndicator;