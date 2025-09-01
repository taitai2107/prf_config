import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { getAnalytics, exportAnalyticsCSV, downloadCSV } from '../utils/analytics';
import toast from 'react-hot-toast';

interface AnalyticsDashboardProps {
  isDark: boolean;
}

export function AnalyticsDashboard({ isDark }: AnalyticsDashboardProps) {
  const { t } = useTranslation();
  const analytics = getAnalytics();
  const totalClicks = Object.values(analytics).reduce((sum, data) => sum + data.clicks, 0);

  const handleExportCSV = () => {
    const csvContent = exportAnalyticsCSV();
    const today = new Date().toISOString().split('T')[0];
    downloadCSV(`analytics_${today}.csv`, csvContent);
    toast.success(t('share.analyticsExported'));
  };

  const topLinks = Object.entries(analytics)
    .sort(([, a], [, b]) => b.clicks - a.clicks)
    .slice(0, 5);

  return (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 }}
    >
      <motion.div 
        className={`p-5 rounded-2xl backdrop-blur-md border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white/70 border-white/30'
      }`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
        >

      
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <BarChart3 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t('analytics.title')}
            </h3>
          </div>
          
          <motion.button
            onClick={handleExportCSV}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
              isDark
                ? 'bg-white/10 text-slate-300 hover:bg-white/20'
                : 'bg-white/50 text-slate-600 hover:bg-white/80'
            }`}
          >
            <Download className="w-3 h-3" />
            {t('actions.exportCSV')}
          </motion.button>
        </div>

        <div className={`p-3 rounded-xl mb-3 ${
          isDark ? 'bg-white/5' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
              {t('analytics.totalClicks', { count: totalClicks })}
            </span>
          </div>
        </div>

        {topLinks.length > 0 && (
          <div>
            <h4 className={`font-medium text-sm mb-2 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              {t('analytics.topLinks')}
            </h4>
            <div className="space-y-1.5">
              {topLinks.map(([slug, data], index) => (
                <motion.div
                  key={slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex justify-between items-center p-2.5 rounded-lg ${
                    isDark ? 'bg-white/5' : 'bg-white/50'
                  }`}
                >
                  <span className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {slug}
                  </span>
                  <span className={`text-xs font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {t('analytics.clicks', { count: data.clicks })}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}