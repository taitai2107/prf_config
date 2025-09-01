import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { MapPin, Contact2, Circle } from 'lucide-react';

interface ProfileHeaderProps {
  profile: {
    name: string;
    bio: string;
    description: string;
    avatar: string;
    location: string;
    status: 'available' | 'busy';
  };
  isDark: boolean;
}

export function ProfileHeader({ profile, isDark }: ProfileHeaderProps) {
  const { t } = useTranslation();

  return (
    <motion.div 
      className="text-center mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="relative inline-block mb-6"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <motion.img
          src={profile.avatar}
          alt={profile.name}
          className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-white/20 shadow-xl hover:scale-105 transition-transform duration-300"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <motion.div 
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Status indicator */}
        <motion.div 
          className={`absolute bottom-2 right-2 p-2 rounded-full border-2 border-white ${
          profile.status === 'available' ? 'bg-green-500' : 'bg-red-500'
        }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <Circle className="w-3 h-3 fill-current text-white" />
        </motion.div>
      </motion.div>
      
      <motion.h1 
        className={`text-3xl font-bold mb-2 bg-gradient-to-r ${
        isDark 
          ? 'from-blue-400 to-purple-400' 
          : 'from-blue-600 to-purple-600'
      } bg-clip-text text-transparent`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {profile.name}
      </motion.h1>
      
      <motion.p 
        className={`text-lg font-medium mb-3 ${
        isDark ? 'text-slate-300' : 'text-slate-600'
      }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {profile.bio}
      </motion.p>
      
      <motion.p 
        className={`flex items-center justify-center gap-2 ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Contact2 className="w-4 h-4" />
        {profile.description}
      </motion.p>
      
      <motion.div 
        className={`flex items-center justify-center gap-2 ${
        isDark ? 'text-slate-400' : 'text-slate-500'
      }`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{profile.location}</span>
      </motion.div>
    </motion.div>
  );
}