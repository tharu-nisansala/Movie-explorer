import { Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getTheme } from './theme';
import { useMovies } from './context/MovieContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';

// Protect pages that should only be accessible after login
function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  const { mode} = useMovies();

  return (
    // Apply the selected theme and set up routing for the application
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline /> 
      
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<Protected><Layout /></Protected>}>
        {/* Define routes for the main pages of the application */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/movies" element={<SearchResults />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

    </ThemeProvider>
  );
}
export default App;