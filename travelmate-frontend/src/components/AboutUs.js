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
} from '@mui/material';

const AboutUs = () => {
  return (
    <Box>
      {/* Hero / Intro Section */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
            Meet Our Team
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            Building the Future of AI powered travel plans
          </Typography>
        </Container>
      </Box>

      {/* Team Section */}
      <Container sx={{ py: 6 }}>
        <Grid container spacing={4} justifyContent="center">
          {/* Team Member 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardMedia
                component="img"
                height="180"
                image="https://via.placeholder.com/180x180?text=Scrum+Master"
                alt="Scrum Master"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Akash Satya
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Scrum Master
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Ensures the process runs smoothly and tackles obstacles.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Member 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardMedia
                component="img"
                height="180"
                image="https://via.placeholder.com/180x180?text=Product+Owner"
                alt="Product Owner"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Ankit Bhattarai
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Product Owner
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Prioritizes the project work, focusing on delivering value.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Member 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardMedia
                component="img"
                height="180"
                image="https://via.placeholder.com/180x180?text=Developer"
                alt="Developer"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Krish Bhalodiya
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Front-End Developer
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Crafting beautiful user interfaces and engineering great UX.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Team Member 4 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardMedia
                component="img"
                height="180"
                image="https://via.placeholder.com/180x180?text=Developer"
                alt="Developer"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Parth Dangi
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Front-End Developer
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Creating responsive and intuitive designs.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center' }}>
              <CardMedia
                component="img"
                height="180"
                image="https://via.placeholder.com/180x180?text=Developer"
                alt="Developer"
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Bharat Khadka
                </Typography>
                <Typography variant="subtitle1" color="primary">
                  Full-Stack Developer
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                 Developing both client and server software.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Project Overview Section */}
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
            Project Overview
          </Typography>
          <Grid container spacing={2} justifyContent="center">
            {/* Card 1 */}
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Our Mission
                  </Typography>
                  <Typography variant="body2">
                    Creating a user-friendly product for a more seamless browsing and movie experience.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 2 */}
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Team Collaboration
                  </Typography>
                  <Typography variant="body2">
                    Regular meetings and smooth communication to ensure on-track progress.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Card 3 */}
            <Grid item xs={12} sm={4} md={3}>
              <Card sx={{ minHeight: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CardContent>
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Development Process
                  </Typography>
                  <Typography variant="body2">
                    Agile methodology with regular sprints and continuous improvements.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Key Features Section */}
      <Container sx={{ py: 6 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 3 }}>
          Key Features
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {/* Feature 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ textAlign: 'center' }}>
                  Feature One
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Feature 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ textAlign: 'center' }}>
                  Feature Two
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Feature 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CardContent>
                <Typography variant="h6" color="primary" sx={{ textAlign: 'center' }}>
                  Feature Three
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutUs;
