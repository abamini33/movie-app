import express from "express";
import { getTopRatedMovies } from "./tmdb.ts";

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

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  if (!process.env.TMDB_TOKEN) {
    console.warn("⚠️  TMDB_TOKEN absent : as-tu créé server/.env ?");
  }
});
