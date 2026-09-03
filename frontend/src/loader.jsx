const Loader = () => {
  return (
    <div className="flex items-center justify-center gap-2" aria-label="Loading">
      <span className="h-3 w-3 animate-bounce rounded-full bg-red-500 [animation-delay:-0.2s]" />
      <span className="h-3 w-3 animate-bounce rounded-full bg-red-500 [animation-delay:-0.1s]" />
      <span className="h-3 w-3 animate-bounce rounded-full bg-red-500" />
    </div>
  );
};

export default Loader;
