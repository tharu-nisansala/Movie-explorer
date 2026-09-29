import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { AppBar, Avatar, Box, Button, Divider, Drawer, IconButton, List, ListItemButton,
  ListItemIcon, ListItemText, Menu, MenuItem, Switch, Toolbar, Typography, useMediaQuery,} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import SearchBar from './SearchBar';
import { useMovies } from '../context/MovieContext';
import { useAuth } from '../context/AuthContext';

// Width of the sidebar
const WIDTH = 220;

// Navigation links displayed in the sidebar
const links = [
  { to: '/', label: 'Home', icon: <HomeIcon /> },
  { to: '/movies', label: 'Movies', icon: <MovieIcon /> },
  { to: '/favorites', label: 'Favorites', icon: <FavoriteIcon /> },
];

export default function Layout() {
    
  const { mode, toggleMode } = useMovies();            // Get theme mode and theme toggle function from MovieContext
  const { user, logout } = useAuth();                  // Get logged-in user and logout function from AuthContext
  const desktop = useMediaQuery((theme) => theme.breakpoints.up('md'));   // Check whether the screen is desktop size or larger.'md' breakpoint is used to switch between desktop and mobile layouts
  const [open, setOpen] = useState(false);            // Controls whether the mobile sidebar is open
  const [anchor, setAnchor] = useState(null);         // Controls the anchor element for the user menu

  //Sidebar content
  const sidebar = (
    <Box sx={{ width: WIDTH, height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
    {/*Application logo and title*/}
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2, }}>
        <MovieIcon sx={{fontSize: 26, color: 'primary.main',}}/>
        <Typography variant="h6" fontWeight={800}> Movie Explorer</Typography>
    </Box>
    {/* Navigation menu */}
    <List sx={{ flexGrow: 1 }}>
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            style={{ textDecoration: 'none', color: 'inherit' }}
            onClick={() => setOpen(false)}
          >
            {({ isActive }) => (
              <ListItemButton selected={isActive} sx={{ borderRadius: 2, mb: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 38 }}>{l.icon}</ListItemIcon>
                <ListItemText primary={l.label} />
              </ListItemButton>
            )}
          </NavLink>
        ))}
    </List>
    {/* Horizontal divider */}
    <Divider sx={{ mb: 1 }} />
    {/* Dark/Light theme control */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2">Theme</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Switch size="small" checked={mode === 'dark'} onChange={toggleMode} inputProps={{ 'aria-label': 'Toggle dark mode' }} />
          {mode === 'dark' ? <DarkModeIcon fontSize="small" /> : <LightModeIcon fontSize="small" />}
        </Box>
      </Box>

        {/* Logout button */}
      <Button startIcon={<LogoutIcon />} color="error" variant="outlined" onClick={logout}>
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
    {/* Sidebar for desktop and mobile */}
      {desktop ? (
        <Drawer variant="permanent" sx={{ width: WIDTH, flexShrink: 0, '& .MuiDrawer-paper': { width: WIDTH } }}>
          {sidebar}
        </Drawer>
      ) : (

    /* Mobile sidebar that opens when the menu button is clicked */
        <Drawer open={open} onClose={() => setOpen(false)}>{sidebar}</Drawer>
      )}

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Toolbar sx={{ gap: 2 }}>
            {!desktop && (
              <IconButton onClick={() => setOpen(true)} aria-label="Open menu"><MenuIcon /></IconButton>
            )}

            {/* Search bar for searching movies */}
            <SearchBar />

            <Box sx={{ flexGrow: 1 }} />
            {/* User greeting and avatar with a dropdown menu for logout */}
            <Button
              color="inherit"
              onClick={(e) => setAnchor(e.currentTarget)}
              startIcon={<Avatar sx={{ width: 28, height: 28 }}>{user?.[0]?.toUpperCase()}</Avatar>}
            >
              Hello, {user}
            </Button>
            
            <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
                {/* Logout option */}
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}