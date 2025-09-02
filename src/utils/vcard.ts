import { downloadFile, slugify } from './index';

interface VCardData {
  name: string;
  phone: string;
  email: string;
  url?: string;
  organization?: string;
}

export function generateVCard(data: VCardData): string {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${data.name}`,
    `TEL:${data.phone}`,
    `EMAIL:${data.email}`,
    data.url ? `URL:${data.url}` : '',
    data.organization ? `ORG:${data.organization}` : '',
    'END:VCARD'
  ].filter(Boolean).join('\n');
  
  return vcard;
}

export function downloadVCard(vcard: string, filename: string): void {
  downloadFile(`${slugify(filename)}.vcf`, vcard, 'text/vcard');
}