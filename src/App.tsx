import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useProfileData } from './hooks/useProfileData';
import { ThemeToggle } from './components/ThemeToggle';
import { ProfileHeader } from './components/ProfileHeader';
import { LinkCategory } from './components/LinkCategory';
import { ShareSection } from './components/ShareSection';
import { ContactForm } from './components/ContactForm';
import { Footer } from './components/Footer';
import { Loader2 } from 'lucide-react';

function App() {
  const [isDark, setIsDark] = useLocalStorage('darkMode', false);
  const { data, loading, error } = useProfileData();

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
        <ProfileHeader profile={data.profile} isDark={isDark} />
        
        <div className="space-y-6">
          {data.links.map((category, index) => (
            <LinkCategory 
              key={index} 
              category={category} 
              isDark={isDark}
            />
          ))}
        </div>
        
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