import { injectSpeedInsights } from '@vercel/speed-insights'

export default function SpeedInsightsComponent() {
  injectSpeedInsights()
  return null
}
