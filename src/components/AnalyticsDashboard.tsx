import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { getAnalytics, exportAnalyticsCSV, downloadFile } from '../utils';
import { ANIMATION_DELAYS } from '../constants';
import { formatDate } from '../utils/format';
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
    const today = formatDate(new Date().toISOString());
    downloadFile(`analytics_${today}.csv`, csvContent, 'text/csv');
    toast.success(t('share.analyticsExported'));
  };

  const topLinks = Object.entries(analytics)
    .sort(([, a], [, b]) => b.clicks - a.clicks)
    .slice(0, 5);

  if (totalClicks === 0) return null;

  return (
    <Card isDark={isDark} delay={ANIMATION_DELAYS.ANALYTICS} className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {t('analytics.title')}
          </h3>
        </div>
        
        <Button
          onClick={handleExportCSV}
          variant="ghost"
          size="sm"
          icon={Download}
          isDark={isDark}
        >
          {t('actions.exportCSV')}
        </Button>
      </div>

      <div className={`p-3 rounded-xl mb-4 ${isDark ? 'bg-white/5' : 'bg-slate-50'}`}>
        <div className="flex items-center gap-2">
          <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
          <span className={`font-medium text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {t('analytics.totalClicks', { count: totalClicks })}
          </span>
        </div>
      </div>

      {topLinks.length > 0 && (
        <div>
          <h4 className={`font-medium text-sm mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
            {t('analytics.topLinks')}
          </h4>
          <div className="space-y-2">
            {topLinks.map(([slug, data], index) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`flex justify-between items-center p-3 rounded-lg ${
                  isDark ? 'bg-white/5' : 'bg-white/50'
                }`}
              >
                <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  {slug}
                </span>
                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                  {t('analytics.clicks', { count: data.clicks })}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}