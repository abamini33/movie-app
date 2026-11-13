import type { Movie } from "../models/movie.ts";

export const MOVIES: Movie[] = [
  {
    id: 1,
    title: "Inception",
    director: "Christopher Nolan",
    year: 2010,
    genre: "Science Fiction",
    youtubeID: "YoHD9XEInc0",
    synopsis:
      "Dom Cobb vole des secrets dans les rêves des autres. Pour sa dernière mission, il doit faire l'inverse : implanter une idée dans l'esprit d'un héritier.",
  },
  {
    id: 2,
    title: "Interstellar",
    director: "Christopher Nolan",
    year: 2014,
    genre: "Science Fiction",
    youtubeID: "zSWdZVtXT7E",
    synopsis:
      "La Terre se meurt. Un ancien pilote traverse un trou de ver pour trouver une planète habitable, en laissant ses enfants derrière lui. Là-bas, chaque heure peut coûter des années sur Terre.",
  },
  {
    id: 3,
    title: "Matrix",
    director: "The Wachowskis",
    year: 1999,
    genre: "Action",
    youtubeID: "vKQi3bBA1y8",
    synopsis: "Neo découvre que le monde qu'il connaît est une simulation.",
  },

  {
    id: 4,
    title: "The Dark Knight",
    director: "Christopher Nolan",
    year: 2008,
    genre: "Action",
    youtubeID: "EXeTwQWrcwY",
    synopsis:
      "Batman affronte le Joker, un criminel imprévisible qui veut plonger Gotham dans le chaos.",
  },
  {
    id: 5,
    title: "Mad Max: Fury Road",
    director: "George Miller",
    year: 2015,
    genre: "Action",
    youtubeID: "hEJnMQG9ev8",
    synopsis:
      "Dans un désert post-apocalyptique, Max et Furiosa fuient un tyran à bord d'un camion de guerre. Une course-poursuite presque ininterrompue de deux heures.",
  },
  {
    id: 6,
    title: "Le voyage de Chihiro",
    director: "Hayao Miyazaki",
    year: 2001,
    genre: "Animation",
    youtubeID: "ByXuk9QqQkk",
    synopsis:
      "Perdue dans un monde peuplé d'esprits, une petite fille doit travailler dans des bains magiques pour sauver ses parents, transformés en cochons.",
  },
  {
    id: 7,
    title: "L'Odyssée",
    director: "Christopher Nolan",
    year: 2026,
    genre: "Action",
    youtubeID: "K7bI5T-Yl-o",
    synopsis:
      "Après la guerre de Troie, le roi Ulysse tente de rentrer chez lui à Ithaque. Un voyage de dix ans, semé de monstres et de dieux.",
  },
  {
    id: 8,
    title: "Le roi lion",
    director: "Jon Favreau",
    year: 2019,
    genre: "Animation",
    youtubeID: "7TavVZMewpY",
    synopsis:
      "Un jeune lion nommé Simba doit surmonter la perte de son père et affronter son oncle maléfique pour devenir le roi de la savane.",
  },
  {
    id: 9,
    title: "Parasite",
    director: "Bong Joon Ho",
    year: 2019,
    genre: "Drama",
    youtubeID: "5xH0HfJHsaY",
    synopsis:
      "Un film qui explore les thèmes de la classe sociale et de l'inégalité en Corée du Sud.",
  },
  {
    id: 10,
    title: "Le seigneur des anneaux : La communauté de l'anneau",
    director: "Peter Jackson",
    year: 2001,
    genre: "Action",
    youtubeID: "nalLU8i4zgs",
    synopsis:
      "Dans un monde fantastique, un jeune hobbit nommé Frodon Sacquet se voit confier la tâche de détruire un anneau maléfique qui pourrait plonger le monde dans les ténèbres. Accompagné d'une communauté de compagnons, il entreprend un périlleux voyage à travers des terres dangereuses pour accomplir sa mission.",
  },
  {
    id: 11,
    title: "Whiplash",
    director: "Damien Chazelle",
    year: 2014,
    genre: "Drama",
    youtubeID: "7d_jQycdQGo",
    synopsis:
      "Un jeune batteur de jazz entre dans le meilleur conservatoire du pays, sous les ordres d'un professeur prêt à tout pour le pousser au-delà de ses limites.",
  },
  {
    id: 12,
    title: "Joker",
    director: "Todd Phillips",
    year: 2019,
    genre: "Drama",
    youtubeID: "zAGVQLHvwOY",
    synopsis:
      "Arthur Fleck, comique raté et isolé, bascule peu à peu dans la folie.",
  },
  {
    id: 13,
    title: "Dune",
    director: "Denis Villeneuve",
    year: 2021,
    genre: "Science Fiction",
    youtubeID: "n9xhJrPXop4",
    synopsis:
      "Paul Atréides, héritier d'une grande famille, arrive sur Arrakis, la planète désertique la plus dangereuse de l'univers. Elle abrite l'épice, la ressource la plus précieuse de la galaxie, et tout le monde la convoite.",
  },
];

export const youtubeThumbnail = (youtubeID: string): string => {
  return `https://img.youtube.com/vi/${youtubeID}/hqdefault.jpg`;
};
