import express from "express";
import { getCatalogMovies, getGenres, getTopRatedMovies } from "./tmdb.ts";

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

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

  try {
    res.json(await getCatalogMovies(genre));
  } catch (error) {
    console.error(error);
    res
      .status(502)
      .json({ error: "Impossible de récupérer les films chez TMDB" });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  if (!process.env.TMDB_TOKEN) {
    console.warn("⚠️  TMDB_TOKEN absent : as-tu créé server/.env ?");
  }
});
