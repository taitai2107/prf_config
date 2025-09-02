import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

export function useClipboard() {
  const { t } = useTranslation();
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  const copyToClipboard = async (id: string, text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItem(id);
      toast.success(`${t('actions.copied')} ${label}`);
      setTimeout(() => setCopiedItem(null), 2000);
    } catch {
      toast.error('Copy failed');
    }
  };

  return { copyToClipboard, copiedItem };
}