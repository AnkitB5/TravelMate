// src/components/Footer.js
import React from 'react';
import { Box, Container, Typography, Link, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  YouTube as YouTubeIcon,
} from '@mui/icons-material';
import logo from '../assets/travelmate logo/1-removebg-preview.png';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', py: 4, mt: 4 }}>
      <Container
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        {/* Logo + Description */}
        <Box
        sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
        }}
        >
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
        <Typography variant="body2" color="text.secondary" maxWidth={300}>
            Your trusted companion for unforgettable travel experiences. Plan, explore, and discover the world with Travel Mate.
        </Typography>
        </Box>

        

        {/* Quick Links */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
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
                color="text.primary"
              >
                {label}
              </Link>
            ))}
          </Box>
        </Box>

        {/* Social Media */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Connect With Us
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton aria-label="Facebook">
              <FacebookIcon />
            </IconButton>
            <IconButton aria-label="Twitter">
              <TwitterIcon />
            </IconButton>
            <IconButton aria-label="Instagram">
              <InstagramIcon />
            </IconButton>
            <IconButton aria-label="YouTube">
              <YouTubeIcon />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
