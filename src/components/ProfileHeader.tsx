import React from 'react';
import { MapPin } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    name: string;
    bio: string;
    description: string;
    avatar: string;
    location: string;
  };
  isDark: boolean;
}

export function ProfileHeader({ profile, isDark }: ProfileHeaderProps) {
  return (
    <div className="text-center mb-8 animate-fadeIn">
      <div className="relative inline-block mb-6">
        <img
          src={profile.avatar}
          alt={profile.name}
          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-xl hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 animate-pulse" />
      </div>
      
      <h1 className={`text-3xl font-bold mb-2 bg-gradient-to-r ${
        isDark 
          ? 'from-blue-400 to-purple-400' 
          : 'from-blue-600 to-purple-600'
      } bg-clip-text text-transparent`}>
        {profile.name}
      </h1>
      
      <p className={`text-lg font-medium mb-3 ${
        isDark ? 'text-slate-300' : 'text-slate-600'
      }`}>
        {profile.bio}
      </p>
      
      <p className={`max-w-md mx-auto leading-relaxed mb-4 ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        {profile.description}
      </p>
      
      <div className={`flex items-center justify-center gap-2 ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}>
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{profile.location}</span>
      </div>
    </div>
  );
}