import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Box, Button, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import MovieIcon from '@mui/icons-material/Movie';

export default function Login() {
  const { user, login } = useAuth(); // Get the logged-in user and login function from AuthContext
  const navigate = useNavigate();  // Get the navigate function from React Router to programmatically navigate after login
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState(false);

  if (user) return <Navigate to="/" replace />;

  // Handle form submission for login
  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (form.username.trim().length < 3) newErrors.username = 'Username is required';
    if (form.password.length < 6) newErrors.password = 'Password is required';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      login(form.username, form.password);
      navigate('/');
    }
};

return (
  <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2, background: 'radial-gradient(circle at 30% 20%, #2a1a5e, #0B0B14 70%)'}}>
      <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, width: '100%', maxWidth: 400, display: 'grid', gap: 2 }}>
        
        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1,}}>
            <MovieIcon sx={{ fontSize: 28, color: '#b978e4' }}/><Typography variant="h5" fontWeight={800}>Movie Explorer</Typography>
        </Box>

       {/* Input fields for username and password with validation and visibility toggle for password */} 
        <TextField
          label="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          error={!!errors.username}
          helperText={errors.username}
          autoComplete="username"
        />
        <TextField
          label="Password"
          type={show ? 'text' : 'password'}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={!!errors.password}
          helperText={errors.password}
          autoComplete="current-password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShow(!show)} aria-label="Show password">
                  {show ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        
        <Button type="submit" variant="contained" size="large">Login</Button>
        <Typography variant="caption" color="text.secondary" textAlign="center">
          Demo login: any username (3+ chars) and password (6+ chars).
        </Typography>
      </Paper>
    </Box>
    );
}

