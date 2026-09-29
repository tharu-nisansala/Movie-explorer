import { useState } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import { useMovies } from '../context/MovieContext';
import MovieCard from '../components/MovieCard';

export default function Favorites() {
  const { favorites } = useMovies();   // Get the saved favorite movies from MovieContext
    const [filter, setFilter] = useState('');

    // Filter the favorites list based on the search input (case-insensitive)
    const list = favorites.filter((m) =>
        m.title.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            <Typography variant="h5" fontWeight={700}>My Favorites</Typography>
            <TextField size="small" placeholder="Search your favorites..." value={filter} onChange={(e) => setFilter(e.target.value)} />
        </Box>

         {/* Show a message when there are no matching movies */}
        {list.length === 0 ? (
            <Typography color="text.secondary">
            {favorites.length ? 'No favorites match your search.' : 'No favorites yet. Tap the heart on any movie to save it here.'}
            </Typography>
        ) : (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))' }}>
            {list.map((m) => <MovieCard key={m.id} movie={m} />)}  {/*Reuse the MovieCard component to display each favorite movie*/}
            </Box>
        )}
        </>
    );
}