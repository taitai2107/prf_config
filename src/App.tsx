import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Toaster } from 'react-hot-toast';
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
import { StatusToggle } from './components/StatusToggle';
import { VCardButton } from './components/VCardButton';
import { EnhancedLinkButton } from './components/EnhancedLinkButton';
import { ShareSection } from './components/ShareSection';
import { ContactForm } from './components/ContactForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Footer } from './components/Footer';
import { HelpModal } from './components/HelpModal';
import { Loader2 } from 'lucide-react';
import './i18n';

function App() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);
  const [showSplash, setShowSplash] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showHelp, setShowHelp] = useState(false);
  const [userStatus, setUserStatus] = useLocalStorage<'available' | 'busy'>('userStatus', 'available');
  const searchBarRef = React.useRef<SearchBarRef>(null);
  const themeToggleRef = React.useRef<ThemeToggleRef>(null);
  const languageToggleRef = React.useRef<LanguageToggleRef>(null);

  React.useEffect(() => {
    const updateStatusByTime = () => {
      const hour = new Date().getHours();
      if (hour >= 8 && hour < 17) {
        setUserStatus('available');
      } else {
        setUserStatus('busy');
      }
    };

    updateStatusByTime(); // gọi ngay lần đầu
    const interval = setInterval(updateStatusByTime, 5 * 60 * 1000); // 5 phút cập nhật lại 1 lần

    return () => clearInterval(interval); // dọn dẹp khi unmount
  }, []);
  const { data, loading, error } = useProfileData();

  const filteredLinks = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.links;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(category => category.category === selectedCategory);
    }
    
    // Filter by search term
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
    if (!data) return [];
    return data.links.map(category => category.category);
  }, [data]);

  const handleOpenGitHub = () => {
    const githubLink = data?.links
      .flatMap(cat => cat.items)
      .find(item => item.id === 'github');
    if (githubLink) {
      window.open(githubLink.url, '_blank');
    }
  };

  const handleOpenTelegram = () => {
    window.open('https://t.me/tainguyen2017', '_blank');
  };

  const handleOpenZalo = () => {
    window.open(`https://zalo.me/${data?.profile.phone?.replace(/\D/g, '')}`, '_blank');
  };

  const handleOpenContact = () => {
    const contactSection = document.querySelector('#contact-form');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    if (data?.settings.siteName) {
      document.title = data.settings.siteName;
    }
    
    // Add reduced motion CSS
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
  }, [data]);

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
        {showSplash && data && (
          <SplashScreen
            profile={{
              name: data.profile.name,
              avatar: data.profile.avatar
            }}
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
        <motion.div 
          className="absolute inset-0 opacity-30"
          animate={{
            background: [
              'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 40% 40%, rgba(236, 72, 153, 0.05) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,theme(colors.blue.500/10),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.purple.500/10),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,theme(colors.pink.500/5),transparent_50%)]" />
        </motion.div>

      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      <ThemeToggle ref={themeToggleRef} isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      <LanguageToggle ref={languageToggleRef} isDark={isDark} />
      <SettingsButton isDark={isDark} />
      
      <KeyboardShortcuts
        onToggleHelp={() => setShowHelp(!showHelp)}
        onToggleTheme={() => setIsDark(!isDark)}
        onToggleLanguage={() => languageToggleRef.current?.toggle()}
        onFocusSearch={() => searchBarRef.current?.focus()}
        onSelectCategory={setSelectedCategory}
        onOpenGitHub={handleOpenGitHub}
        onOpenTelegram={handleOpenTelegram}
        onOpenZalo={handleOpenZalo}
        onOpenContact={handleOpenContact}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        <ProfileHeader 
          profile={{
            ...data.profile,
            status: userStatus
          }} 
          isDark={isDark} 
        />
        
        {/* <StatusToggle 
          status={userStatus}
          onStatusChange={setUserStatus}
          isDark={isDark}
        /> */}
        
        <QuickActions 
          profile={{
            phone: data.profile.phone,
            email: data.profile.email
          }}
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
              transition={{ duration: 0.5, delay: 1.2 + categoryIndex * 0.1 }}
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
        <div id="contact-form">
          <ContactForm email={data.profile.email} isDark={isDark} />
        </div>
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

        <style jsx global>{`
          :root {
            --animation-duration: 0.3s;
          }
          
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
          @keyframes ripple {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            100% {
              transform: scale(4);
              opacity: 0;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        body {
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
      `}</style>
      </motion.div>
    </>
  );
}

export default App;