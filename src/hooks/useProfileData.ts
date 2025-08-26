import { useState, useEffect } from 'react';

export interface ProfileData {
  profile: {
    name: string;
    bio: string;
    description: string;
    avatar: string;
    location: string;
    email: string;
  };
  links: Array<{
    category: string;
    items: Array<{
      title: string;
      url: string;
      description: string;
      icon: string;
      color: string;
    }>;
  }>;
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

export function useProfileData() {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error('Failed to load profile data');
        }
        const profileData = await response.json();
        setData(profileData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
}