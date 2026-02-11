import React from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate, Link } from 'react-router-dom';

// MUI Components
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box className="aurora-bg" sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          background: 'rgba(79, 70, 229, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography 
              variant="h6" 
              component={Link} 
              to="/"
              sx={{ 
                flexGrow: 1, 
                textDecoration: 'none', 
                color: 'white',
                fontWeight: 'bold'
              }}
            >
              Project Management System
            </Typography>
            {isAuthenticated && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {role === 'admin' && (
                  <Button 
                    component={Link} 
                    to="/admin"
                    sx={{ color: 'white' }}
                  >
                    Projects
                  </Button>
                )}
                {role === 'manager' && (
                  <Button 
                    component={Link} 
                    to="/manager"
                    sx={{ color: 'white' }}
                  >
                    Employees
                  </Button>
                )}
                <Button 
                  component={Link} 
                  to="/my-tasks"
                  sx={{ color: 'white' }}
                >
                  My Tasks
                </Button>
                <Button 
                  variant="contained"
                  onClick={handleLogout}
                  sx={{ 
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' }
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1, 
          py: 4,
          position: 'relative',
          zIndex: 10
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default Layout;
