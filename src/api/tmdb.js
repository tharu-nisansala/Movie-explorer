import axios from "axios";

// Create an Axios instance for making requests to the TMDb API
const api = axios.create({
    baseURL: "https://api.themoviedb.org/3",
    params: { api_key: process.env.REACT_APP_TMDB_KEY },
});

// Get movies that are currently trending this week
export const getTrending= async () => 
    api.get("/trending/movie/week").then((res) => res.data.results);

// Get a list of popular movies
export const getPopular = () =>
  api.get('/movie/popular').then((res) => res.data.results);

// Create the full URL for a movie poster image. If there is no image path, show a placeholder image instead
export const img = (path, size = 'w342') =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://placehold.co/342x513?text=No+Poster';

// Search for movies by title, page number, and optionally by release year
export const searchMovies = (query, page = 1, year) =>
  api
    .get('/search/movie', { params: { query, page, primary_release_year: year || undefined } })
    .then((res) => res.data);

// Get the list of available movie genres
export const getGenres = () =>
  api.get('/genre/movie/list').then((res) => res.data.genres);

// Discover movies using different filters such as genre, year, rating, etc.
export const discoverMovies = (params) =>
  api.get('/discover/movie', { params }).then((res) => res.data);

// Get detailed information about a specific movie. Also includes videos and cast/crew information
export const getMovie = (id) =>
  api
    .get(`/movie/${id}`, { params: { append_to_response: 'videos,credits' } })
    .then((res) => res.data);

// Convert API errors into user-friendly messages
export const errMsg = (e) => {
  if (e.response?.status === 401) return 'Invalid TMDb API key. Check your .env file.';
  if (e.response?.status === 404) return 'We could not find that movie.';
  if (e.response) return `TMDb is having trouble (error ${e.response.status}). Please try again.`;
  return 'Network problem. Check your internet connection and try again.';
};

