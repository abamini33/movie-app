import {
  fetchTopRated,
  fetchGenres,
  fetchMovies,
} from "./services/movieService.ts";
import type { Movie } from "./models/movie.ts";
import type { Genre } from "./models/genre.ts";
import { useEffect, useState } from "react";
import Player from "./components/Player.tsx";
import Queue from "./components/Queue.tsx";
import MovieCard from "./components/MovieCard.tsx";

const BENTO_CELL =
  "bg-base-100 border-2 border-base-content rounded-box shadow-[6px_6px_0_0] shadow-base-content overflow-hidden";

const THEMES = ["violet", "marine", "orange", "marron"] as const;

type ThemeColor = (typeof THEMES)[number];
type ThemeMode = "light" | "dark";
type Page = "accueil" | "movies";

function App() {
  const [current, setCurrent] = useState<Movie | null>(null);
  const [queue, setQueue] = useState<Movie[]>([]);
  const [genreId, setGenreId] = useState<number | null>(null);
  const [color, setColor] = useState<ThemeColor>("orange");
  const [mode, setMode] = useState<ThemeMode>("light");
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);
  const [page, setPage] = useState<Page>("accueil");

  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTopRated(5)
      .then((movies) => setTopMovies(movies))
      .catch(() =>
        setError(
          "Impossible de charger le classement. Le serveur est-il lancé ?",
        ),
      )
      .finally(() => setLoading(false));
  }, []);

  const [genres, setGenres] = useState<Genre[]>([]);
  const [catalogue, setCatalogue] = useState<Movie[]>([]);
  const [catalogueLoading, setCatalogueLoading] = useState<boolean>(true);
  const [catalogueError, setCatalogueError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenres()
      .then((list) => setGenres(list))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchMovies(genreId)
      .then((movies) => {
        if (!ignore) setCatalogue(movies);
      })
      .catch(() => {
        if (!ignore) setCatalogueError("Impossible de charger les films.");
      })
      .finally(() => {
        if (!ignore) setCatalogueLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [genreId]);

  function chooseGenre(id: number | null) {
    setGenreId(id);
    setCatalogueLoading(true);
    setCatalogueError(null);
  }

  function addToQueue(movie: Movie) {
    setQueue((q) => {
      if (q.some((m) => m.id === movie.id)) return q;
      return [...q, movie];
    });
  }

  function removeFromQueue(movieId: number) {
    setQueue((q) => q.filter((m) => m.id !== movieId));
  }

  function next() {
    if (queue.length === 0) {
      setCurrent(null);
      return;
    }
    setCurrent(queue[0]);
    setQueue((q) => q.slice(1));
  }

  function playNext(movie: Movie) {
    setQueue((q) => [movie, ...q.filter((m) => m.id !== movie.id)]);
  }

  function play(movie: Movie) {
    setCurrent(movie);
    setQueue((q) => q.filter((m) => m.id !== movie.id));
  }

  function toggleDetail(movieId: number) {
    setOpenDetailId((id) => (id === movieId ? null : movieId));
  }

  function isInQueue(movie: Movie): boolean {
    return queue.some((m) => m.id === movie.id);
  }

  function renderCard(movie: Movie, rank?: number) {
    return (
      <MovieCard
        key={movie.id}
        movie={movie}
        rank={rank}
        inQueue={isInQueue(movie)}
        detailOpen={openDetailId === movie.id}
        onPlay={() => play(movie)}
        onPlayNext={() => playNext(movie)}
        onAddToQueue={() => addToQueue(movie)}
        onToggleDetail={() => toggleDetail(movie.id)}
      />
    );
  }

  return (
    <div data-theme={`${color}-${mode}`} className="min-h-screen bg-base-200">
      <main className="max-w-7xl mx-auto p-4 space-y-10">
        <nav role="tablist" aria-label="Pages" className="tabs tabs-box w-fit">
          <button
            type="button"
            role="tab"
            aria-selected={page === "accueil"}
            className={`tab text-base font-bold ${page === "accueil" ? "tab-active" : ""}`}
            onClick={() => setPage("accueil")}
          >
            Accueil
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={page === "movies"}
            className={`tab text-base font-bold ${page === "movies" ? "tab-active" : ""}`}
            onClick={() => setPage("movies")}
          >
            Movies
          </button>
        </nav>

        <div className="flex flex-wrap items-center gap-2">
          {THEMES.map((t) => (
            <button
              key={t}
              type="button"
              className={`btn btn-sm capitalize ${color === t ? "btn-primary" : "btn-ghost"}`}
              onClick={() => setColor(t)}
            >
              {t}
            </button>
          ))}

          <button
            type="button"
            className="btn btn-sm btn-outline ml-auto"
            onClick={() => setMode((m) => (m === "light" ? "dark" : "light"))}
          >
            {mode === "light" ? "🌙 Nuit" : "☀️ Jour"}
          </button>
        </div>
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          <div
            className={`${BENTO_CELL} col-span-2 lg:col-span-3 lg:row-span-2`}
          >
            <Player movie={current} />
            {current && (
              <div className="flex items-center justify-between gap-3 p-4">
                <h2 className="text-xl font-bold truncate">{current.title}</h2>
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={next}
                >
                  {queue.length > 0 ? "⏩ Suivant" : "⏹ Arrêter"}
                </button>
              </div>
            )}
          </div>

          <div
            className={`${BENTO_CELL} col-span-2 lg:col-span-1 lg:row-span-3 relative min-h-48`}
          >
            <div className="lg:absolute lg:inset-0 overflow-y-auto">
              <h2 className="text-lg font-bold px-4 pt-4">File d'attente</h2>
              <Queue queue={queue} onRemove={removeFromQueue} />
            </div>
          </div>
          <div className={`${BENTO_CELL} bg-primary text-primary-content p-5`}>
            <p className="text-5xl font-black">{catalogue.length}</p>
            <p className="font-bold">films</p>
          </div>

          <div
            className={`${BENTO_CELL} bg-secondary text-secondary-content p-5`}
          >
            <p className="text-5xl font-black">{queue.length}</p>
            <p className="font-bold">dans la file</p>
          </div>

          <div
            className={`${BENTO_CELL} bg-neutral text-neutral-content p-5 col-span-2 lg:col-span-1`}
          >
            <p className="text-xs uppercase tracking-widest opacity-60">
              À suivre
            </p>
            <p className="text-xl font-bold truncate">
              {queue[0]?.title ?? "Rien"}
            </p>
          </div>
        </section>
        {page === "accueil" && (
          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary">
                  Le classement
                </p>
                <h2 className="text-3xl font-black">
                  Les 3 films les mieux notés
                </h2>
              </div>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setPage("movies")}
              >
                Voir tous les films →
              </button>
            </div>
            {loading && (
              <p className="text-center opacity-70">
                Chargement du classement…
              </p>
            )}

            {error && (
              <div role="alert" className="alert alert-error">
                {error}
              </div>
            )}

            {!loading && !error && (
              <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {topMovies.map((movie, index) => renderCard(movie, index + 1))}
              </div>
            )}
          </section>
        )}

        {page === "movies" && (
          <section className="space-y-6">
            <div
              role="tablist"
              aria-label="Genres"
              className="tabs tabs-box flex-wrap"
            >
              <button
                type="button"
                role="tab"
                aria-selected={genreId === null}
                className={`tab ${genreId === null ? "tab-active" : ""}`}
                onClick={() => chooseGenre(null)}
              >
                Tous
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  type="button"
                  role="tab"
                  aria-selected={genreId === genre.id}
                  className={`tab ${genreId === genre.id ? "tab-active" : ""}`}
                  onClick={() => chooseGenre(genre.id)}
                >
                  {genre.name}
                </button>
              ))}
            </div>

            {catalogueLoading && (
              <p className="text-center opacity-70">Chargement des films…</p>
            )}

            {catalogueError && (
              <div role="alert" className="alert alert-error">
                {catalogueError}
              </div>
            )}

            {!catalogueLoading && !catalogueError && (
              <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {catalogue.map((movie) => renderCard(movie))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
