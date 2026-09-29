import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, CircularProgress, FormControlLabel, MenuItem, Switch, TextField, Typography,} from '@mui/material';
import { discoverMovies, errMsg, getGenres, searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import ErrorMessage from '../components/ErrorMessage';

// Create a list of the last 30 years for the year filter
const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  // Filters
  const [genres, setGenres] = useState([]);
  const [genre, setGenre] = useState('');
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');

   // Store movie results and pagination information
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Handle loading and API errors
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Controls whether infinite scrolling is enabled
  const [infinite, setInfinite] = useState(true);

  // Used to detect when the user reaches the bottom of the movie list
  const sentinel = useRef(null);

 // Create a unique key for the current search and filter settings
  const key = `${q}|${genre}|${year}|${rating}`;
  const latestKey = useRef(key);

   // Load the available movie genres when the page first opens
  useEffect(() => {
    getGenres().then(setGenres).catch(() => {});
  }, []);

  // Fetch movies based on the current search and filter values
  const load = useCallback(async (pageNum, replace) => {
    setLoading(true);
    setError('');
    try {
      let data;
      if (q) {
       
        data = await searchMovies(q, pageNum, year);
        data.results = data.results.filter(
          (m) =>
            (!genre || m.genre_ids.includes(Number(genre))) &&
            (!rating || m.vote_average >= Number(rating))
        );
      } else {
        
        data = await discoverMovies({
          page: pageNum,
          sort_by: 'popularity.desc',
          'vote_count.gte': 50,
          with_genres: genre || undefined,
          primary_release_year: year || undefined,
          'vote_average.gte': rating || undefined,
        });
      }
      if (latestKey.current !== key) return;
      setMovies((prev) => (replace ? data.results : [...prev, ...data.results]));
      setPage(pageNum);
      setTotalPages(data.total_pages);
    } catch (e) {
      setError(errMsg(e));
    } finally {
      setLoading(false);
    }
  }, [q, genre, year, rating, key]);

// Reload movies whenever the search query or filters change
  useEffect(() => {
    latestKey.current = key;
    setMovies([]);
    setPage(0);
    setTotalPages(1);
    load(1, true);
  }, [key, load]);

  const hasMore = page > 0 && page < totalPages;
  const loadMore = () => {
    if (!loading && hasMore) load(page + 1, false);
  };

  // Infinite scroll
  useEffect(() => {
    if (!infinite || !sentinel.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && loadMore(),
      { rootMargin: '300px' }
    );
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  });

  return (
    <>
    {/* Show the search title or browse title */}
      <Typography variant="h5" fontWeight={700} mb={2}>
        {q ? `Results for “${q}”` : 'Browse Movies'}
      </Typography>

        {/* Movie filters */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center', mb: 3 }}>

        {/* Genre filter */}
        <TextField select size="small" label="Genre" value={genre} onChange={(e) => setGenre(e.target.value)} sx={{ minWidth: 150 }}>
          <MenuItem value="">All</MenuItem>
          {genres.map((g) => <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>)}
        </TextField>
        {/* Year filter */}
        <TextField select size="small" label="Year" value={year} onChange={(e) => setYear(e.target.value)} sx={{ minWidth: 110 }}>
          <MenuItem value="">Any</MenuItem>
          {years.map((y) => <MenuItem key={y} value={y}>{y}</MenuItem>)}
        </TextField>
        {/* Rating filter */}
        <TextField select size="small" label="Min rating" value={rating} onChange={(e) => setRating(e.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="">Any</MenuItem>
          {[5, 6, 7, 8].map((r) => <MenuItem key={r} value={r}>{r}+ stars</MenuItem>)}
        </TextField>
        {/* Toggle for infinite scrolling */}
        <FormControlLabel
          control={<Switch checked={infinite} onChange={(e) => setInfinite(e.target.checked)} />}
          label="Infinite scroll"
        />
      </Box>

      {error && <ErrorMessage message={error} onRetry={() => load(page + 1, page === 0)} />}

      {!loading && !error && !hasMore && page > 0 && movies.length === 0 && (
        <Typography color="text.secondary">No movies found. Try a different title or clear a filter.</Typography>
      )}
        
      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
        {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
      </Box>

      {loading && <Box textAlign="center" my={3}><CircularProgress /></Box>}

      {!infinite && hasMore && !loading && (
         <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 3 }}>
          <Button variant="outlined" onClick={loadMore}>Load more</Button>
        </Box>
      )}

      {infinite && <div ref={sentinel} style={{ height: 1 }} />}
    </>
  );
}
