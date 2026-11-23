import { MOVIES } from "../data/movies.ts";
import type { Movie } from "../models/movie.ts";

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

export function getTopRated(limit: number): Movie[] {
  return [...MOVIES].sort((a, b) => b.rating - a.rating).slice(0, limit);
}
