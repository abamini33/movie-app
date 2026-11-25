import { MOVIES } from "../data/movies.ts";
import type { Movie } from "../models/movie.ts";
import type { Genre } from "../models/genre.ts";

export function getMovies(): Movie[] {
  return MOVIES;
}

export function getMoviesByGenre(genre: string): Movie[] {
  if (genre === "Tous") return MOVIES;
  return MOVIES.filter((movie) => movie.genre === genre);
}

export function getGenres(): string[] {
  return ["Tous", ...new Set(MOVIES.map((m) => m.genre))];
}

async function readJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} a répondu ${response.status}`);
  }

  return (await response.json()) as T;
}

async function getJson<T>(apiPath: string, staticFile: string): Promise<T> {
  const staticUrl = `${import.meta.env.BASE_URL}data/${staticFile}`;

  if (import.meta.env.DEV) {
    try {
      return await readJson<T>(apiPath);
    } catch {
      console.warn(`Serveur injoignable, lecture de ${staticUrl}`);
    }
  }

  return readJson<T>(staticUrl);
}

export async function fetchTopRated(limit: number): Promise<Movie[]> {
  const movies = await getJson<Movie[]>(
    `/api/movies/top-rated?limit=${limit}`,
    "top-rated.json",
  );
  return movies.slice(0, limit);
}

export function fetchGenres(): Promise<Genre[]> {
  return getJson<Genre[]>("/api/genres", "genres.json");
}

// genreId = null → tous les genres
export function fetchMovies(genreId: number | null): Promise<Movie[]> {
  if (genreId === null) {
    return getJson<Movie[]>("/api/movies", "movies.json");
  }
  return getJson<Movie[]>(
    `/api/movies?genre=${genreId}`,
    `movies-${genreId}.json`,
  );
}
