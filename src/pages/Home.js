import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Chip, CircularProgress } from '@mui/material';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { getTrending, getPopular, errMsg } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';
import MovieRow from '../components/MovieRow';
import ErrorMessage from '../components/ErrorMessage';

export default function Home() {
  const { lastSearch } = useMovies();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  // Load trending and popular movies from the TMDB API
  const load = useCallback(async () => {
    setError('');
    setData(null);
    try {
      const [trending, popular] = await Promise.all([getTrending(), getPopular()]);
      setData({ trending, popular });
    } catch (e) {
      setError(errMsg(e));
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Show an error message with a retry option if the API call fails
  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!data) return <Box textAlign="center" mt={8}><CircularProgress /></Box>;

  return (
    <>
    {/* Display a chip with the last searched term, allowing users to quickly repeat their last search. Clicking the chip navigates to the search results page for that term. */}
      {lastSearch && (
        <Chip
          label={`Last searched: ${lastSearch}`}
          onClick={() => navigate(`/search?q=${encodeURIComponent(lastSearch)}`)}
          sx={{ mb: 2 }}
        />
      )}

      <MovieRow
        title={
        <>
        Trending Movies <WhatshotIcon sx={{ color: '#f58318', verticalAlign: 'middle' }} />
        </>
        }
        movies={data.trending}
      />
      <MovieRow title="Popular This Week" movies={data.popular} />
    </>
  );
}