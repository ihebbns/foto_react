import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Typography, Container, CssBaseline, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './login.css'; // Import CSS for styling

const LoginForm = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('https://botdis.xyz/admin/auth/login', { username, password });
      console.log('Login successful', response.data);
      setIsAuthenticated(true);
      navigate('/admin');
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
   
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <br></br><br></br><br></br><br></br>
      <div className="login-form">
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Welcome Back!
        </Typography>
        <Typography variant="body2" align="center" gutterBottom>
          Sign in to access your account
        </Typography>
        {error && <div className="error">{error}</div>}
        <Box mt={3}>
          <form onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Box>
      </div>
    </Container>
  );
};

export default LoginForm;
