import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  CircularProgress,
  Box
} from '@mui/material';
import api from '../services/api';

const CitySearch = ({ value, onChange, error, helperText }) => {
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = async (event, newInputValue) => {
    setInputValue(newInputValue);
    
    if (newInputValue.length < 2) {
      setOptions([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/api/cities/search/', {
        params: { q: newInputValue }
      });
      setOptions(response.data.cities || []);
    } catch (err) {
      console.error('Error searching cities:', err);
      setOptions([]);
    } finally {
      setLoading(false);
    }
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
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Destination"
          fullWidth
          error={error}
          helperText={helperText}
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
            <div>{option.name}</div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>
              {option.admin1}{option.admin1 && option.country ? ', ' : ''}{option.country}
            </div>
          </Box>
        </li>
      )}
    />
  );
};

export default CitySearch; 