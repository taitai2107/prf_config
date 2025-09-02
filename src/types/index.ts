export interface LinkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  icon: string;
  color: string;
  badge?: 'NEW' | 'HOT' | 'PRIVATE' | 'HIDDEN';
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
  deviceOnly?: 'mobile' | 'desktop';
  clicks?: number;
  healthStatus?: 'healthy' | 'warning' | 'error';
}

export interface LinkCategory {
  category: string;
  items: LinkItem[];
}

export interface Profile {
  name: string;
  bio: string;
  description: string;
  avatar: string;
  location: string;
  email: string;
  phone: string;
  status: 'available' | 'busy';
}

export interface SocialMedia {
  platform: string;
  url: string;
  icon: string;
}

export interface Settings {
  siteName: string;
  copyright: string;
  enableAnalytics: boolean;
  theme: {
    primaryColor: string;
    accentColor: string;
  };
}

export interface ProfileData {
  profile: Profile;
  links: LinkCategory[];
  socialMedia: SocialMedia[];
  settings: Settings;
}

export interface AnalyticsData {
  [slug: string]: {
    clicks: number;
    dailyClicks: { [date: string]: number };
    devices: { mobile: number; desktop: number };
    referrers: { [referrer: string]: number };
  };
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  file: string;
  duration: number;
}