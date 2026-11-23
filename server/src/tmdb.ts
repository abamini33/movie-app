import type { Movie } from "../../src/models/movie.ts";

const TMDB_URL = "https://api.themoviedb.org/3";

type TmdbListResponse = {
  results: { id: number }[];
};

type TmdbMovieDetails = {
  id: number;
  title: string;
  overview: string;
  release_date: string; // "2010-07-15"
  runtime: number | null; // en minutes
  backdrop_path: string | null; // "/xyz.jpg"
  vote_average: number; // sur 10
  genres: { id: number; name: string }[];
  credits: {
    cast: { name: string }[];
    crew: { name: string; job: string }[];
  };
  videos: {
    results: { key: string; site: string; type: string }[];
  };
};

async function tmdbFetch<T>(path: string): Promise<T> {
  const token = process.env.TMDB_TOKEN;
  if (!token) {
    throw new Error("TMDB_TOKEN manquant dans server/.env");
  }

  const response = await fetch(`${TMDB_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!response.ok) {
    throw new Error(`TMDB a répondu ${response.status} sur ${path}`);
  }

  return (await response.json()) as T;
}

// --- La traduction : un film TMDB → notre type Movie ---

function toMovie(details: TmdbMovieDetails): Movie | null {
  const trailer =
    details.videos.results.find(
      (v) => v.site === "YouTube" && v.type === "Trailer",
    ) ?? details.videos.results.find((v) => v.site === "YouTube");

  // Pas de bande-annonce YouTube = film inutilisable dans notre lecteur
  if (!trailer) return null;

  const director = details.credits.crew.find((p) => p.job === "Director");

  return {
    id: details.id,
    title: details.title,
    director: director?.name ?? "Inconnu",
    year: Number(details.release_date.slice(0, 4)),
    genre: details.genres[0]?.name ?? "Autre",
    youtubeID: trailer.key,
    synopsis: details.overview,
    duration: details.runtime ?? 0,
    rating: Math.round(details.vote_average * 10) / 10,
    cast: details.credits.cast.slice(0, 3).map((p) => p.name),
    image: details.backdrop_path
      ? `https://image.tmdb.org/t/p/w780${details.backdrop_path}`
      : undefined,
  };
}

export async function getTopRatedMovies(limit: number): Promise<Movie[]> {
  const list = await tmdbFetch<TmdbListResponse>(
    "/discover/movie?language=fr-FR&sort_by=vote_average.desc&vote_count.gte=5000&page=1",
  );

  const details = await Promise.all(
    list.results
      .slice(0, limit)
      .map((film) =>
        tmdbFetch<TmdbMovieDetails>(
          `/movie/${film.id}?language=fr-FR&append_to_response=videos,credits&include_video_language=fr,en`,
        ),
      ),
  );

  const movies = details
    .map(toMovie)
    .filter((movie): movie is Movie => movie !== null);

  console.log(
    `[top-rated] ${details.length} films reçus de TMDB, ${movies.length} gardés (avec bande-annonce)`,
  );

  return movies;
}
