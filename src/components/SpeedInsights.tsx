import { injectSpeedInsights } from '@vercel/speed-insights';

export default function SpeedInsightsComponent() {
  // Initialize Speed Insights in production
  if (process.env.NODE_ENV === 'production') {
    injectSpeedInsights();
  }

  // Never render anything visible
  return null;
}
