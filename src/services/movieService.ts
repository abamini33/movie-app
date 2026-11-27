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

// L'adresse du serveur :
// - en développement : vide → les appels "/api/..." passent par le proxy Vite (localhost:3000)
// - en production : VITE_API_URL (fichier .env.production) → le serveur hébergé
const API_URL = import.meta.env.VITE_API_URL ?? "";

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Le serveur a répondu ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchTopRated(limit: number): Promise<Movie[]> {
  return getJson<Movie[]>(`/api/movies/top-rated?limit=${limit}`);
}

export function fetchGenres(): Promise<Genre[]> {
  return getJson<Genre[]>("/api/genres");
}

// genreId = null → tous les genres
export function fetchMovies(genreId: number | null): Promise<Movie[]> {
  return getJson<Movie[]>(
    genreId === null ? "/api/movies" : `/api/movies?genre=${genreId}`,
  );
}

// Recherche dans TOUT le catalogue TMDB (au moins 2 caractères)
export function searchMovies(query: string): Promise<Movie[]> {
  return getJson<Movie[]>(`/api/movies/search?q=${encodeURIComponent(query)}`);
}
