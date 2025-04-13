import React, { useState, useEffect } from 'react';
import {
  TextField,
  Autocomplete,
  CircularProgress,
  Box,
  Typography
} from '@mui/material';
import api from '../services/api';

const CitySearch = ({ value, onChange, error, helperText }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Clear options when component mounts
  useEffect(() => {
    setOptions([]);
    return () => {
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, []);

  // Function to search cities
  const searchCities = async (query) => {
    if (!query || query.length < 2) {
      setOptions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/api/cities/search/', {
        params: { q: query, limit: 15 }
      });
      
      if (response.data && response.data.cities) {
        setOptions(response.data.cities);
      } else {
        setOptions([]);
      }
    } catch (error) {
      console.error('Error searching cities:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle input change with debounce
  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    
    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set new timeout for debouncing
    const timeout = setTimeout(() => {
      searchCities(newInputValue);
    }, 500); // 500ms debounce
    
    setSearchTimeout(timeout);
  };

  return (
    <Autocomplete
      value={value}
      onChange={(event, newValue) => {
        onChange(newValue);
      }}
      inputValue={inputValue}
      onInputChange={handleInputChange}
      options={options}
      getOptionLabel={(option) => option.display_name || ''}
      isOptionEqualToValue={(option, value) => 
        option.latitude === value.latitude && 
        option.longitude === value.longitude
      }
      noOptionsText="No cities found. Try a different search term."
      loading={loading}
      fullWidth
      renderInput={(params) => (
        <TextField
          {...params}
          label="Destination"
          variant="outlined"
          error={!!error}
          helperText={helperText}
          required
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => (
        <li {...props}>
          <Box>
            <Typography variant="body1">{option.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {option.admin1}{option.admin1 && option.country ? ', ' : ''}{option.country}
            </Typography>
          </Box>
        </li>
      )}
    />
  );
};

export default CitySearch; 