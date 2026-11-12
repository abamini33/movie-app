import { MOVIES, youtubeThumbnail } from "./data/movies.js";
import { useState } from "react";
import Player from "./components/Player.jsx";
import Queue from "./components/Queue.jsx";

const BENTO_CELL =
  "bg-base-100 border-2 border-base-content rounded-box shadow-[6px_6px_0_0] shadow-base-content overflow-hidden";

const THEMES = ["violet", "marine", "orange", "marron"];

function App() {
  const [current, setCurrent] = useState(null);
  const [queue, setQueue] = useState([]);
  const [category, setCategory] = useState("Tous");
  const [color, setColor] = useState("orange");
  const [mode, setMode] = useState("light");

  function addToQueue(movie) {
    setQueue((q) => {
      if (q.some((m) => m.id === movie.id)) return q;
      return [...q, movie];
    });
  }

  function removeFromQueue(movieId) {
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

  function playNext(movie) {
    setQueue((q) => [movie, ...q.filter((m) => m.id !== movie.id)]);
  }

  function play(movie) {
    setCurrent(movie);
    setQueue((q) => q.filter((m) => m.id !== movie.id));
  }

  function filterMovies() {
    if (category === "Tous") return MOVIES;
    return MOVIES.filter((movie) => movie.genre === category);
  }

  const filteredMovies = filterMovies();
  const categories = ["Tous", ...new Set(MOVIES.map((m) => m.genre))];

  return (
    <div data-theme={`${color}-${mode}`} className="min-h-screen bg-base-200">
      <main className="max-w-7xl mx-auto p-4 space-y-10">
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
            <p className="text-5xl font-black">{MOVIES.length}</p>
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
        <div role="tablist" className="tabs tabs-box">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`tab ${category === cat ? "tab-active" : ""}`}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 p-6">
          {filteredMovies.map((movie) => (
            <div key={movie.id} className="card bg-base-100 shadow">
              <img
                src={youtubeThumbnail(movie.youtubeID)}
                alt={movie.title}
                className="aspect-video w-full object-cover"
              />
              <div className="card-body">
                <h3 className="card-title">{movie.title}</h3>
                <p>
                  {movie.year} · {movie.genre} · {movie.director}
                </p>
                <p>{movie.synopsis}</p>
                <div className="card-actions justify-center gap-2">
                  <button
                    className="btn btn-sm btn-primary"
                    type="button"
                    onClick={() => play(movie)}
                  >
                    ▶ Lire
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    type="button"
                    onClick={() => playNext(movie)}
                  >
                    ⏭ Lire ensuite
                  </button>
                  <button
                    className="btn btn-sm btn-outline"
                    type="button"
                    onClick={() => addToQueue(movie)}
                  >
                    ＋ Mettre dans la file
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
