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

const WeatherForecast = () => {
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
    // Fetch trip details
    const fetchTripDetails = async () => {
      try {
        const tripResponse = await api.get(`/api/trips/${tripId}/`);
        setTrip(tripResponse.data);
        
        // Fetch weather data
        const weatherResponse = await api.get(`/api/trips/${tripId}/weather/`);
        setWeatherData(weatherResponse.data);
        
        // Fetch clothing recommendations
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

  // Helper function to get the weather icon based on conditions
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

  // Get temperature color based on value
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

  // Extract daily weather data for display
  const dailyWeather = weatherData.daily ? 
    weatherData.daily.time.map((date, index) => ({
      date,
      temp_max: weatherData.daily.temperature_2m_max[index],
      temp_min: weatherData.daily.temperature_2m_min[index],
      precipitation: weatherData.daily.precipitation_probability_max[index],
      recommendations: recommendations?.recommendations?.[date] || [],
      isPartOfTrip: weatherData.trip_days ? weatherData.trip_days[index] : false
    })) : [];
  
  // Filter days based on whether they're part of the trip
  const tripDays = dailyWeather.filter(day => day.isPartOfTrip);
  const displayDays = showAllDays ? dailyWeather : tripDays;
  
  // Get trip date range string
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Get explanatory text for "predicted" dates
  const getPredictionText = (date) => {
    // Check if the date is beyond 16 days (API limit)
    const forecastDate = new Date(date);
    const today = new Date();
    const daysDifference = Math.floor((forecastDate - today) / (1000 * 60 * 60 * 24));
    
    if (daysDifference > 16) {
      return "Predicted forecast (beyond API data)";
    }
    return "";
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Paper 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`, 
          color: 'white',
          position: 'relative'
        }}
        elevation={3}
      >
        <IconButton 
          sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}
          onClick={() => navigate('/dashboard')}
        >
          <ArrowBackIcon />
        </IconButton>
        
        <Box sx={{ textAlign: 'center', mt: isMobile ? 4 : 0 }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {trip.destination}
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
            <CalendarMonthIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              {formatDate(trip.travel_start)} - {formatDate(trip.travel_end)}
            </Typography>
          </Box>
        </Box>
      </Paper>

      {weatherData.current_weather && (
        <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom fontWeight="bold">Current Weather</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <WbSunnyIcon fontSize="large" sx={{ color: '#ff9800' }} />
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: getTempColor(weatherData.current_weather.temperature) }}>
              {Math.round(weatherData.current_weather.temperature)}°F
            </Typography>
          </Box>
          <Typography variant="body1">Wind speed: {weatherData.current_weather.windspeed} mph</Typography>
        </Paper>
      )}

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" fontWeight="bold">
          Weather Forecast
        </Typography>
        
        <Box>
          <Button 
            variant={showAllDays ? "contained" : "outlined"} 
            onClick={toggleShowAllDays}
            color="primary"
            size="small"
          >
            {showAllDays ? "Show Trip Days Only" : "Show All Available Days"}
          </Button>
        </Box>
      </Box>
      
      {!isMobile && (
        <Box sx={{ mb: 2 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ 
              '.MuiTabs-indicator': { 
                height: 3, 
                borderRadius: '3px 3px 0 0' 
              } 
            }}
          >
            {displayDays.map((day, idx) => (
              <Tab 
                key={idx} 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      {getWeatherIcon(day.precipitation)}
                      {day.isPartOfTrip && (
                        <Chip 
                          size="small" 
                          label="Trip" 
                          color="primary" 
                          sx={{ height: 16, fontSize: '0.6rem', ml: 0.5 }}
                        />
                      )}
                    </Box>
                  </Box>
                } 
              />
            ))}
          </Tabs>
        </Box>
      )}

      <Grid container spacing={3}>
        {isMobile ? (
          // Mobile view: Show all days in a vertical list
          displayDays.map((day, index) => (
            <Grid item xs={12} key={index}>
              <WeatherDayCard 
                day={day} 
                getWeatherIcon={getWeatherIcon} 
                getTempColor={getTempColor}
                getPredictionText={getPredictionText}
              />
            </Grid>
          ))
        ) : (
          // Desktop view: Show the selected day in detail
          <Grid item xs={12}>
            {displayDays[activeTab] && (
              <WeatherDayCard 
                day={displayDays[activeTab]} 
                getWeatherIcon={getWeatherIcon}
                getTempColor={getTempColor}
                getPredictionText={getPredictionText}
                detailed
              />
            )}
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

// Component for the weather day card
const WeatherDayCard = ({ day, getWeatherIcon, getTempColor, getPredictionText, detailed = false }) => {
  const predictionText = getPredictionText(day.date);
  const isPredicted = predictionText !== "";
  
  return (
    <Card 
      raised={detailed} 
      sx={{ 
        height: '100%',
        borderRadius: 2,
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 8,
        },
        border: day.isPartOfTrip ? '2px solid #3f51b5' : 'none',
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight="bold">
              {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long' })}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(day.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </Typography>
            
            {isPredicted && (
              <Tooltip title="This forecast is predicted based on patterns as it's beyond the weather API's data range">
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <InfoIcon fontSize="small" color="disabled" sx={{ mr: 0.5 }} />
                  <Typography variant="caption" color="text.secondary">
                    Predicted forecast
                  </Typography>
                </Box>
              </Tooltip>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {getWeatherIcon(day.precipitation)}
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {day.precipitation}% rain
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3 }}>
          <Typography 
            variant="h4" 
            color={getTempColor(day.temp_max)} 
            fontWeight="bold"
            sx={{ mr: 2 }}
          >
            {Math.round(day.temp_max)}°
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {Math.round(day.temp_min)}°
          </Typography>
        </Box>
        
        {day.recommendations && day.recommendations.length > 0 && (
          <>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle1" fontWeight="bold" color="primary">
              Clothing Recommendations:
            </Typography>
            <List dense>
              {day.recommendations.map((rec, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                  </ListItemIcon>
                  <ListItemText primary={rec} />
                </ListItem>
              ))}
            </List>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherForecast; 