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
  isProtected?: boolean;
  password?: string;
  clicks?: number;
  healthStatus?: 'healthy' | 'warning' | 'error';
}

export interface LinkCategory {
  category: string;
  items: LinkItem[];
}

export interface ProfileData {
  profile: {
    name: string;
    bio: string;
    description: string;
    avatar: string;
    location: string;
    email: string;
    phone: string;
    status: 'available' | 'busy';
  };
  links: LinkCategory[];
  socialMedia: Array<{
    platform: string;
    url: string;
    icon: string;
  }>;
  settings: {
    siteName: string;
    copyright: string;
    enableAnalytics: boolean;
    theme: {
      primaryColor: string;
      accentColor: string;
    };
  };
}

export interface AnalyticsData {
  [slug: string]: {
    clicks: number;
    dailyClicks: { [date: string]: number };
    devices: { mobile: number; desktop: number };
    referrers: { [referrer: string]: number };
  };
}