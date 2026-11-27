import {
  fetchTopRated,
  fetchGenres,
  fetchMovies,
  searchMovies,
} from "./services/movieService.ts";
import type { Movie } from "./models/movie.ts";
import type { Genre } from "./models/genre.ts";
import { useEffect, useState } from "react";
import Player from "./components/Player.tsx";
import Queue from "./components/Queue.tsx";
import MovieCard from "./components/MovieCard.tsx";
import { useLocalStorage } from "./hooks/useLocalStorage.ts";

const BENTO_CELL =
  "bg-base-100 border-2 border-base-content rounded-box shadow-[6px_6px_0_0] shadow-base-content overflow-hidden";

const THEMES = ["violet", "marine", "orange", "marron"] as const;

type ThemeColor = (typeof THEMES)[number];
type ThemeMode = "light" | "dark";
type Page = "accueil" | "movies";

function App() {
  const [current, setCurrent] = useLocalStorage<Movie | null>(
    "movieapp:current",
    null,
  );
  const [queue, setQueue] = useLocalStorage<Movie[]>(
    "movieapp:queue",
    [],
    (v): v is Movie[] => Array.isArray(v),
  );
  const [genreId, setGenreId] = useState<number | null>(null);
  const [color, setColor] = useLocalStorage<ThemeColor>(
    "movieapp:color",
    "orange",
    (v): v is ThemeColor => THEMES.includes(v as ThemeColor),
  );
  const [mode, setMode] = useLocalStorage<ThemeMode>(
    "movieapp:mode",
    "light",
    (v): v is ThemeMode => v === "light" || v === "dark",
  );
  const [openDetailId, setOpenDetailId] = useState<number | null>(null);
  const [page, setPage] = useState<Page>("accueil");
  const [search, setSearch] = useState<string>("");
  const [appliedSearch, setAppliedSearch] = useState<string>("");

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
  const [cataloguePage, setCataloguePage] = useState<number>(1);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Une recherche n'est lancée qu'à partir de 2 caractères
  const isSearching = appliedSearch.length >= 2;

  // Va chercher une page : celle de la recherche, ou celle du catalogue
  function loadPage(pageNumber: number): Promise<Movie[]> {
    return isSearching
      ? searchMovies(appliedSearch, pageNumber)
      : fetchMovies(genreId, pageNumber);
  }

  useEffect(() => {
    fetchGenres()
      .then((list) => setGenres(list))
      .catch(() => setGenres([]));
  }, []);

  useEffect(() => {
    let ignore = false;

    const request =
      appliedSearch.length >= 2
        ? searchMovies(appliedSearch, 1)
        : fetchMovies(genreId, 1);

    request
      .then((movies) => {
        if (ignore) return;
        setCatalogue(movies);
        setCataloguePage(1);
        setHasMore(movies.length > 0);
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
  }, [genreId, appliedSearch]);

  function chooseGenre(id: number | null) {
    setGenreId(id);
    setCatalogueLoading(true);
    setCatalogueError(null);
  }

  function applySearch(text: string) {
    setAppliedSearch(text.trim());
    setCatalogueLoading(true);
    setCatalogueError(null);
  }

  function loadMore() {
    const nextPage = cataloguePage + 1;
    setLoadingMore(true);

    loadPage(nextPage)
      .then((movies) => {
        // On ajoute à la suite, sans doublons
        setCatalogue((list) => [
          ...list,
          ...movies.filter((m) => !list.some((old) => old.id === m.id)),
        ]);
        setCataloguePage(nextPage);
        setHasMore(movies.length > 0);
      })
      .catch(() => setCatalogueError("Impossible de charger plus de films."))
      .finally(() => setLoadingMore(false));
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
            <form
              role="search"
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                applySearch(search);
              }}
            >
              <input
                type="search"
                aria-label="Rechercher un film dans tout le catalogue"
                placeholder="Rechercher un film (2 lettres minimum)…"
                className="input input-bordered w-full max-w-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                Rechercher
              </button>
              {isSearching && (
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setSearch("");
                    applySearch("");
                  }}
                >
                  Effacer
                </button>
              )}
            </form>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-widest text-primary">
                  Catalogue
                </p>
                <h2 className="text-3xl font-black">
                  {isSearching
                    ? `Résultats pour « ${appliedSearch} »`
                    : "Tous les films"}
                </h2>
              </div>
              <p className="text-sm opacity-70">
                {catalogue.length} film{catalogue.length > 1 ? "s" : ""}
              </p>
            </div>
            {!isSearching && (
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
            )}

            {catalogueLoading && (
              <p className="text-center opacity-70">Chargement des films…</p>
            )}

            {catalogueError && (
              <div role="alert" className="alert alert-error">
                {catalogueError}
              </div>
            )}

            {!catalogueLoading && !catalogueError && (
              <>
                {catalogue.length === 0 && (
                  <p className="text-center opacity-70">
                    Aucun film trouvé
                    {isSearching ? ` pour « ${appliedSearch} »` : ""}.
                  </p>
                )}

                <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {catalogue.map((movie) => renderCard(movie))}
                </div>

                {hasMore && catalogue.length > 0 && (
                  <div className="flex justify-center">
                    <button
                      type="button"
                      className="btn btn-outline"
                      disabled={loadingMore}
                      onClick={loadMore}
                    >
                      {loadingMore ? "Chargement…" : "Charger plus de films"}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
