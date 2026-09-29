import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Paper, Typography } from '@mui/material';
import MovieCard from './MovieCard';

// MovieRow component displays a row of movie cards with a title and a "View All" link.
export default function MovieRow({ title, movies, to = '/movies' }) {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
        <Typography variant="h6" fontWeight={700}>{title}</Typography>
       {/* Navigate to the full movies page. RouterLink allows React Router navigation without reloading the page.*/}
        <Link component={RouterLink} to={to} underline="hover" variant="body2">View All</Link>
      </Box>
        {/* Display a horizontal scrollable row of movie cards. Each card is wrapped in a Box to set a minimum width. */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 1 }}>
        {movies.map((m) => (
          <Box key={m.id} sx={{ minWidth: 150, width: 150 }}>
            <MovieCard movie={m} />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}