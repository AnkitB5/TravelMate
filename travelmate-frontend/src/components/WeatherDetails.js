import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import CloudIcon from '@mui/icons-material/Cloud';
import UmbrellaIcon from '@mui/icons-material/Umbrella';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import api from '../services/api';

const WeatherDetails = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [trip, setTrip] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showAllDays, setShowAllDays] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const tripResponse = await api.get(`/api/trips/${tripId}/`);
        setTrip(tripResponse.data);
        
        const weatherResponse = await api.get(`/api/trips/${tripId}/weather/`);
        setWeatherData(weatherResponse.data);
        
        const recommendationsResponse = await api.get(`/api/trips/${tripId}/clothing-recommendations/`);
        setRecommendations(recommendationsResponse.data);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to fetch weather data. Please try again later.');
        setLoading(false);
      }
    };

    fetchTripDetails();
  }, [tripId]);

  const getWeatherIcon = (precipitation) => {
    if (precipitation > 80) {
      return <ThunderstormIcon fontSize="large" sx={{ color: '#6200ea' }} />;
    } else if (precipitation > 60) {
      return <UmbrellaIcon fontSize="large" sx={{ color: '#0277bd' }} />;
    } else if (precipitation > 30) {
      return <CloudIcon fontSize="large" sx={{ color: '#78909c' }} />;
    } else if (precipitation > 10) {
      return <CloudIcon fontSize="large" sx={{ color: '#b0bec5' }} />;
    } else {
      return <WbSunnyIcon fontSize="large" sx={{ color: '#ff9800' }} />;
    }
  };

  const getTempColor = (temp) => {
    if (temp >= 90) return '#e53935'; // Hot (red)
    if (temp >= 80) return '#ff7043'; // Warm (orange)
    if (temp >= 70) return '#ffb74d'; // Pleasant warm (light orange)
    if (temp >= 60) return '#aed581'; // Pleasant cool (light green)
    if (temp >= 45) return '#4fc3f7'; // Cool (light blue)
    if (temp >= 32) return '#29b6f6'; // Cold (blue)
    return '#9575cd'; // Very cold (purple)
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const toggleShowAllDays = () => {
    setShowAllDays(!showAllDays);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  if (!trip || !weatherData) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">No weather data available for this trip.</Alert>
        <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  const dailyWeather = weatherData.daily ? 
    weatherData.daily.time.map((date, index) => ({
      date,
      temp_max: weatherData.daily.temperature_2m_max[index],
      temp_min: weatherData.daily.temperature_2m_min[index],
      precipitation: weatherData.daily.precipitation_probability_max[index],
      recommendations: recommendations?.recommendations?.[date] || [],
      isPartOfTrip: weatherData.trip_days ? weatherData.trip_days[index] : false
    })) : [];
  
  const tripDays = dailyWeather.filter(day => day.isPartOfTrip);
  const displayDays = showAllDays ? dailyWeather : tripDays;

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            {trip.destination} Weather Forecast
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {new Date(trip.travel_start).toLocaleDateString()} - {new Date(trip.travel_end).toLocaleDateString()}
          </Typography>
        </Paper>

        <Box sx={{ mb: 3 }}>
          <Button
            variant={showAllDays ? "contained" : "outlined"}
            onClick={toggleShowAllDays}
            startIcon={<CalendarMonthIcon />}
          >
            {showAllDays ? "Show Trip Days Only" : "Show All Days"}
          </Button>
        </Box>

        <Grid container spacing={3}>
          {isMobile ? (
            // Mobile view: Show all days in a vertical list
            displayDays.map((day, index) => (
              <Grid item xs={12} key={index}>
                <Card 
                  sx={{ 
                    bgcolor: day.isPartOfTrip ? 'background.paper' : 'grey.100',
                    opacity: day.isPartOfTrip ? 1 : 0.7
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Typography>
                      {getWeatherIcon(day.precipitation)}
                    </Box>
                    <Box mt={2}>
                      <Typography variant="h4" sx={{ color: getTempColor(day.temp_max) }}>
                        {Math.round(day.temp_max)}°F
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Low: {Math.round(day.temp_min)}°F
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Rain: {day.precipitation}%
                      </Typography>
                    </Box>
                    {day.isPartOfTrip && day.recommendations.length > 0 && (
                      <Box mt={2}>
                        <Typography variant="subtitle2" color="primary">
                          Clothing Recommendations:
                        </Typography>
                        <List dense>
                          {day.recommendations.map((rec, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <CheckCircleIcon color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={rec} />
                            </ListItem>
                          ))}
                        </List>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            // Desktop view: Show the selected day in detail
            <Grid item xs={12}>
              {displayDays[activeTab] && (
                <Card>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography variant="h4">
                        {new Date(displayDays[activeTab].date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </Typography>
                      {getWeatherIcon(displayDays[activeTab].precipitation)}
                    </Box>
                    <Box mt={3} display="flex" justifyContent="space-around">
                      <Box textAlign="center">
                        <Typography variant="h2" sx={{ color: getTempColor(displayDays[activeTab].temp_max) }}>
                          {Math.round(displayDays[activeTab].temp_max)}°F
                        </Typography>
                        <Typography variant="subtitle1">High</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h2" sx={{ color: getTempColor(displayDays[activeTab].temp_min) }}>
                          {Math.round(displayDays[activeTab].temp_min)}°F
                        </Typography>
                        <Typography variant="subtitle1">Low</Typography>
                      </Box>
                      <Box textAlign="center">
                        <Typography variant="h2" color="primary">
                          {displayDays[activeTab].precipitation}%
                        </Typography>
                        <Typography variant="subtitle1">Rain Chance</Typography>
                      </Box>
                    </Box>
                    {displayDays[activeTab].isPartOfTrip && displayDays[activeTab].recommendations.length > 0 && (
                      <Box mt={4}>
                        <Typography variant="h6" gutterBottom>
                          Clothing Recommendations
                        </Typography>
                        <Grid container spacing={2}>
                          {displayDays[activeTab].recommendations.map((rec, i) => (
                            <Grid item xs={12} sm={6} key={i}>
                              <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                <Box display="flex" alignItems="center">
                                  <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                                  <Typography>{rec}</Typography>
                                </Box>
                              </Paper>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}
            </Grid>
          )}
        </Grid>

        {!isMobile && (
          <Box sx={{ mt: 3 }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="weather days"
            >
              {displayDays.map((day, index) => (
                <Tab
                  key={index}
                  label={
                    <Box textAlign="center">
                      <Typography variant="body2">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </Typography>
                      <Typography variant="h6" sx={{ color: getTempColor(day.temp_max) }}>
                        {Math.round(day.temp_max)}°F
                      </Typography>
                    </Box>
                  }
                />
              ))}
            </Tabs>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default WeatherDetails; 