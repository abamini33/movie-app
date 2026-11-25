import { mkdir, writeFile } from "node:fs/promises";
import {
  getCatalogMovies,
  getGenres,
  getTopRatedMovies,
} from "../server/src/tmdb.ts";

const OUT_DIR = new URL("../public/data/", import.meta.url);

async function save(fileName: string, data: unknown[]): Promise<void> {
  await writeFile(new URL(fileName, OUT_DIR), JSON.stringify(data));
  console.log(`✓ ${fileName} (${data.length} éléments)`);
}

await mkdir(OUT_DIR, { recursive: true });

await save("top-rated.json", await getTopRatedMovies(10));

const genres = await getGenres();
await save("genres.json", genres);

await save("movies.json", await getCatalogMovies(null));

for (const genre of genres) {
  await save(`movies-${genre.id}.json`, await getCatalogMovies(genre.id));
}

console.log("Données TMDB générées dans public/data/");
