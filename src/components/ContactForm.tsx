import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Send } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactFormProps {
  email: string;
  isDark: boolean;
}

export function ContactForm({ email, isDark }: ContactFormProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name ||!formData.email|| !formData.message) {
      toast.error(t('contact.fillRequired'));
      return;
    }

    const subject = `Tin nhắn liên hệ từ ${formData.name} website của bạn`;
    const body = `Tên tôi là: ${formData.name}%0D%0ATừ email: ${formData.email}%0D%0A%0D%0ATin nhắn:%0D%0A${formData.message}`;
    const mailtoUrl = `mailto:tainguyencongkhanh@gmail.com?subject=${subject}&body=${body}`;

    
    window.location.href = mailtoUrl;
    toast.success(t('contact.emailSent'));
    
    // Reset form
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div 
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.6 }}
    >
      <motion.div 
        className={`p-6 rounded-2xl backdrop-blur-md border ${
        isDark
          ? 'bg-white/5 border-white/10'
          : 'bg-white/70 border-white/30'
      }`}
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3 mb-4">
          <Mail className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
          <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {t('contact.title')}
          </h3>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="name"
              placeholder={t('contact.name')}
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10'
                  : 'bg-white/50 border-white/30 text-slate-800 placeholder-slate-500 focus:bg-white/80'
              }`}
            />
          </div>
          
            <div>
            <input
              type="email"
              name="email"
              placeholder={t('contact.email')}
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10'
                  : 'bg-white/50 border-white/30 text-slate-800 placeholder-slate-500 focus:bg-white/80'
              }`}
            />
          </div>
          
          <div>
            <textarea
              name="message"
              placeholder={t('contact.message')}
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none ${
                isDark
                  ? 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10'
                  : 'bg-white/50 border-white/30 text-slate-800 placeholder-slate-500 focus:bg-white/80'
              }`}
            />
          </div>
          
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg transform hover:scale-[1.02]"
          >
            <Send className="w-4 h-4" />
            {t('actions.send')}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
}