import { Card, CardMedia, CardContent, Typography, Box, CardActionArea, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { useNavigate } from 'react-router-dom';
import { useMovies } from '../context/MovieContext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'

// Base URL used to display movie poster images from TMDb
const IMG = 'https://image.tmdb.org/t/p/w342';

// MovieCard component displays a card for a single movie, including its poster, title, release year, rating, and favorite status.
export default function MovieCard({ movie }) {

    const year = movie.release_date?.slice(0, 4) || '—';
    const navigate = useNavigate();
    const { isFavorite, toggleFavorite } = useMovies();
    const fav = isFavorite(movie.id);

    return (
        <Card sx={{ height: '100%', position: 'relative'}}>
        {/* Favorite button to toggle the movie's favorite status */}
        <IconButton
            aria-label="Toggle favorite"
            size="small"
            onClick={() => toggleFavorite(movie)}
            sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1, bgcolor: 'rgba(0,0,0,.55)', '&:hover': { bgcolor: 'rgba(0,0,0,.75)' } }}
        >
            {fav ? <FavoriteIcon fontSize="small" sx={{ color: '#ff4d6d' }} /> : <FavoriteBorderIcon fontSize="small" sx={{ color: '#fff' }} />}
        </IconButton>
        {/* CardActionArea makes the entire card clickable, navigating to the movie's detail page when clicked */}
        <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)}>
            <CardMedia
            component="img"
            image={movie.poster_path ? IMG + movie.poster_path : 'https://placehold.co/342x513?text=No+Poster'}
            alt={movie.title}
            sx={{ aspectRatio: '2/3' }}
            />
        
        <CardContent sx={{ p: 1 }}>
            <Typography variant="body2" fontWeight={600} noWrap title={movie.title}>
            {movie.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">{year}</Typography>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ fontSize: 14, color: '#f5c518' }} />
                {movie.vote_average.toFixed(1)}
            </Typography>
            </Box>
        </CardContent>
        </CardActionArea>
        </Card>
    );
}