import { createContext, useContext, useEffect, useState } from 'react';

// Create a Context for movie-related data
const MovieContext = createContext();

export const useMovies = () => useContext(MovieContext);

// MovieProvider component provides movie-related state and functions to its children components.
const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

// MovieProvider component manages the state for favorites, last search, and theme mode, and provides functions to toggle favorites and theme mode.
export function MovieProvider({ children }) {
 
  const [favorites, setFavorites] = useState(() => read('favorites', []));
  const [lastSearch, setLastSearch] = useState(() => read('lastSearch', ''));
  const [mode, setMode] = useState(() => read('mode', 'dark'));

  
  useEffect(() => localStorage.setItem('favorites', JSON.stringify(favorites)), [favorites]);
  useEffect(() => localStorage.setItem('lastSearch', JSON.stringify(lastSearch)), [lastSearch]);
  useEffect(() => localStorage.setItem('mode', JSON.stringify(mode)), [mode]);

  const isFavorite = (id) => favorites.some((m) => m.id === id);

// Function to toggle a movie's favorite status. If the movie is already a favorite, it removes it; otherwise, it adds it to the favorites list.
  const toggleFavorite = (movie) => {
    const slim = {
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    };
    setFavorites((prev) =>
      prev.some((m) => m.id === movie.id) ? prev.filter((m) => m.id !== movie.id) : [...prev, slim]
    );
  };

  
   const toggleMode = () => setMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <MovieContext.Provider value={{ favorites, isFavorite, toggleFavorite, lastSearch, setLastSearch, mode, toggleMode }}>
      {children}
    </MovieContext.Provider>
  );
}