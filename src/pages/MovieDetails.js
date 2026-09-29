import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Avatar, Box, Button, Chip, CircularProgress, Dialog, DialogContent,IconButton, Paper, Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ErrorMessage from '../components/ErrorMessage';
import { getMovie, img, errMsg } from '../api/tmdb';
import { useMovies } from '../context/MovieContext';

// Helper function to format numbers as currency in millions
const money = (n) => (n ? `$${(n / 1e6).toFixed(0)} million` : '—');

// Small reusable component for displaying movie information
const Info = ({ label, value }) => (
  <Box>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
    <Typography variant="body2">{value || '—'}</Typography>
  </Box>
);

export default function MovieDetails() {
  const { id } = useParams();        // Get the movie ID from the URL parameters
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useMovies();  //Get favorite-related functions from MovieContext
  const [m, setM] = useState(null);     // Store the movie details received from the API
  const [error, setError] = useState('');
  const [trailerOpen, setTrailerOpen] = useState(false);  //// Controls whether the trailer dialog is open

   // Load the selected movie details from TMDb
  const load = useCallback(async () => {
    setError('');
    setM(null);
    try {
      setM(await getMovie(id));
    } catch (e) {
      setError(errMsg(e));
    }
  }, [id]);

  useEffect(() => { load(); }, [load]);

  if (error) return <ErrorMessage message={error} onRetry={load} />;
  if (!m) return <Box textAlign="center" mt={8}><CircularProgress /></Box>;

  // Find a YouTube video marked as a movie trailer
  const trailer = m.videos?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer');
  const fav = isFavorite(m.id);

  return (
    <>
    {/* Back button and page title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={() => navigate(-1)} aria-label="Back"><ArrowBackIcon /></IconButton>
        <Typography variant="h6" fontWeight={700} sx={{ ml: 1 }}>Movie Details</Typography>
      </Box>

     {/* Movie poster and favorite button */}
      <Paper sx={{ p: 3, display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        <Box sx={{ width: 260, maxWidth: '100%' }}>
          <Box component="img" src={img(m.poster_path, 'w500')} alt={m.title} sx={{ width: '100%', borderRadius: 2 }} />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={() => toggleFavorite(m)}
            startIcon={fav ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          >
            {fav ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </Box>

        {/* Main movie details */}
        <Box sx={{ flex: 1, minWidth: 260 }}>
          <Typography variant="h4" fontWeight={800}>{m.title}</Typography>
          <Typography color="text.secondary" mb={1}>
            {m.release_date?.slice(0, 4)} • {m.runtime ? `${Math.floor(m.runtime / 60)}h ${m.runtime % 60}m` : ''}
          </Typography>

        {/* Rating and trailer button */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
              <StarIcon sx={{ color: '#f5c518', mr: 0.5 }} />{m.vote_average.toFixed(1)}/10
              <Typography component="span" variant="caption" color="text.secondary" ml={1}>
                ({m.vote_count.toLocaleString()} votes)
              </Typography>
            </Typography>

             {/* Show the trailer button only when a trailer is available */}
            {trailer && (
              <Button variant="outlined" startIcon={<PlayArrowIcon />} onClick={() => setTrailerOpen(true)}>
                Watch Trailer
              </Button>
            )}
          </Box>

            {/* Movie description */}
          <Typography fontWeight={700}>Overview</Typography>
          <Typography color="text.secondary" mb={2} maxWidth={620}>{m.overview || 'No overview available.'}</Typography>

          <Typography fontWeight={700} mb={1}>Genres</Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
            {m.genres.map((g) => <Chip key={g.id} label={g.name} color="primary" variant="outlined" />)}
          </Box>
            {/* Display the first six cast members */}
          <Typography fontWeight={700} mb={1}>Cast</Typography>
          <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {m.credits.cast.slice(0, 6).map((c) => (
              <Box key={c.id} sx={{ textAlign: 'center', width: 84, flexShrink: 0 }}>
                <Avatar src={img(c.profile_path, 'w185')} alt={c.name} sx={{ width: 64, height: 64, mx: 'auto', mb: 0.5 }} />
                <Typography variant="caption">{c.name}</Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>

    { /* Additional movie information */}
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography fontWeight={700} mb={2}>Movie Info</Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 2 }}>
          <Info label="Release Date" value={m.release_date} />
          <Info label="Budget" value={money(m.budget)} />
          <Info label="Status" value={m.status} />
          <Info label="Language" value={m.spoken_languages[0]?.english_name} />
          <Info label="Revenue" value={money(m.revenue)} />
          <Info label="Production" value={m.production_companies[0]?.name} />
        </Box>
      </Paper>

      {/* Popup dialog used to play the movie trailer */}
      <Dialog open={trailerOpen} onClose={() => setTrailerOpen(false)} maxWidth="md" fullWidth>
        <DialogContent sx={{ p: 0, aspectRatio: '16/9' }}>
          {trailerOpen && trailer && (
            <iframe
              title="Trailer"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              allow="autoplay; encrypted-media"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}