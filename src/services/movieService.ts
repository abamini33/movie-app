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

export async function fetchTopRated(limit: number): Promise<Movie[]> {
  const response = await fetch(`/api/movies/top-rated?limit=${limit}`);

  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }

  return (await response.json()) as Movie[];
}

export async function fetchGenres(): Promise<Genre[]> {
  const response = await fetch("/api/genres");

  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }

  return (await response.json()) as Genre[];
}

// genreId = null → tous les genres
export async function fetchMovies(genreId: number | null): Promise<Movie[]> {
  const url = genreId === null ? "/api/movies" : `/api/movies?genre=${genreId}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }

  return (await response.json()) as Movie[];
}
