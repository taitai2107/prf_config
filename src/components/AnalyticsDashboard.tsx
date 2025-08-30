import React from 'react';
import { BarChart3, Download, TrendingUp } from 'lucide-react';
import { getAnalytics, exportAnalyticsCSV, downloadCSV } from '../utils/analytics';
import toast from 'react-hot-toast';

interface AnalyticsDashboardProps {
  isDark: boolean;
}

export function AnalyticsDashboard({ isDark }: AnalyticsDashboardProps) {
  const analytics = getAnalytics();
  const totalClicks = Object.values(analytics).reduce((sum, data) => sum + data.clicks, 0);

  const handleExportCSV = () => {
    const csvContent = exportAnalyticsCSV();
    const today = new Date().toISOString().split('T')[0];
    downloadCSV(`analytics_${today}.csv`, csvContent);
    toast.success('Analytics đã được xuất');
  };

  const topLinks = Object.entries(analytics)
    .sort(([, a], [, b]) => b.clicks - a.clicks)
    .slice(0, 5);

  return (
    <div className="mb-8">
      <div className={`p-6 rounded-2xl backdrop-blur-md border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white/70 border-white/30'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Thống kê
            </h3>
          </div>
          
          <button
            onClick={handleExportCSV}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              isDark
                ? 'bg-white/10 text-slate-300 hover:bg-white/20'
                : 'bg-white/50 text-slate-600 hover:bg-white/80'
            }`}
          >
            <Download className="w-4 h-4" />
            Xuất CSV
          </button>
        </div>

        <div className={`p-4 rounded-xl mb-4 ${
          isDark ? 'bg-white/5' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className={`w-4 h-4 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
              Tổng lượt click: {totalClicks}
            </span>
          </div>
        </div>

        {topLinks.length > 0 && (
          <div>
            <h4 className={`font-medium mb-3 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
              Top Links
            </h4>
            <div className="space-y-2">
              {topLinks.map(([slug, data]) => (
                <div
                  key={slug}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    isDark ? 'bg-white/5' : 'bg-white/50'
                  }`}
                >
                  <span className={`text-sm ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    {slug}
                  </span>
                  <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {data.clicks} clicks
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}