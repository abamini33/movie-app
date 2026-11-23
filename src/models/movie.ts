export type Movie = {
  id: number;
  title: string;
  director: string;
  year: number;
  genre: string;
  youtubeID: string;
  synopsis: string;
  duration: number; // en minutes
  rating: number; // note sur 10
  cast: string[]; // acteurs principaux
  image?: string; // image du film (TMDB) ; sinon on prend la miniature YouTube
};
