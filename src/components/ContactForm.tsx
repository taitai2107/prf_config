import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Mail, Send } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ANIMATION_DELAYS } from '../constants';
import { sanitizeInput, isValidEmail } from '../utils';
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
    
    const { name, email: userEmail, message } = formData;
    
    if (!name || !userEmail || !message) {
      toast.error(t('contact.fillRequired'));
      return;
    }

    if (!isValidEmail(userEmail)) {
      toast.error('Email không hợp lệ');
      return;
    }

    const subject = `Tin nhắn liên hệ từ ${sanitizeInput(name)} website của bạn`;
    const body = `Tên tôi là: ${sanitizeInput(name)}%0D%0ATừ email: ${userEmail}%0D%0A%0D%0ATin nhắn:%0D%0A${sanitizeInput(message)}`;
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;
    toast.success(t('contact.emailSent'));
    
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const inputClasses = `w-full px-4 py-3 rounded-xl border backdrop-blur-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${
    isDark
      ? 'bg-white/5 border-white/10 text-white placeholder-slate-400 focus:bg-white/10'
      : 'bg-white/50 border-white/30 text-slate-800 placeholder-slate-500 focus:bg-white/80'
  }`;

  return (
    <Card isDark={isDark} delay={ANIMATION_DELAYS.CONTACT} className="mb-8" id="contact-form">
      <div className="flex items-center gap-3 mb-4">
        <Mail className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>
          {t('contact.title')}
        </h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder={t('contact.name')}
          value={formData.name}
          onChange={handleChange}
          className={inputClasses}
          required
        />
        
        <input
          type="email"
          name="email"
          placeholder={t('contact.email')}
          value={formData.email}
          onChange={handleChange}
          className={inputClasses}
          required
        />
        
        <textarea
          name="message"
          placeholder={t('contact.message')}
          rows={4}
          value={formData.message}
          onChange={handleChange}
          className={`${inputClasses} resize-none`}
          required
        />
        
        <Button
          type="submit"
          variant="primary"
          icon={Send}
          className="w-full"
        >
          {t('actions.send')}
        </Button>
      </form>
    </Card>
  );
}