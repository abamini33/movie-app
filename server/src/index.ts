import express from "express";
import {
  getCatalogMovies,
  getGenres,
  getTopRatedMovies,
  searchMovies,
} from "./tmdb.ts";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

const allowedOrigins = (process.env.ALLOWED_ORIGIN ?? "")
  .split(",")
  .map((origin) => origin.trim())
  .filter((origin) => origin !== "");

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  next();
});

// La page d'accueil de l'API : la liste des routes disponibles
const ROUTES = {
  message:
    "API MovieApp : ce serveur renvoie du JSON, le site est sur GitHub Pages",
  routes: [
    "GET /api/health",
    "GET /api/genres",
    "GET /api/movies?genre=878&page=2",
    "GET /api/movies/top-rated?limit=5",
    "GET /api/movies/search?q=inception&page=1",
  ],
};
app.get(["/", "/api"], (_req, res) => {
  res.json(ROUTES);
});

// Lit ?page=… : un entier entre 1 et 500 (la limite de TMDB), 1 par défaut
function readPage(value: unknown): number | null {
  if (value === undefined) return 1;
  const page = Number(value);
  return Number.isInteger(page) && page >= 1 && page <= 500 ? page : null;
}

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    tmdbToken: process.env.TMDB_TOKEN ? "présent" : "absent",
  });
});

// GET /api/movies/top-rated?limit=3
app.get("/api/movies/top-rated", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 10) || 10, 20);

  try {
    const movies = await getTopRatedMovies(limit);
    res.json(movies);
  } catch (error) {
    console.error(error);
    res
      .status(502)
      .json({ error: "Impossible de récupérer les films chez TMDB" });
  }
});

// GET /api/genres
app.get("/api/genres", async (_req, res) => {
  try {
    res.json(await getGenres());
  } catch (error) {
    console.error(error);
    res
      .status(502)
      .json({ error: "Impossible de récupérer les genres chez TMDB" });
  }
});

// GET /api/movies            → les films populaires
// GET /api/movies?genre=878  → les films populaires d'un genre (878 = Science-Fiction)
app.get("/api/movies", async (req, res) => {
  const genre = req.query.genre === undefined ? null : Number(req.query.genre);

  if (genre !== null && (!Number.isInteger(genre) || genre <= 0)) {
    res
      .status(400)
      .json({ error: "Le paramètre genre doit être un identifiant de genre" });
    return;
  }

  const page = readPage(req.query.page);
  if (page === null) {
    res
      .status(400)
      .json({ error: "Le paramètre page doit être entre 1 et 500" });
    return;
  }

  try {
    res.json(await getCatalogMovies(genre, page));
  } catch (error) {
    console.error(error);
    res
      .status(502)
      .json({ error: "Impossible de récupérer les films chez TMDB" });
  }
});

// GET /api/movies/search?q=inception  → cherche dans TOUT le catalogue TMDB
app.get("/api/movies/search", async (req, res) => {
  const query = typeof req.query.q === "string" ? req.query.q.trim() : "";

  if (query.length < 2 || query.length > 100) {
    res
      .status(400)
      .json({ error: "La recherche doit contenir entre 2 et 100 caractères" });
    return;
  }

  const page = readPage(req.query.page);
  if (page === null) {
    res
      .status(400)
      .json({ error: "Le paramètre page doit être entre 1 et 500" });
    return;
  }

  try {
    res.json(await searchMovies(query, page));
  } catch (error) {
    console.error(error);
    res
      .status(502)
      .json({ error: "Impossible de rechercher les films chez TMDB" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  if (!process.env.TMDB_TOKEN) {
    console.warn("⚠️  TMDB_TOKEN absent : as-tu créé server/.env ?");
  }
});
