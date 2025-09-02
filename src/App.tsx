import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

import { useLocalStorage } from './hooks/useLocalStorage';
import { useProfileData } from './hooks/useProfileData';
import { ThemeToggle, ThemeToggleRef } from './components/ThemeToggle';
import { LanguageToggle, LanguageToggleRef } from './components/LanguageToggle';
import { SettingsButton } from './components/SettingsButton';
import { KeyboardShortcuts } from './components/KeyboardShortcuts';
import { SplashScreen } from './components/SplashScreen';
import { ProfileHeader } from './components/ProfileHeader';
import { SearchBar, SearchBarRef } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { QuickActions } from './components/QuickActions';
import { VCardButton } from './components/VCardButton';
import { EnhancedLinkButton } from './components/EnhancedLinkButton';
import { ShareSection } from './components/ShareSection';
import { ContactForm } from './components/ContactForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Footer } from './components/Footer';
import { HelpModal } from './components/HelpModal';

import { STORAGE_KEYS, ANIMATION_DELAYS } from './constants';
import './i18n';

function App() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useLocalStorage(STORAGE_KEYS.DARK_MODE, false);
  const [showSplash, setShowSplash] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showHelp, setShowHelp] = useState(false);
  const [userStatus, setUserStatus] = useLocalStorage<'available' | 'busy'>(STORAGE_KEYS.USER_STATUS, 'available');
  
  const searchBarRef = useRef<SearchBarRef>(null);
  const themeToggleRef = useRef<ThemeToggleRef>(null);
  const languageToggleRef = useRef<LanguageToggleRef>(null);

  const { data, loading, error } = useProfileData();

  // Auto-update status based on time
  useEffect(() => {
    const updateStatusByTime = () => {
      const hour = new Date().getHours();
      setUserStatus(hour >= 8 && hour < 17 ? 'available' : 'busy');
    };

    updateStatusByTime();
    const interval = setInterval(updateStatusByTime, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [setUserStatus]);

  // Update document title and handle reduced motion
  useEffect(() => {
    if (data?.settings.siteName) {
      document.title = data.settings.siteName;
    }
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
  }, [data]);

  const filteredLinks = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.links;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(category => category.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.map(category => ({
        ...category,
        items: category.items.filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.items.length > 0);
    }
    
    return filtered;
  }, [data, selectedCategory, searchTerm]);

  const categories = useMemo(() => {
    return data?.links.map(category => category.category) || [];
  }, [data]);

  const keyboardActions = {
    onToggleHelp: () => setShowHelp(!showHelp),
    onToggleTheme: () => themeToggleRef.current?.toggle(),
    onToggleLanguage: () => languageToggleRef.current?.toggle(),
    onFocusSearch: () => searchBarRef.current?.focus(),
    onSelectCategory: setSelectedCategory,
    onOpenGitHub: () => {
      const githubLink = data?.links
        .flatMap(cat => cat.items)
        .find(item => item.id === 'github');
      if (githubLink) window.open(githubLink.url, '_blank');
    },
    onOpenTelegram: () => window.open('https://t.me/tainguyen2017', '_blank'),
    onOpenZalo: () => window.open(`https://zalo.me/${data?.profile.phone?.replace(/\D/g, '')}`, '_blank'),
    onOpenContact: () => {
      document.querySelector('#contact-form')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">{t('loading.profile')}</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-red-200">
          <p className="text-red-600 font-medium mb-2">{t('loading.error')}</p>
          <p className="text-slate-600 text-sm">{error || t('loading.checkData')}</p>
        </div>
      </div>
    );
  }

  const backgroundClasses = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  return (
    <>
      <AnimatePresence>
        {showSplash && (
          <SplashScreen
            profile={{ name: data.profile.name, avatar: data.profile.avatar }}
            isDark={isDark}
            onComplete={() => setShowSplash(false)}
          />
        )}
      </AnimatePresence>

      <motion.div 
        className={`relative min-h-[100svh] ${backgroundClasses} transition-all duration-500`}
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,theme(colors.blue.500/10),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.purple.500/10),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,theme(colors.pink.500/5),transparent_50%)]" />
        </div>

        <ThemeToggle ref={themeToggleRef} isDark={isDark} onToggle={() => setIsDark(!isDark)} />
        <LanguageToggle ref={languageToggleRef} isDark={isDark} />
        <SettingsButton isDark={isDark} />
        
        <KeyboardShortcuts {...keyboardActions} />
        
        <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
          <ProfileHeader 
            profile={{ ...data.profile, status: userStatus }} 
            isDark={isDark} 
          />
          
          <QuickActions 
            profile={{ phone: data.profile.phone, email: data.profile.email }}
            isDark={isDark}
          />
          
          <div className="mb-6">
            <VCardButton 
              profile={{
                name: data.profile.name,
                phone: data.profile.phone,
                email: data.profile.email
              }}
              isDark={isDark}
            />
          </div>
          
          <SearchBar 
            ref={searchBarRef}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            isDark={isDark}
          />
          
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            isDark={isDark}
          />
          
          <div className="space-y-6">
            {filteredLinks.map((category, categoryIndex) => (
              <motion.div 
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: ANIMATION_DELAYS.LINKS + categoryIndex * 0.1 }}
              >
                {filteredLinks.length > 1 && (
                  <h2 className={`text-xl font-bold mb-4 text-center ${
                    isDark ? 'text-slate-200' : 'text-slate-700'
                  }`}>
                    {category.category}
                  </h2>
                )}
                <div className="space-y-3">
                  {category.items.map((item) => (
                    <EnhancedLinkButton 
                      key={item.id} 
                      item={item} 
                      isDark={isDark}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
          
          {filteredLinks.length === 0 && searchTerm && (
            <motion.div 
              className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {t('navigation.noResults', { term: searchTerm })}
            </motion.div>
          )}
          
          <AnalyticsDashboard isDark={isDark} />
          <ShareSection isDark={isDark} />
          <ContactForm email={data.profile.email} isDark={isDark} />
          
          <Footer 
            socialMedia={data.socialMedia} 
            copyright={data.settings.copyright}
            isDark={isDark}
          />
        </div>

        <HelpModal
          isOpen={showHelp}
          onClose={() => setShowHelp(false)}
          isDark={isDark}
        />

        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDark ? '#1e293b' : '#ffffff',
              color: isDark ? '#ffffff' : '#1e293b',
              border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
              borderRadius: '12px',
              backdropFilter: 'blur(12px)',
            },
          }}
        />
      </motion.div>
    </>
  );
}

export default App;