import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { injectSpeedInsights } from '@vercel/speed-insights';

export default function SpeedInsightsComponent() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Only initialize Speed Insights in production
    if (process.env.NODE_ENV === 'production') {
      injectSpeedInsights();
      setLoading(false);
    }
  }, []);

  // Only render in production
  if (process.env.NODE_ENV !== 'production') {
    return null;
  }

  if (loading) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Speed Insights
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="body1">
            This component will display speed insights and performance metrics.
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
}
