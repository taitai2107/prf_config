import { AnalyticsData } from '../types';
import { STORAGE_KEYS } from '../constants';

export function getAnalytics(): AnalyticsData {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function trackClick(slug: string, device: 'mobile' | 'desktop', referrer: string = 'direct'): void {
  const analytics = getAnalytics();
  const today = new Date().toISOString().split('T')[0];
  
  if (!analytics[slug]) {
    analytics[slug] = {
      clicks: 0,
      dailyClicks: {},
      devices: { mobile: 0, desktop: 0 },
      referrers: {}
    };
  }
  
  analytics[slug].clicks++;
  analytics[slug].dailyClicks[today] = (analytics[slug].dailyClicks[today] || 0) + 1;
  analytics[slug].devices[device]++;
  analytics[slug].referrers[referrer] = (analytics[slug].referrers[referrer] || 0) + 1;
  
  localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
}

export function exportAnalyticsCSV(): string {
  const analytics = getAnalytics();
  const rows = ['Slug,Total Clicks,Mobile,Desktop,Last 7 Days'];
  
  Object.entries(analytics).forEach(([slug, data]) => {
    const last7Days = Object.entries(data.dailyClicks)
      .slice(-7)
      .reduce((sum, [, clicks]) => sum + clicks, 0);
    
    rows.push(`${slug},${data.clicks},${data.devices.mobile},${data.devices.desktop},${last7Days}`);
  });
  
  return rows.join('\n');
}

export function downloadFile(filename: string, content: string, type: string = 'text/plain'): void {
  const blob = new Blob([content], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}