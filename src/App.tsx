import React, { useState, useMemo } from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useProfileData } from './hooks/useProfileData';
import { ThemeToggle } from './components/ThemeToggle';
import { ProfileHeader } from './components/ProfileHeader';
import { SearchBar } from './components/SearchBar';
import { CategoryFilter } from './components/CategoryFilter';
import { QuickActions } from './components/QuickActions';
import { StatusToggle } from './components/StatusToggle';
import { VCardButton } from './components/VCardButton';
import { EnhancedLinkButton } from './components/EnhancedLinkButton';
import { ShareSection } from './components/ShareSection';
import { ContactForm } from './components/ContactForm';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userStatus, setUserStatus] = useLocalStorage<'available' | 'busy'>('userStatus', 'available');
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

  React.useEffect(() => {
    if (data?.settings.siteName) {
      document.title = data.settings.siteName;
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-slate-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="text-center p-8 rounded-2xl bg-white/80 backdrop-blur-md border border-red-200">
          <p className="text-red-600 font-medium mb-2">Error Loading Profile</p>
          <p className="text-slate-600 text-sm">{error || 'Please check your data.json file'}</p>
        </div>
      </div>
    );
  }

  const backgroundClasses = isDark
    ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
    : 'bg-gradient-to-br from-blue-50 via-white to-purple-50';

  return (
    <div className={`min-h-screen ${backgroundClasses} transition-all duration-500`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,theme(colors.blue.500/10),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,theme(colors.purple.500/10),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,theme(colors.pink.500/5),transparent_50%)]" />
      </div>

      <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
      
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-md">
        <ProfileHeader 
          profile={{
            ...data.profile,
            status: userStatus
          }} 
          isDark={isDark} 
        />
        
        <StatusToggle 
          status={userStatus}
          onStatusChange={setUserStatus}
          isDark={isDark}
        />
        
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
          {filteredLinks.map((category, index) => (
            <div key={index}>
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
            </div>
          ))}
        </div>
        
        {filteredLinks.length === 0 && searchTerm && (
          <div className={`text-center py-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Không tìm thấy link nào với từ khóa "{searchTerm}"
          </div>
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
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
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
    </div>
  );
}

export default App;