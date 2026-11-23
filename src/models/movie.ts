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
};
