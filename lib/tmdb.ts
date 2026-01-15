const BASE_URL = "https://api.themoviedb.org/3";

async function fetchTMDB(endpoint: string) {
  const res = await fetch(
    `${BASE_URL}${endpoint}?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 86400 } } // cache for 1 day
  );

  if (!res.ok) throw new Error("TMDB fetch failed: " + res.statusText);
  return res.json();
}

// Movie endpoints
export const getMovieCredits = (movieId: number) =>
  fetchTMDB(`/movie/${movieId}/credits`);

export const getMovieDetails = (movieId: number) =>
  fetchTMDB(`/movie/${movieId}`);

// Person endpoints
export const getPersonDetails = (personId: number) =>
  fetchTMDB(`/person/${personId}`);

export const getPersonCredits = (personId: number) =>
  fetchTMDB(`/person/${personId}/combined_credits`);
