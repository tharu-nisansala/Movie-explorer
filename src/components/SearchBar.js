import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paper, InputBase, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useMovies } from '../context/MovieContext';

export default function SearchBar() {
  const navigate = useNavigate();
  const { lastSearch, setLastSearch } = useMovies(); // Get the last search term and function to update it from the MovieContext
  const [text, setText] = useState(lastSearch); // Initialize the search input with the last search term

  // Handle form submission for the search bar
  const handleSubmit = (e) => {
    e.preventDefault();
    const q = text.trim();
    if (q) {
      setLastSearch(q);
      navigate(`/search?q=${encodeURIComponent(q)}`);
    }
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} variant="outlined" sx={{ display: 'flex', alignItems: 'center', px: 1.5, maxWidth: 420, flexGrow: 1 }}>
      <InputBase
        fullWidth
        placeholder="Search for movies..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        inputProps={{ 'aria-label': 'Search movies' }}
      />
      <IconButton type="submit" aria-label="Search"><SearchIcon /></IconButton>
    </Paper>
  );
}