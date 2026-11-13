import type { Movie } from "../models/movie.ts";

type QueueProps = {
  queue: Movie[];
  onRemove: (movieId: number) => void;
};

function Queue({ queue, onRemove }: QueueProps) {
  if (queue.length === 0) {
    return <p className="p-4 opacity-60">File vide</p>;
  }

  return (
    <ol className="p-4 space-y-2">
      {queue.map((movie, index) => (
        <li
          key={movie.id}
          className="flex items-center gap-3 bg-base-100 rounded-box p-2"
        >
          <span className="font-bold">{index + 1}</span>
          <span className="flex-1">{movie.title}</span>
          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={() => onRemove(movie.id)}
          >
            ✕
          </button>
        </li>
      ))}
    </ol>
  );
}

export default Queue;
