import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  IconButton,
  Divider,
} from '@mui/material';
import {
  WbSunny as SunIcon,
  Cloud as CloudIcon,
  Opacity as RainIcon,
  Air as WindIcon,
  Navigation as WindDirectionIcon,
  DeviceThermostat as TempIcon,
  WaterDrop as HumidityIcon,
} from '@mui/icons-material';

interface WeatherData {
  date: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  condition: 'sunny' | 'cloudy' | 'rainy';
  precipitation: number;
}

const mockForecast: WeatherData[] = [
  {
    date: '2024-03-15',
    temp: 75,
    humidity: 65,
    windSpeed: 8,
    windDirection: 45,
    condition: 'sunny',
    precipitation: 0,
  },
  {
    date: '2024-03-16',
    temp: 72,
    humidity: 70,
    windSpeed: 10,
    windDirection: 90,
    condition: 'cloudy',
    precipitation: 20,
  },
  {
    date: '2024-03-17',
    temp: 68,
    humidity: 85,
    windSpeed: 12,
    windDirection: 180,
    condition: 'rainy',
    precipitation: 80,
  },
  {
    date: '2024-03-18',
    temp: 70,
    humidity: 75,
    windSpeed: 9,
    windDirection: 225,
    condition: 'cloudy',
    precipitation: 30,
  },
  {
    date: '2024-03-19',
    temp: 73,
    humidity: 68,
    windSpeed: 7,
    windDirection: 270,
    condition: 'sunny',
    precipitation: 0,
  },
];

const getWeatherIcon = (condition: string) => {
  switch (condition) {
    case 'sunny':
      return <SunIcon sx={{ color: '#FFB300', fontSize: 40 }} />;
    case 'cloudy':
      return <CloudIcon sx={{ color: '#78909C', fontSize: 40 }} />;
    case 'rainy':
      return <RainIcon sx={{ color: '#42A5F5', fontSize: 40 }} />;
    default:
      return <SunIcon sx={{ color: '#FFB300', fontSize: 40 }} />;
  }
};

export const WeatherForecast: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" mb={3}>
          <WbSunny sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
          <Typography variant="h6">Weather Forecast</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Current Weather */}
          <Grid item xs={12} md={4}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Current Weather
                </Typography>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    {getWeatherIcon(mockForecast[0].condition)}
                    <Typography variant="h3" sx={{ mt: 1 }}>
                      {mockForecast[0].temp}°F
                    </Typography>
                  </Box>
                  <Box>
                    <Box display="flex" alignItems="center" mb={1}>
                      <HumidityIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>{mockForecast[0].humidity}% Humidity</Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <WindIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Typography>{mockForecast[0].windSpeed} mph</Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* 5-Day Forecast */}
          <Grid item xs={12} md={8}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  5-Day Forecast
                </Typography>
                <Grid container spacing={2}>
                  {mockForecast.map((day, index) => (
                    <Grid item xs={12} sm={2.4} key={index}>
                      <Box
                        textAlign="center"
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'background.default',
                        }}
                      >
                        <Typography variant="subtitle2">
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                        </Typography>
                        {getWeatherIcon(day.condition)}
                        <Typography variant="h6">{day.temp}°F</Typography>
                        <Typography variant="body2" color="textSecondary">
                          {day.precipitation}% rain
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Weather Alerts */}
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ bgcolor: 'info.light' }}>
              <CardContent>
                <Typography variant="subtitle1" color="info.contrastText">
                  Weather Alert: Ideal conditions for crop irrigation in the next 24 hours
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Agricultural Insights */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Agricultural Insights
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Soil Conditions
                      </Typography>
                      <Typography variant="body2">
                        Moisture levels optimal for planting
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Pest Risk
                      </Typography>
                      <Typography variant="body2">
                        Low risk due to current weather patterns
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box>
                      <Typography variant="subtitle2" color="primary">
                        Growth Forecast
                      </Typography>
                      <Typography variant="body2">
                        Favorable conditions for crop development
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
