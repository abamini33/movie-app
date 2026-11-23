import type { Movie } from "../models/movie.ts";
import { youtubeThumbnail } from "../data/movies.ts";

type MovieCardProps = {
  movie: Movie;
  rank?: number;
  inQueue: boolean;
  detailOpen: boolean;
  onPlay: () => void;
  onPlayNext: () => void;
  onAddToQueue: () => void;
  onToggleDetail: () => void;
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h${m.toString().padStart(2, "0")}`;
}

function MovieCard({
  movie,
  rank,
  inQueue,
  detailOpen,
  onPlay,
  onPlayNext,
  onAddToQueue,
  onToggleDetail,
}: MovieCardProps) {
  return (
    <div className="card bg-base-100 shadow">
      <figure className="relative">
        <img
          src={youtubeThumbnail(movie.youtubeID)}
          alt={movie.title}
          className="aspect-video w-full object-cover"
        />
        {rank !== undefined && (
          <span className="badge badge-primary badge-lg absolute top-3 left-3 font-black">
            #{rank}
          </span>
        )}
      </figure>
      <div className="card-body">
        <h3 className="card-title">{movie.title}</h3>
        <p>
          {movie.year} · {movie.genre} · {movie.director}
        </p>
        <p>{movie.synopsis}</p>

        <button
          type="button"
          className="btn btn-ghost btn-xs self-start"
          onClick={onToggleDetail}
        >
          {detailOpen ? "▲ Masquer" : "▼ Détails"}
        </button>

        {detailOpen && (
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm bg-base-200 rounded-box p-3">
            <dt className="font-bold">Durée</dt>
            <dd>{formatDuration(movie.duration)}</dd>
            <dt className="font-bold">Note</dt>
            <dd>★ {movie.rating.toFixed(1)} / 10</dd>
            <dt className="font-bold">Avec</dt>
            <dd>{movie.cast.join(", ")}</dd>
          </dl>
        )}

        <div className="card-actions justify-center gap-2">
          <button
            className="btn btn-sm btn-primary"
            type="button"
            onClick={onPlay}
          >
            ▶ Lire
          </button>
          <button
            className="btn btn-sm btn-secondary"
            type="button"
            onClick={onPlayNext}
          >
            ⏭ Lire ensuite
          </button>
          <button
            className="btn btn-sm btn-outline"
            type="button"
            disabled={inQueue}
            onClick={onAddToQueue}
          >
            {inQueue ? "✓ Dans la file" : "＋ Mettre dans la file"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovieCard;
