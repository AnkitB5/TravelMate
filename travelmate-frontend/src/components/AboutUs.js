// src/components/AboutUs.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import {
  FlightTakeoff,
  Map,
  LocalActivity,
  AssistantPhoto,
  AutoAwesome,
  Psychology,
  Security,
} from '@mui/icons-material';

const AboutUs = () => {
  return (
    <Box sx={{ pb: 10 }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #0277bd 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
          borderRadius: { xs: '0', md: '0 0 50px 50px' },
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.1,
            backgroundImage: 'url(https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 0,
          }}
        />
        <Container sx={{ position: 'relative', zIndex: 1 }}>
          <Typography variant="h2" sx={{ fontWeight: 800, mb: 2, textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
            Reimagining Travel Planning
          </Typography>
          <Typography variant="h5" sx={{ fontWeight: 300, maxWidth: 800, mx: 'auto', mb: 4 }}>
            We're on a mission to transform how people experience the world through intelligent travel assistance
          </Typography>
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center"
            sx={{ flexWrap: 'wrap', gap: 1 }}
          >
            <Chip 
              icon={<FlightTakeoff />} 
              label="Smart Itineraries" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}
            />
            <Chip 
              icon={<Map />} 
              label="Weather Integration" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}
            />
            <Chip 
              icon={<LocalActivity />} 
              label="AI Recommendations" 
              sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(10px)' }}
            />
          </Stack>
        </Container>
      </Box>

      {/* Our Story Section */}
      <Container sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h3" sx={{ fontWeight: 700, mb: 3, color: '#1a237e' }}>
              Our Story
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.1rem', lineHeight: 1.7 }}>
              TravelMate began when a group of passionate travelers recognized the challenges of planning meaningful trips in our busy world. We combined our expertise in technology and travel to create a solution that bridges the gap.
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem', lineHeight: 1.7 }}>
              Today, TravelMate empowers travelers to create personalized itineraries enhanced by AI, real-time weather data, and cultural insights - all while simplifying the organizational aspects of travel.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Chip label="Founded in 2023" color="primary" variant="outlined" />
              <Chip label="10,000+ Trips Planned" color="primary" variant="outlined" />
              <Chip label="Global Coverage" color="primary" variant="outlined" />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1522199755839-a2bacb67c546?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
              alt="Travel planning on digital devices"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 4,
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                transform: 'rotate(1deg)',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Team Section */}
      <Box sx={{ backgroundColor: 'rgba(2, 119, 189, 0.05)', py: 8, mt: 8 }}>
        <Container>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontWeight: 700, color: '#0277bd', mb: 1 }}>
              Meet Our Team
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
              A diverse group of travel enthusiasts and technology experts working to enhance your journey
            </Typography>
          </Box>
          
          <Grid container spacing={4} justifyContent="center">
            {/* Team Member 1 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=634&q=80"
                    alt="Akash Satya"
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center', bgcolor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Akash Satya
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
                    Scrum Master
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2">
                    Coordinates our agile process and ensures smooth collaboration between teams.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Team Member 2 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    image="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=634&q=80"
                    alt="Ankit Bhattarai"
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center', bgcolor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Ankit Bhattarai
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
                    Product Owner
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2">
                    Shapes our vision and ensures we deliver features that truly enhance your travel experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Team Member 3 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=634&q=80"
                    alt="Krish Bhalodiya"
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center', bgcolor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Krish Bhalodiya
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
                    Front-End Developer
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2">
                    Crafts beautiful interfaces that make planning your trips a delightful experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Team Member 4 */}
            <Grid item xs={12} sm={6} md={3}>
              <Card 
                sx={{ 
                  height: '100%',
                  borderRadius: 4,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.2)',
                  }
                }}
              >
                <Box sx={{ position: 'relative', pt: '100%' }}>
                  <CardMedia
                    component="img"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=634&q=80"
                    alt="Parth Dangi"
                  />
                </Box>
                <CardContent sx={{ textAlign: 'center', bgcolor: 'white' }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Parth Dangi
                  </Typography>
                  <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
                    Front-End Developer
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography variant="body2">
                    Specializes in creating responsive designs that work seamlessly across all devices.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Container sx={{ py: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#1a237e', mb: 1 }}>
            Key Features
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto' }}>
            Tools designed to enhance every step of your travel journey
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Feature 1 */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box display="flex" flexDirection="column" height="100%">
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <AutoAwesome fontSize="large" />
                </Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  AI-Powered Recommendations
                </Typography>
                <Typography variant="body1" sx={{ mb: 'auto', color: 'text.secondary' }}>
                  Our intelligent algorithms analyze your preferences and travel patterns to suggest personalized activities, dining options, and hidden gems.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box display="flex" flexDirection="column" height="100%">
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <Psychology fontSize="large" />
                </Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Smart Packing Lists
                </Typography>
                <Typography variant="body1" sx={{ mb: 'auto', color: 'text.secondary' }}>
                  Never forget essential items again. Our app generates customized packing lists based on your destination's weather, planned activities, and trip duration.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} md={4}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                height: '100%',
                border: '1px solid rgba(0,0,0,0.08)',
                borderRadius: 4,
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                }
              }}
            >
              <Box display="flex" flexDirection="column" height="100%">
                <Box 
                  sx={{ 
                    bgcolor: 'primary.main', 
                    color: 'white', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                  }}
                >
                  <AssistantPhoto fontSize="large" />
                </Box>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Cultural Insights
                </Typography>
                <Typography variant="body1" sx={{ mb: 'auto', color: 'text.secondary' }}>
                  Travel with confidence and respect. Gain valuable insights into local customs, etiquette, and cultural norms for your destination.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Vision Section */}
      <Box sx={{ backgroundColor: 'rgba(26, 35, 126, 0.05)', py: 8, mt: 8 }}>
        <Container>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 600, letterSpacing: 1.5 }}>
                OUR VISION
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 3, color: '#1a237e' }}>
                Transforming Travel Planning
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem', mb: 3 }}>
                We envision a world where every traveler has access to personalized, intelligent assistance that makes planning and experiencing journeys effortless and enriching.
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                By combining cutting-edge AI technology with human-centered design, we're building tools that adapt to your unique travel style and help you create memories that last a lifetime.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80"
                alt="Travel vision"
                sx={{
                  width: '100%',
                  borderRadius: 4,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs;
