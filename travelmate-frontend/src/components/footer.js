// src/components/Footer.js
import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import logo from '../assets/travelmate logo/1-removebg-preview.png';

const Footer = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Only show footer on the home page
  if (pathname !== '/') {
    return null;
  }

  return (
    <Box sx={{ backgroundColor: 'black', py: 4, mt: 4 }}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        {/* Logo + Description */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box
            onClick={() => navigate('/')}
            sx={{ height: 100, width: 'fit-content', cursor: 'pointer', mb: 2 }}
          >
            <Box
              component="img"
              src={logo}
              alt="Travel Mate Logo"
              sx={{ height: '150%' }}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'white' }} maxWidth={300}>
            Your trusted companion for unforgettable travel experiences. Plan, explore, and discover the world with Travel Mate.
          </Typography>
        </Box>

        {/* Quick Links */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            Quick Links
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {[
              { label: 'Home', path: '/' },
              { label: 'Login', path: '/login' },
              { label: 'Sign Up', path: '/signup' },
              { label: 'About Us', path: '/about' },
            ].map(({ label, path }) => (
              <Link
                key={label}
                href={path}
                underline="hover"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(path);
                }}
                sx={{ color: 'white' }}
              >
                {label}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Social Media */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
            Connect With Us
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton aria-label="Facebook" sx={{ color: 'white' }}>
              <FacebookIcon />
            </IconButton>
            <IconButton aria-label="Twitter" sx={{ color: 'white' }}>
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="Instagram" sx={{ color: 'white' }}>
              <InstagramIcon />
            </IconButton>
            <IconButton aria-label="YouTube" sx={{ color: 'white' }}>
              <YouTubeIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
