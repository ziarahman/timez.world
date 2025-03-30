import { Box, Typography, Paper, Grid, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';

export default function SpeedInsightsComponent() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

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
